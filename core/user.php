<?php
/**
 * User/Session
 *
 * @file
 */
 
// TODO: user_IsAdmin(), user_IsSuper()

define('CMW_SESSION_NAME','SESSID');				// Name of the Session //
define('CMW_SESSION_REGENERATE',60*15);				// When to automatically Regenerate session (in seconds) //
define('CMW_SESSION_STAYLOGGEDIN',60*60*24*7*2);	// How long 'stay logged in' will persist your session //

define('CMW_COOKIE_PATH','/');
if (!defined('CMW_USE_HTTPS')) {
	define('CMW_USE_HTTPS',false);					// If HTTPS is available, we can require it in the cookie //
}

define('CMW_TOKEN_SIZE',64);						// How many bytes long a token is //


// Normal use, retrieve the active session and login //
function user_StartEnd( $force_regen = false, $preserve_id = false ) {
	user_Start($force_regen,$preserve_id);
	user_End();
}
// If you manually want to open and close the session and login //
function user_Start( $force_regen = false, $preserve_id = false ) {
	$session_regenerated_id = user_StartSession($force_regen,$preserve_id);
	user_StartLogin($session_regenerated_id);
}
function user_End() {
//	user_EndLogin();
	user_EndSession();
}

// NOT RECOMMENDED!
// If you only want to start and end the session, disregarding login //
function user_StartEndSession( $force_regen = false, $preserve_id = false ) {
	user_StartSession($force_regen,$preserve_id);
	user_EndSession();
}
// Start and Manage the PHP Session //
// Returns true if the ID was regenerated //
function user_StartSession( $force_regen = false, $preserve_id = false ) {
	if (session_status() !== PHP_SESSION_ACTIVE) {
		session_set_cookie_params( 0, CMW_COOKIE_PATH,NULL,CMW_USE_HTTPS, true );	// HTTPOnly //
		session_name( CMW_SESSION_NAME );

		session_start();							// Start Session //
		
		// If session is not HTTPonly, nuke it and start over //
		if ( !session_get_cookie_params()['httponly'] ) {
			// TODO: Log this to error report //
			//$_SESSION['ERROR'] = "Session not set to HTTPonly for " . $_SERVER['REMOTE_ADDR'] . " (" . session_id() . ")";
			session_unset();
			session_destroy();
			session_start();
		}
		
		// If session previously existed //
		if ( isset($_SESSION['__created']) ) {
			// As long as we don't require that the ID be preserved, regenerate it if forced or when time expires //
			if ( !$preserve_id && ($force_regen || (time()-$_SESSION['__created'] > CMW_SESSION_REGENERATE)) ) {
				session_regenerate_id(true); 		// Regenerate and delete old session file //
				$_SESSION['__created'] = time();	// Store the current time //

				// ID was regenerated //
				return true;
			}
		}
		// If session is new //
		else {
			session_unset();						// It should be empty, but remove all variables anyway //
			$_SESSION['__created'] = time();		// Store the current time //
		}
	}

	// ID was not regenerated //
	return false;
}
// End the PHP Session (an optimization) //
function user_EndSession() {
	if (session_status() == PHP_SESSION_ACTIVE) {
		session_write_close();
	}
}

// From inside the session, verify the login detials //
function user_StartLogin( $force_regen = false ) {
	// If the token is set, that means we are potentially logged in //
	if ( isset($_SESSION['TOKEN']) ) {
		// Confirm that the tokens match //
		if ( user_IsLoginTokenValid() ) {
			// Confirm that we have an ID //
			if ( isset($_SESSION['ID']) ) {
				// Confirm that the ID is a number //
				if ( is_numeric($_SESSION['ID']) ) {
					// If we were asked to regenerate the token, do that now //
					if ( $force_regen ) {
						user_SetLoginToken();
					}

					return;	// Everything is OK!
				}
				else {
					// TODO: Log this to error report //
					//$_SESSION['ERROR'] = "Login ID isn't numeric by " . $_SERVER['REMOTE_ADDR'] . " (" . session_id() . ")";
				}
			}
			else {
				// TODO: Log this to error report //
				//$_SESSION['ERROR'] = "Login ID unset by " . $_SERVER['REMOTE_ADDR'] . " (" . session_id() . ")";
			}
		}
		// If not, to stop brute force attacks, clear the login parts of the session //
		else {
			// TODO: Log this to error report //
			//$_SESSION['ERROR'] = "Login token mismatch for user " . (isset($_SESSION['ID'])?$_SESSION['ID']:"N/A") . " by " . $_SERVER['REMOTE_ADDR'] . " (" . session_id() . ")";
		}
	}

	// If we get here, there was a problem validating or confirming the Login //
	user_ClearLogin();
}
//function user_EndLogin() {
//	// Not much to do here //
//}


//function user_IsActive() {
//	return session_status() == PHP_SESSION_ACTIVE;
//}
function user_Logout() {
	if (session_status() == PHP_SESSION_ACTIVE) {
		unset($_COOKIE['TOKEN']);
		setcookie( 'TOKEN',null, 1 /* Epoch+1 */, CMW_COOKIE_PATH );
		session_unset();							// Remove Session Variables //
		session_destroy();							// Destroy the Session //
	}
}

function user_SetLoginToken() {
	$token = token_Get();
	setcookie( 'TOKEN',$token, NULL, CMW_COOKIE_PATH,NULL,CMW_USE_HTTPS, true );	// HTTPOnly //
	$_SESSION['TOKEN'] = $token;
}
function user_IsLoginTokenValid() {
	if ( isset($_SESSION['TOKEN']) && isset($_COOKIE['TOKEN']) ) {
		return $_SESSION['TOKEN'] === $_COOKIE['TOKEN'];
	}
	return false;
}
function user_ClearLogin() {
	unset($_COOKIE['TOKEN']);
	setcookie( 'TOKEN',null, 1 /* Epoch+1 */, CMW_COOKIE_PATH );
	unset($_SESSION['TOKEN']);
	unset($_SESSION['ID']);
}


function token_Get() {
	return bin2hex(openssl_random_pseudo_bytes(CMW_TOKEN_SIZE >> 1));
}



function user_GetID() {
	if ( isset($_SESSION['ID']) ) {
		return $_SESSION['ID'];
	}
	return 0;
}
function user_SetID( $id ) {
	$old_id = user_GetID();
	$_SESSION['ID'] = $id;

	return $old_id;
}


// Reference: http://blog.nic0.me/post/63180966453/php-5-5-0s-password-hash-api-a-deeper-look

function user_HashPassword($password) {
	return password_hash($password, PASSWORD_DEFAULT); //, ['cost'=>10] );
}

function user_VerifyPassword($password,$hash) {
	return password_verify($password,$hash);
}

function user_DoesPasswordNeedRehash($hash) {
	return password_needs_rehash($hash, PASSWORD_DEFAULT); //, ['cost'=>10] );
}

?>