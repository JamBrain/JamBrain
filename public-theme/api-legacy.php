<?php
require_once __DIR__."/../api.php";
require_once __DIR__."/../db.php";
require_once __DIR__."/../core/legacy_user.php";

$response = json_NewResponse();

// MAIN (Only accept POST requests) //
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
	$action = trim($_POST['action']);

	if ( $action == "LOGOUT" ) {
		setcookie( "lusha", "", 0, "/", ".ludumdare.com" );
		$response['logout'] = 1;
	}
}

json_Emit($response);
