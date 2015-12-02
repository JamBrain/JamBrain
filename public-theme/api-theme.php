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
	(2*7*24*60*60) - ((24+21)*60*60),//- (18*60*60),
	(1*7*24*60*60) - (18*60*60),
	(2*24*60*60) - (3*60*60),
	(30*60),
	0,
	0,
];

// Date Hack //
$EVENT_MODE_DATE = $EVENT_DATE->getTimestamp() - THEME_MODE_TIMES[$EVENT_MODE];
$EVENT_MODE_DIFF = $EVENT_MODE_DATE - time();

function IsThemeSuggestionsOpen() {
	global $EVENT_MODE, $EVENT_MODE_DIFF;
	return ($EVENT_MODE == 1) && ($EVENT_MODE_DIFF > 0);
}
function IsThemeSlaughterOpen() {
	global $EVENT_MODE, $EVENT_MODE_DIFF;
	return ($EVENT_MODE == 2) && ($EVENT_MODE_DIFF > 0);
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
		else if ( $action == "IDEA" /*&& IsThemeSlaughterOpen()*/ ) {
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
//			if ( $user_id > 0 ) {
//				$response['mystats'] = theme_GetMyIdeaStats($user_id);
//			}
			$response['stats'] = theme_GetIdeaStats();
			$response['hourly'] = theme_GetIdeaHourlyStats();
		}
	}
}
else if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['action'])) {
	switch (trim($_GET['action'])) {
	case "RANDOM":
		$response = theme_GetRandom($EVENT_NODE);
		break;
	};
}

json_Emit($response);
