<?php
/**	@file
*	@brief Internal AJAX API for managing Users (Login, Logout, Register, Delete, etc)
**/

require_once __DIR__ . "/../../api.php";
require_once __DIR__ . "/../../core/users.php";
require_once __DIR__ . "/../../core/node.php";
require_once __DIR__ . "/../../core/internal/sanitize.php";

$response = json_NewResponse();

// Retrieve Session, store User ID
user_StartEnd();
$response['id'] = user_GetID();

// Retrieve Action and Arguments
$arg = core_ParseActionURL();
$action = array_shift($arg);
$arg_count = count($arg);

// Bail if not an HTTP POST
//if ( $action !== 'verify' ) {
//	if ( $_SERVER['REQUEST_METHOD'] !== 'POST' ) {
//		json_EmitError();
//	}
//}

// Confirm we have a legal number of arguments
if ( $arg_count > 1 ) {
	json_EmitError();
}


// On 'login' Action, attempt to log-in given POST data.
/**
 * @api {POST} /a/user/login /a/user/login
 * @apiName UserLogin
 * @apiGroup User
 * @apiPermission Everyone
 * @apiVersion 0.1.0
*/
if ( $action === 'login' ) {
	// Generic Error Function for everything (so to not offer any hints if abusing)
	function my_LoginError() {
		json_EmitError(401,"Invalid Login or Password");
	}	
	
	// Get login and password from $_POST //
	if ( isset($_POST['l']) && isset($_POST['p']) ) {
		$login = trim($_POST['l']);
		$password = trim($_POST['p']);
	}
//	if ( isset($_REQUEST['l']) && isset($_REQUEST['p']) ) {
//		$login = trim($_REQUEST['l']);
//		$password = trim($_REQUEST['p']);
//	}
	else {
		json_EmitError();	// Emit a regular error, since we haven't attempted a login yet //
	}

	
	// If already logged in, dispose of the active session.
	if ( $response['id'] !== 0 ) {
		user_Start();
		user_DoLogout();	// Destroy Session
		$response['id'] = 0;
	}
		
	// Check the APCU cache if access attempts for this IP address is > 5, deny access.
	
	// On failure, increase the access attempt (APCU). Timeout in 5 minutes. Log attempt.

	
	// Sanitize the data
	$mail = sanitize_Email($login);
	if ( !$mail ) {
		$login = sanitize_Slug($login);
		if ( !$login ) {
			my_LoginError();
		}
	}
	
	$hash = null;
	
/*
	// Debug //
	if ( $mail )
		$response['mail'] = $mail;
	else
		$response['login'] = $login;
	$response['pw'] = $password;
*/
	
	// By E-mail //
	if ( $mail ) {
		// Search user_table for a matching e-mail.
		$data = user_GetIdAndHashByMail($mail);
		
		if ( $data ) {
			$response['id'] = intval($data['id']);
			$hash = $data['hash'];
		}		
		// If none found, fail //
		else {
			my_LoginError();
		}
	}
	// By Name (slug) //
	else {
		// Search for the user's node by slug //
		$response['id'] = intval(node_GetNodeIdByParentIdAndSlug(CMW_NODE_USER, $login));
		
		// If a valid ID, retrieve the hash
		if ( $response['id'] > 0 ) {
			$hash = user_GetHashById($response['id']);
		}
		// If not a valid ID, fail //
		else {
			my_LoginError();
		}
	}
	
	// If found, verify password against the stored hash.
	if ( user_VerifyPassword($password,$hash) ) {
		// Success! //
		user_StartSession(false);
		user_DoLogin( $response['id'] );
		user_EndSession();
		
		// TODO: Clear login attempt cache //
	}
	// Password Failed //
	else {
		my_LoginError();
	}
	
	// ** Successfully Logged in ** //
	// Retrieve my info //
	
	// Retrieve my list of Favourites, and a list of most recent posts I've loved. //
}
// On 'logout' action, Destroy the Session
/**
 * @api {POST} /a/user/logout /a/user/logout
 * @apiName UserLogout
 * @apiGroup User
 * @apiPermission Everyone
 * @apiVersion 0.1.0
*/
else if ( $action === 'logout' ) {
	user_Start();
	user_DoLogout();		// Destroy session
}
/**
 * @api {POST} /a/user/register /a/user/register
 * @apiName UserRegister
 * @apiGroup User
 * @apiPermission Everyone
 * @apiVersion 0.1.0
*/
else if ( $action === 'register' ) {
	// Add a user (if legal), send a verification e-mail.
}
/**
 * @api {POST} /a/user/verify /a/user/verify
 * @apiName UserVerify
 * @apiGroup User
 * @apiPermission Everyone
 * @apiVersion 0.1.0
*/
else if ( $action === 'verify' ) {	
	// Verify a previously added user given a verification URL.
}
/**
 * @api {POST} /a/user/resend /a/user/resend
 * @apiName UserResendMail
 * @apiGroup User
 * @apiPermission Everyone
 * @apiVersion 0.1.0
*/
else if ( $action === 'resend' ) {	
	// Resend verification e-mail.
}
/**
 * @api {POST} /a/user/lost-password /a/user/lost-password
 * @apiName UserLostPassword
 * @apiGroup User
 * @apiPermission Everyone
 * @apiVersion 0.1.0
*/
else if ( $action === 'lost-password' ) {	
	// Send a password recovery e-mail.
}
/**
 * @api {POST} /a/user/admin/verify-user /a/user/admin/verify-user
 * @apiName AdminVerifyUser
 * @apiGroup User
 * @apiPermission Admin
 * @apiVersion 0.1.0
*/
else if ( $action === 'verify-user' ) {	
	// *** Admin Only *** //
	// Verify a user.
}
/**
 * @api {POST} /a/user/admin/delete-user /a/user/admin/delete-user
 * @apiName AdminDeleteUser
 * @apiGroup User
 * @apiPermission Admin
 * @apiVersion 0.1.0
*/
else if ( $action === 'delete-user' ) {	
	// *** Admin Only *** //
	// Remove a user.
}
/**
 * @api {POST} /a/user/admin/purge-cache /a/user/admin/purge-cache
 * @apiName AdminPurgeCache
 * @apiGroup User
 * @apiPermission Admin
 * @apiVersion 0.1.0
*/
else if ( $action === 'purge-cache' ) {	
	// *** Admin Only *** //
	// Clear the Login retries cache of a specific user.
}
else {
	json_EmitError();
}

// Done. Output the response.
json_Emit($response);
?>
