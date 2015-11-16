<?php
require_once __DIR__."/../api.php";
require_once __DIR__."/../db.php";
require_once __DIR__."/../core/theme.php";
require_once __DIR__."/../core/legacy_user.php";

$response = json_NewResponse();

// MAIN (Only accept POST requests) //
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action'])) {
	$action = trim($_POST['action']);
	
	$user_id = legacy_GetUserFromCookie();
	$node = 100;//intval($CONFIG['event-active']);//isset($_POST['node']) ? intval($_POST['node']) : 0;

	if ( ($user_id > 0) && ($node > 0) ) {
		$ideas_left = 3 - theme_CountMyIdeas($node,$user_id);
		
		if ( $action == "GET" ) {
			$response['ideas'] = theme_GetMyIdeas($node,$user_id);
			$response['ideas_left'] = $ideas_left;
		}
		else if ( ($action == "ADD") && isset($_POST['idea']) ) {
			$idea = mb_trim($_POST['idea']);
	
			if ( ($idea !== "") && ($ideas_left > 0) ) {
				$idea = mb_substr($idea,0,64);			// Shorten the query and fix the response 
				$ret = theme_AddMyIdea($idea,$node,$user_id);
				
				$response['id'] = intval($ret);			// Returns the Id changed //
				$response['idea'] = $idea;
				$response['ideas_left'] = $ideas_left - (($ret>0)?1:0);
			}
			else {
				$response['id'] = 0;
				$response['ideas_left'] = $ideas_left;
			}
		}
		else if ( $action == "REMOVE" ) {
			$theme_id = intval($_POST['id']);
			if ( $theme_id > 0 ) {
				$ret = theme_RemoveMyIdea($theme_id,$user_id);
				
				$response['id'] = $ret ? $theme_id : 0;
				$response['ideas_left'] = $ideas_left + $ret;
			}
		}
	}
}

json_Emit($response);
