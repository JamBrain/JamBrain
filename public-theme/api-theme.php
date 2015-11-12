<?php
require_once __DIR__."/../api.php";
require_once __DIR__."/../db.php";
require_once __DIR__."/../core/theme.php";

$response = json_NewResponse();

function legacy_GetUser() {
	if (isset($_COOKIE['lusha'])) {
		$part = explode("|",$_COOKIE['lusha'],2);
		
		if (count($part) !== 2)
			return 0;
		
		$user_id = intval(base48_Decode($part[0]));
		
		// Confirm User Id and HASH match //
		
		return $user_id;
	}
	return 0;	
}

// MAIN (Only accept POST requests) //
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
	$action = trim($_POST['action']);
	$node = 100;//intval($CONFIG['event-active']);//isset($_POST['node']) ? intval($_POST['node']) : 0;
	$user_id = 255;//legacy_GetUser();//isset($_POST['user']) ? intval($_POST['user']) : 0;
	$max_ideas = 10;

	if ( ($user_id > 0) && ($node > 0) ) {
		if ( $action == "GET" ) {
			db_Connect();
			
			$response['ideas'] = theme_GetIdeas($node,$user_id);
			$response['ideas_left'] = $max_ideas - count($response['ideas']);
		}
		else if ( $action == "SUBMIT" ) {
			// Confirm valid Input //
			$idea = trim($_POST['idea']);		// TODO: sanitize
	
			if ( !empty($idea) ) {
				db_Connect();
	
				$id = theme_AddIdea($idea,$node,$user_id);
				
				$response['id'] = $id;
				$response['idea'] = $idea;

				// TODO: Add count ideas function
				$response['ideas_left'] = $max_ideas - count(theme_GetIdeas($node,$user_id));
			}
		}
		else if ( $action == "DELETE" ) {
			db_Connect();
			
			$id = intval($_POST['id']);
			if ( $id > 0 ) {
				theme_RemoveIdea($id);
				//theme_RemoveMyIdea($id,$user_id);

				$response['id'] = $id;

				// TODO: Add count ideas function
				$response['ideas_left'] = $max_ideas - count(theme_GetIdeas($node,$user_id));
			}
		}
//		else {
//			mail("mike@sykhronics.com","loggy2",print_r($_POST,true));
//		}
	}
}

json_Emit($response);
