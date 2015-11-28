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
	
	$max_themes = 3;

	if ( ($user_id > 0) && ($node > 0) ) {
		if ( $action == "GET" ) {
			$response['ideas'] = theme_GetMyIdeas($node,$user_id);
			$response['count'] = count($response['ideas']);
		}
		else if ( ($action == "ADD") && isset($_POST['idea']) ) {
			$idea = mb_trim($_POST['idea']);
	
			if ( $idea !== "" ) {
				$idea = mb_substr($idea,0,64);	// Shorten the query and fix the response 

				$response = theme_AddMyIdeaWithLimit($idea,$node,$user_id,$max_themes);
				if ( $response['id'] !== 0 ) {
					$response['idea'] = $idea;
				}
			}
			else {
				$response['id'] = 0;
			}
		}
		else if ( $action == "REMOVE" ) {
			$theme_id = intval($_POST['id']);
			if ( $theme_id > 0 ) {
				$ret = theme_RemoveMyIdea($theme_id,$user_id);
				if ( $ret ) {
					$response['id'] = $theme_id;
				}
				
				$response['count'] = theme_CountMyIdeas($node,$user_id);
			}
			else {
				$response['id'] = 0;
			}
		}
	}
}
else if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['action'])) {
	$node = 100;//intval($CONFIG['event-active']);//isset($_POST['node']) ? intval($_POST['node']) : 0;

	switch (trim($_GET['action'])) {
	case "RANDOM":
		$response = theme_GetRandom($node);
		break;
	};
}

json_Emit($response);
