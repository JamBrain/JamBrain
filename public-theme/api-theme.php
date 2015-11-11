<?php
require_once __DIR__."/../api.php";
require_once __DIR__."/../db.php";

$response = json_NewResponse();

function GetUser() {
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

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
//	$uid = GetUser();
	$uid = isset($_POST['uid']) ? intval($_POST['uid']) : 0;
	
	if ( $uid > 0 ) {
		// Confirm valid Input //
		$theme = $_POST['theme'].trim();
		// TODO: sanitize string

		if ( !empty($theme) ) {
			mail("mike@sykhronics.com","loggy2",print_r($_POST,true));

			db_Connect();

			db_DoQuery(
				"INSERT INTO ".CMW_TABLE_THEME_IDEA." (
					uid, theme, `timestamp`
				)
				VALUES ( 
					?, ?, NOW()
				)",
				$uid, $theme
			);
		}
		
		json_Emit($response);
	}
}
else if ($_SERVER['REQUEST_METHOD'] === 'GET') {
//	$uid = GetUser();
	$uid = isset($_GET['uid']) ? intval($_GET['uid']) : 0;
	
	if ( $uid > 0 ) {
		// Return my details //
		$response['uid'] = $uid;
		
		db_Connect();
		
		// Return my themes //
		$response['themes'] = db_DoFetch(
				"SELECT id,theme FROM ".CMW_TABLE_THEME_IDEA." 
				WHERE `uid`=?",
				$uid
			);
		
		json_Emit($response);
	}
}
else {
	// bad request //
}

?>