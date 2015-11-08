<?php
require_once __DIR__ . "/../api.php";

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
	$uid = GetUser();
	
	if ( $uid > 0 ) {
		// Confirm valid Input //
		$theme = $_POST['theme'];
		// TODO: sanitize string
	}
}
else if ($_SERVER['REQUEST_METHOD'] === 'GET') {
	$uid = GetUser();
	
	if ( $uid > 0 ) {
		// Return my details //
		
		// Return my themes //
	}
}
else {
	// bad request //
}

?>