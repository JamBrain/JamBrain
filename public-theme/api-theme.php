<?php
require_once __DIR__."/../api.php";
require_once __DIR__."/../db.php";
require_once __DIR__."/../core/config.php";
require_once __DIR__."/../core/theme.php";
require_once __DIR__."/../core/legacy_user.php";

config_Load();

$EVENT_NAME = "Ludum Dare 34";
$EVENT_MODE = 1;
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

function AreThemeIdeasOpen() {
	global $EVENT_MODE, $EVENT_MODE_DIFF;
	return ($EVENT_MODE == 1) && ($EVENT_MODE_DIFF > 0);
}
function AreThemeSlaughterOpen() {
	global $EVENT_MODE, $EVENT_MODE_DIFF;
	return ($EVENT_MODE == 2) && ($EVENT_MODE_DIFF > 0);
}


$response = json_NewResponse();

// MAIN (Only accept POST requests) //
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action'])) {
	$action = trim($_POST['action']);
	
	$user_id = legacy_GetUserFromCookie();
	
	$max_themes = 3;
	
	//$response['EVENT_MODE'] = $EVENT_MODE;
	//$response['EVENT_MODE_DIFF'] = $EVENT_MODE_DIFF;

	if ( ($user_id > 0) && ($EVENT_NODE > 0) ) {
		if ( $action == "GETMY" ) {
			$response['ideas'] = theme_GetMyIdeas($EVENT_NODE,$user_id);
			$response['count'] = count($response['ideas']);
		}
		else if ( ($action == "ADD") && isset($_POST['idea']) && AreThemeIdeasOpen() ) {
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
		else if ( $action == "REMOVE" && AreThemeIdeasOpen() ) {
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
		else if ( $action == "IDEA" /*&& AreThemeSuggestionOpen()*/ ) {
			// TODO: Confirm theme is on valid list
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
