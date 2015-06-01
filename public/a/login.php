<?php
require_once __DIR__ . "/../../lib.php";
require_once __DIR__ . "/../../db.php";
require_once __DIR__ . "/../../lib/validate.php";

$response = api_newResponse();

// Retrieve Session, store UID
user_start();
$response['uid'] = user_getId();

// If already logged in, dispose of the session.
if ( $response['uid'] !== 0 ) {
	session_unset();	// Remove Session Variables //
	session_destroy();	// Destroy the Session //
	$response['uid'] = 0;
}

// Check the APCU cache if access attempts for this IP address is > 5, deny access.

// On failure, increase the access attempt (APCU). Timeout in 5 minutes. Log attempt.


// Get login and password from $_POST //
//$login = $_POST['l'];
//$password = $_POST['p'];
$login = trim($_REQUEST['l']);
$password = trim($_REQUEST['p']);

// Sanitize the data
$mail = sanitize_email($login);
if ( !$mail ) {
	$login = sanitize_slug($login);
	if ( !$login ) {
		api_emitErrorAndExit(400,"BAD LOGIN");
	}
}

$response['mail'] = $mail;
$response['login'] = $login;
$response['pw'] = $password;


// Search user_table for a matching e-mail //

// if none found, fail

// if found, verify password against the stored hash.

//if ( user_verifyPassword($password,$hash) ) {
	// Password Success //
//	user_setId( $that_user_id );
//}
//else {
	// Password Failed //
//}


// ** Successfully Logged in ** //
// Retrieve my info //

// Retrieve my list of Favourites, and a list of most recent posts I've loved. //

api_emitJSON($response);
?>
