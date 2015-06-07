<?php
require_once __DIR__ . "/../../api.php";
require_once __DIR__ . "/../../db.php";
require_once __DIR__ . "/../../core/internal/validate.php";

$response = api_newResponse();

// Retrieve Session, store UID
user_StartSession();
$response['uid'] = user_GetId();

// Retrieve Action and Arguments
$arg = api_parseActionURL();
$action = array_shift($arg);
$arg_count = count($arg);


// Confirm we have a legal number of arguments
if ( $arg_count > 1 ) {
	my_loginError();
}


// On 'login' Action, attempt to log-in given POST data.
if ( $action === 'login' ) {
	// Generic Error Function for everything (so to not offer any hints if abusing)
	function my_loginError() {
		api_emitErrorAndExit(400,"BAD LOGIN");
	}

	// Bail if not an HTTP POST
//	if ( $_SERVER['REQUEST_METHOD'] !== 'POST' ) {
//		my_loginError();
//	}
	
	// If already logged in, dispose of the active session.
	if ( $response['uid'] !== 0 ) {
		user_EndSession();		// Destroy Session
		
		user_StartSession();	// New Session!
		$response['uid'] = user_GetId();
	}
		
	// Check the APCU cache if access attempts for this IP address is > 5, deny access.
	
	// On failure, increase the access attempt (APCU). Timeout in 5 minutes. Log attempt.
	
	
	// Get login and password from $_POST //
	if ( isset($_REQUEST['l']) && isset($_REQUEST['p']) ) {
	//if ( isset($_POST['l']) && isset($_POST['p']) ) {
	//	$login = $_POST['l'];
	//	$password = $_POST['p'];
		$login = trim($_REQUEST['l']);
		$password = trim($_REQUEST['p']);
	}
	else {
		my_loginError();
	}
	
	// Sanitize the data
	$mail = sanitize_Email($login);
	if ( !$mail ) {
		$login = sanitize_Slug($login);
		if ( !$login ) {
			my_loginError();
		}
	}
	
	if ( $mail )
		$response['mail'] = $mail;
	else
		$response['login'] = $login;
	$response['pw'] = $password;
	
	if ( $mail ) {
		// Search user_table for a matching e-mail.
		
		// if none found, fail
	}
	else {
		// Search for a user-type node matching the sanitized login.
		
		// Search user_table for the matching UID
	
		// if none found, fail
	}
	
	// if found, verify password against the stored hash.
	
	//if ( user_verifyPassword($password,$hash) ) {
		// Success! //
	//	user_setId( $that_user_id );
	//}
	//else {
		// Password Failed //
	//}
	
	
	// ** Successfully Logged in ** //
	// Retrieve my info //
	
	// Retrieve my list of Favourites, and a list of most recent posts I've loved. //
}
// On 'logout' action, Destroy the Session
else if ( $action === 'logout' ) {
	user_EndSession();		// Destroy session
}
else if ( $action === 'register' ) {
	// Add a user (if legal), send a verification e-mail.
}
else if ( $action === 'verify' ) {	
	// Verify a previously added user given a verification URL.
}
else if ( $action === 'resend' ) {	
	// Resend verification e-mail.
}
else if ( $action === 'lost-password' ) {	
	// Send a password recovery e-mail.
}
else if ( $action === 'verify-user' ) {	
	// *** Admin Only *** //
	// Verify a user.
}
else if ( $action === 'delete-user' ) {	
	// *** Admin Only *** //
	// Remove a user.
}
else if ( $action === 'purge-retry-cache' ) {	
	// *** Admin Only *** //
	// Clear the Login retries cache of a specific user.
}
else {
	api_emitErrorAndExit();
}

// Done. Output the response.
api_emitJSON($response);
?>
