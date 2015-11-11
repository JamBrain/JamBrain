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
function theme_Submit($uid, $theme) {
	return db_DoQuery(
		"INSERT INTO ".CMW_TABLE_THEME_IDEA." (
			uid, theme, `timestamp`
		)
		VALUES ( 
			?, ?, NOW()
		)",
		$uid, $theme
	);
}
function theme_GetMyIdeas($uid) {
	return db_DoFetch(
		"SELECT id,theme FROM ".CMW_TABLE_THEME_IDEA." 
		WHERE `uid`=?",
		$uid
	);
}

// MAIN (Only accept POST requests) //
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
	$action = trim($_POST['action']);			// TODO: sanitize
	
//	$uid = theme_GetUser();
	$uid = isset($_POST['uid']) ? intval($_POST['uid']) : 0;
	
	if ( $uid > 0 ) {
		if ( $action == "LOGIN" ) {
		}
		else if ( $action == "SUBMIT" ) {
			// Confirm valid Input //
			$theme = trim($_POST['theme']);		// TODO: sanitize
	
			if ( !empty($theme) ) {
				mail("mike@sykhronics.com","loggy2",print_r($_POST,true));
	
				db_Connect();
	
				theme_Submit($uid,$theme);
			}
		}
		else if ( $action == "GET" ) {
			db_Connect();
			
			// Return my themes //
			$response['themes'] = theme_GetMyIdeas($uid);
		}
	}
}

json_Emit($response);
