<?php
require_once __DIR__."/../api.php";
require_once __DIR__."/../db.php";

$response = json_NewResponse();

function theme_GetUser() {
	if (isset($_COOKIE['lusha'])) {
		$part = explode("|",$_COOKIE['lusha'],2);
		
		if (count($part) !== 2)
			return 0;
		
		$uid = intval(base48_Decode($part[0]));
		
		// Confirm UID and HASH match //
		
		return $uid;
	}
	return 0;	
}

// Query Functions - PLEASE SANITIZE BEFORE CALLING //
function theme_Submit($node, $uid, $theme) {
	return db_DoQuery(
		"INSERT INTO ".CMW_TABLE_THEME_IDEA." (
			node, author, theme, `timestamp`
		)
		VALUES ( 
			?, ?, ?, NOW()
		)",
		$node, $uid, $theme
	);
}
function theme_GetMyIdeas($node, $uid) {
	return db_DoFetch(
		"SELECT id,theme FROM ".CMW_TABLE_THEME_IDEA." 
		WHERE node=? AND author=?",
		$node, $uid
	);
}

// MAIN (Only accept POST requests) //
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
	$action = trim($_POST['action']);			// TODO: sanitize
	
//	$uid = theme_GetUser();
	$uid = isset($_POST['author']) ? intval($_POST['author']) : 0;
	
	$node = isset($_POST['node']) ? intval($_POST['node']) : 0;
	// TODO: Validate node as an active event
	
	if ( ($uid > 0) && ($node > 0) ) {
		if ( $action == "LOGIN" ) {
		}
		else if ( $action == "SUBMIT" ) {
			// Confirm valid Input //
			$theme = trim($_POST['theme']);		// TODO: sanitize
	
			if ( !empty($theme) ) {
				mail("mike@sykhronics.com","loggy2",print_r($_POST,true));
	
				db_Connect();
	
				theme_Submit($node,$uid,$theme);
			}
		}
		else if ( $action == "GET" ) {
			db_Connect();
			
			// Return my themes //
			$response['themes'] = theme_GetMyIdeas($node,$uid);
		}
	}
}

json_Emit($response);
