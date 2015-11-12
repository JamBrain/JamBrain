<?php
require_once __DIR__."/../api.php";
require_once __DIR__."/../db.php";
require_once __DIR__."/../core/theme.php";
require_once __DIR__."/.g./core/legacy_user.php";

$response = json_NewResponse();

// MAIN (Only accept POST requests) //
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
	$action = trim($_POST['action']);
	$node = 100;//intval($CONFIG['event-active']);//isset($_POST['node']) ? intval($_POST['node']) : 0;
	$user_id = 255;//legacy_GetUser();//isset($_POST['user']) ? intval($_POST['user']) : 0;

	if ( ($user_id > 0) && ($node > 0) ) {
		$ideas_left = 10 - theme_CountMyIdeas($node,$user_id);
		
		if ( $action == "GET" ) {
			$response['ideas'] = theme_GetMyIdeas($node,$user_id);
			$response['ideas_left'] = $ideas_left;
		}
		else if ( $action == "ADD" ) {
			if ( $ideas_left > 0 ) {
				$idea = trim(strip_tags($_POST['idea']));		// TODO: sanitize
		
				if ( !empty($idea) ) {
					$ret = theme_AddMyIdea($idea,$node,$user_id);
					
					$response['id'] = $ret;
					$response['idea'] = $idea;
					$response['ideas_left'] = $ideas_left - (($ret>0)?1:0);
				}
			}
			else {
				$response['id'] = 0;
				$response['ideas_left'] = $ideas_left;
			}
		}
		else if ( $action == "REMOVE" ) {
			$id = intval($_POST['id']);
			if ( $id > 0 ) {
				// TODO: Is id valid?
				
				theme_RemoveMyIdea($id,$user_id);
				
				$response['id'] = $id;
				$response['ideas_left'] = $ideas_left + (($id>0)?1:0);
			}
		}
//		else {
//			mail("mike@sykhronics.com","loggy2",print_r($_POST,true));
//		}
	}
}

json_Emit($response);
