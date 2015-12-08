<?php
require_once __DIR__."/../api.php";
require_once __DIR__."/../db.php";
require_once __DIR__."/../core/config.php";
require_once __DIR__."/../core/theme.php";
require_once __DIR__."/../core/legacy_user.php";

config_Load();

$EVENT_NAME = "Ludum Dare 34";
$EVENT_MODE = 2;
$EVENT_NODE = 100;//intval($CONFIG['event-active']);//isset($_POST['node']) ? intval($_POST['node']) : 0;
$EVENT_DATE = new DateTime("2015-12-12T02:00:00Z");

// HACK, don't hardcode me! //
const THEME_MODE_TIMES = [
	0,
	(2*7*24*60*60) - ((24+21)*60*60),
	(1*7*24*60*60) - (18*60*60),
	(2*24*60*60),
	(30*60),
	0,
	0,
];


const THEME_VOTE_START_TIMES = [
	(5*24*60*60) - (12*60*60),
	(5*24*60*60) - (24*60*60),
	(4*24*60*60) - (12*60*60),
	(4*24*60*60) - (18*60*60),
];

const THEME_VOTE_END_TIMES = [
	(4*24*60*60) - (24*60*60),
	(4*24*60*60) - (32*60*60),
	(3*24*60*60) - (18*60*60),
	(3*24*60*60) - (24*60*60),
];

$THEME_VOTE_START_DATE = [];
$THEME_VOTE_START_DIFF = [];
$THEME_VOTE_END_DATE = [];
$THEME_VOTE_END_DIFF = [];

// Date Hack //
$EVENT_MODE_DATE = $EVENT_DATE->getTimestamp() - THEME_MODE_TIMES[$EVENT_MODE];
$EVENT_MODE_DIFF = $EVENT_MODE_DATE - time();

$EVENT_VOTE_ACTIVE = 3;
for( $idx = 0; $idx < count(THEME_VOTE_START_TIMES); $idx++ ) {
	$THEME_VOTE_START_DATE[$idx] = $EVENT_DATE->getTimestamp() - THEME_VOTE_START_TIMES[$idx];
	$THEME_VOTE_START_DIFF[$idx] = $THEME_VOTE_START_DATE[$idx] - time();
	$THEME_VOTE_END_DATE[$idx] = $EVENT_DATE->getTimestamp() - THEME_VOTE_END_TIMES[$idx];
	$THEME_VOTE_END_DIFF[$idx] = $THEME_VOTE_END_DATE[$idx] - time();
	
	if ( $THEME_VOTE_START_DIFF[$idx] <= 0 ) {
		$EVENT_VOTE_ACTIVE = $idx;
	}
}


function IsThemeSuggestionsOpen() {
	global $EVENT_MODE, $EVENT_MODE_DIFF;
	return ($EVENT_MODE == 1) && ($EVENT_MODE_DIFF > 0);
}
function IsThemeSlaughterOpen() {
	global $EVENT_MODE, $EVENT_MODE_DIFF;
	return ($EVENT_MODE == 2) && ($EVENT_MODE_DIFF > 0);
}
function IsThemeVotingOpen() {
	global $EVENT_MODE, $EVENT_MODE_DIFF;
	return ($EVENT_MODE == 3) && ($EVENT_MODE_DIFF > 0);
}


$response = json_NewResponse();

// MAIN (Only accept POST requests) //
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action'])) {
	$action = trim($_POST['action']);
	
	$user_id = legacy_GetUserFromCookie();

	$ADMIN = defined('LEGACY_DEBUG') || $user_id === 19;
	
	$max_themes = 3;
	
	//$response['EVENT_MODE'] = $EVENT_MODE;
	//$response['EVENT_MODE_DIFF'] = $EVENT_MODE_DIFF;

	// User Account Required //
	if ( ($user_id > 0) && ($EVENT_NODE > 0) ) {
		if ( $action == "GETMY" ) {
			$response['ideas'] = theme_GetMyIdeas($EVENT_NODE,$user_id);
			$response['count'] = count($response['ideas']);
		}
		else if ( ($action == "ADD") && isset($_POST['idea']) && IsThemeSuggestionsOpen() ) {
			$idea = mb_trim($_POST['idea']);
	
			if ( $idea !== "" ) {
				$idea = mb_substr($idea,0,64);	// Shorten the query and fix the response 

				$response = theme_AddMyIdeaWithLimit($idea,$EVENT_NODE,$user_id,$max_themes);
				if ( $response['id'] !== 0 ) {
					$response['idea'] = $idea;
				}
			}
			else {
				$response['id'] = 0;
			}
		}
		else if ( $action == "REMOVE" && IsThemeSuggestionsOpen() ) {
			$theme_id = intval($_POST['id']);
			if ( $theme_id > 0 ) {
				$ret = theme_RemoveMyIdea($theme_id,$user_id);
				if ( $ret ) {
					$response['id'] = $theme_id;
				}
				
				$response['count'] = theme_CountMyIdeas($EVENT_NODE,$user_id);
			}
			else {
				$response['id'] = 0;
			}
		}
		else if ( $action == "IDEA" && IsThemeSlaughterOpen() ) {
			$theme_id = intval($_POST['id']);
			$value = intval($_POST['value']);
			if ( $theme_id > 0 && ($value <= 1) && ($value >= -1) ) {
				$id_list = theme_GetIdeaList($EVENT_NODE);
				
				// Confirm theme is on the list //
				if ( isset($id_list[$theme_id]) ) {
					$response['id'] = theme_AddIdeaVote($theme_id,$value,$user_id);
					$response['idea_id'] = $theme_id;
				}
				else {
					$response['id'] = 0;
				}
			}
		}
		else if ( $action == "GETIDEAS" /*&& IsThemeSlaughterOpen()*/ ) {
			$idea_votes = theme_GetMyIdeaVotes($user_id,10);
			
			$idea_list = theme_GetIdeaList($EVENT_NODE);
			$response['id'] = $user_id;
			$response['ideas'] = [];
			foreach ( $idea_votes as $vote ) {
				if ( isset($idea_list[$vote['node']]) ) {
					$response['ideas'][] = ['id' => $vote['node'], 'idea' => $idea_list[$vote['node']], 'value' => $vote['value']];
				}
			}
		}
		else if ( $action == "VOTE" /*&& IsThemeVotingOpen()*/ ) {
			$theme_id = intval($_POST['id']);
			$value = intval($_POST['value']);
			if ( $theme_id > 0 && ($value <= 1) && ($value >= -1) ) {
				$list = theme_GetThemeValidVotingList($EVENT_NODE);
				
				// Confirm theme is on the list //
				if ( isset($list[$theme_id]) && $THEME_VOTE_START_DIFF[$list[$theme_id]['page']] <= 0 && $THEME_VOTE_END_DIFF[$list[$theme_id]['page']] > 0 ) {
					$response['id'] = theme_AddVote($theme_id,$value,$user_id);
					$response['idea_id'] = $theme_id;
				}
				else {
					$response['id'] = 0;
				}
			}
		}
		else if ( $action == "GETVOTES" /*&& IsThemeVotingOpen()*/ ) {
			$votes = theme_GetMyVotes($user_id);
			
			$list = theme_GetThemeValidVotingList($EVENT_NODE);
			$response['id'] = $user_id;
			$response['votes'] = [];
			foreach ( $votes as $vote ) {
				if ( isset($list[$vote['node']]) ) {
					$response['votes'][] = ['id' => $vote['node'], 'idea' => $list[$vote['node']], 'value' => $vote['value']];
				}
			}
		}	
		else if ( $action == "SETPARENT" && $ADMIN /*&& IsThemeSlaughterOpen()*/ ) {
			$parent = intval($_POST['parent']);
			$children = [];
			foreach( $_POST['children'] as $child ) {
				if ( intval($child) !== $parent )
					$children[] = intval($child);
			}
			
			foreach( $children as $child ) {
				theme_SetParent($child,$parent);
			}
			theme_SetParent($parent,0);
			
			$response['parent'] = $parent;
			$response['children'] = $children;
		}
	}
	
	// No User Account Required //
	if ( $EVENT_NODE > 0 ) {
		if ( $action == "GETIDEASTATS" ) {
			if ( $user_id > 0 ) {
				$response['mystats'] = theme_GetMyIdeaStats($user_id);
			}
			$response['stats'] = theme_GetIdeaStats();
			$response['hourly'] = theme_GetIdeaHourlyStats();
			
			$idea_list = theme_GetIdeaList($EVENT_NODE);
			
			$response['count'] = count($idea_list);
			$response['count_with_duplicates'] = theme_CountIdeas($EVENT_NODE);
			
			$response['users_with_ideas'] = theme_CountUsersWithIdeas($EVENT_NODE);
			$response['users_that_kill'] = theme_CountUsersThatKill($EVENT_NODE);
			
			$kill_counts = theme_GetUserKillCounts();
			$ret_kills = [];
			
			foreach ( $kill_counts as $count ) {
//				if ( $count < 400 ) {
//					$idx = (floor($count/50)*50);
//					$key = (floor($count/50)*50) . " - " . (((floor($count/50)+1)*50)-1);
//				}
//				else {
//					$idx = (floor($count/200)*200);
//					$key = (floor($count/200)*200) . " - " . (((floor($count/200)+1)*200)-1);
//				}
					$idx = (floor($count/100)*100);
					$key = (floor($count/100)*100) . " - " . (((floor($count/100)+1)*100)-1);
				
				if ( isset($ret_kills[$idx]) )
					$ret_kills[$idx][1]++;
				else
					$ret_kills[$idx] = [$key, 1];
			}
			
			ksort($ret_kills);
			$response['kill_counts'] = array_values($ret_kills);
		}
		else if ( $action == "GET_VOTING_LIST" ) {
			$response['themes'] = theme_GetThemeVotingList($EVENT_NODE);
		}
	}
}
else if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['action'])) {
	switch (trim($_GET['action'])) {
	case "RANDOM":
		$response = theme_GetRandom($EVENT_NODE);
		break;
	case "GET_ALL_IDEAS":
		$response['ideas'] = theme_GetIdeaList($EVENT_NODE);
		break;
	case "GET_VOTING_LIST":
		$response['theme'] = theme_GetThemeVotingList($EVENT_NODE,100);
		break;
	};
}

json_Emit($response);
