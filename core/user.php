<?php
/**
 * User/Session
 *
 * @file
 */
 
// TODO: user_IsAdmin(), user_IsSuper()

define('CMW_SESSION_NAME','SESSID');				// Name of the Session //
define('CMW_SESSION_REGENERATE',60*10);				// When to automatically Regenerate TOKEN (in seconds) //
define('CMW_SESSION_PERMISSION',60*60*1);			// How long a login is good for when doing permissive things //
define('CMW_SESSION_STAYLOGGEDIN',60*60*24*7*2);	// How long 'stay logged in' will persist your session //

define('CMW_COOKIE_PATH','/');
if (!defined('CMW_USE_HTTPS')) {
	define('CMW_USE_HTTPS',false);					// If HTTPS is available, we can require it in the cookie //
}

define('CMW_TOKEN_SIZE',64);						// How many bytes long a token is //


// Normal use, retrieve the active session and login //
function user_StartEnd( $force_regen = false, $preserve_token = false ) {
	user_Start($force_regen,$preserve_token);
	user_End();
}
// If you manually want to open and close the session and login //
function user_Start( $force_regen = false, $preserve_token = false ) {
	user_StartSession();
	user_StartLogin($force_regen,$preserve_token);
}
function user_End() {
	user_EndSession();
}

// Start and Manage the PHP Session (NOTE: USE ONLY IF YOU KNOW WHAT YOU'RE DOING) //
function user_StartSession( $require_cookie = true ) {
	if ( ($require_cookie && isset($_COOKIE['TOKEN'])) || !$require_cookie ) {
		if (session_status() !== PHP_SESSION_ACTIVE) {
			session_set_cookie_params( 0, CMW_COOKIE_PATH,NULL,CMW_USE_HTTPS, true );	// HTTPOnly //
			session_name( CMW_SESSION_NAME );
	
			session_start();											// Start Session //
			
			// If session is not HTTPonly, nuke it and start over //
			if ( !session_get_cookie_params()['httponly'] ) {
				//LogError "Session not set to HTTPonly for " . $_SERVER['REMOTE_ADDR'] . " (" . session_id() . ")";
				user_DoLogout();
				session_start();
			}
			
			// If session is new, empty it and store the creation time //
			if ( !isset($_SESSION['__created']) ) {
				session_unset();										// It should be empty, but make sure //
				$_SESSION['__created'] = time();						// Store the current time //
				$_SESSION['__creator'] = $_SERVER['REMOTE_ADDR'];		// Who created the session //
			}
		}
	}
}
// End the PHP Session (an optimization) //
function user_EndSession() {
	if (session_status() == PHP_SESSION_ACTIVE) {
		session_write_close();
	}
}

// From inside the session, verify the login detials //
function user_StartLogin( $force_regen = false, $preserve_token = false ) {
	// If the token is set, that means we are potentially logged in //
	if ( isset($_SESSION['TOKEN']) ) {
		// Confirm that the tokens match //
		if ( _user_IsLoginTokenValid() ) {
			// Confirm that we have an ID //
			if ( isset($_SESSION['ID']) ) {
				// Confirm that the ID is a number //
				if ( is_numeric($_SESSION['ID']) ) {
					// Confirm that we have a generation time //
					if ( isset($_SESSION['__generated']) ) {
						// If it's time to regenerate the token (or explicitly NOT regenerate it) //
						if ( !$preserve_token && ($force_regen || (time()-$_SESSION['__generated'] > CMW_SESSION_REGENERATE)) ) {
							_user_SetLoginToken();
						}
	
						return;	// Everything is OK!
					}
					else {
						//LogError
					}
				}
				else {
					//LogError "Login ID isn't numeric by " . $_SERVER['REMOTE_ADDR'] . " (" . session_id() . ")";
				}
			}
			else {
				//LogError "Login ID unset by " . $_SERVER['REMOTE_ADDR'] . " (" . session_id() . ")";
			}
		}
		// If not, to stop brute force attacks, clear the login parts of the session //
		else {
			//LogError "Login token mismatch for user " . (isset($_SESSION['ID'])?$_SESSION['ID']:"N/A") . " by " . $_SERVER['REMOTE_ADDR'] . " (" . session_id() . ")";
		}
	}

	// If we get here, there was a problem validating or confirming the Login //
	_user_ClearLogin();
}


// If the user has permission to do permissive actions (change password, etc) //
function user_HasPermission() {
	return (time()-$_SESSION['__lastlogin'] < CMW_SESSION_PERMISSION);
}

// To login (with id) or refresh the current login (without id), call this function //
function user_DoLogin( $id = null ) {
	session_regenerate_id(true);
	$_SESSION['__lastlogin'] = time();
	_user_SetLoginToken();
	if ( $id ) {
		$_SESSION['ID'] = $id;
	}
}
function user_DoLogout() {
	if (session_status() == PHP_SESSION_ACTIVE) {
		$sc = session_get_cookie_params();
		setcookie( 'SESSID',null, 1 /* Epoch+1 */, $sc['path'], $sc['domain'], $sc['secure'], isset($sc['httponly']) );
		setcookie( 'TOKEN',null, 1 /* Epoch+1 */, CMW_COOKIE_PATH,NULL,CMW_USE_HTTPS, true );
		unset($_COOKIE['TOKEN']);
		session_unset();							// Remove Session Variables //
		session_destroy();							// Destroy the Session //
	}
}

function _user_SetLoginToken() {
	$token = token_Get();
	setcookie( 'TOKEN',$token, NULL, CMW_COOKIE_PATH,NULL,CMW_USE_HTTPS, true );	// HTTPOnly //
	$_SESSION['__generated'] = time();
	$_SESSION['__ip'] = $_SERVER['REMOTE_ADDR'];
	$_SESSION['TOKEN'] = $token;
}
function _user_IsLoginTokenValid() {
	if ( isset($_SESSION['TOKEN']) && isset($_COOKIE['TOKEN']) ) {
		return $_SESSION['TOKEN'] === $_COOKIE['TOKEN'];
	}
	return false;
}
// Similar to logging out, but doesn't nuke the session //
function _user_ClearLogin() {
	setcookie( 'TOKEN',null, 1 /* Epoch+1 */, CMW_COOKIE_PATH,NULL,CMW_USE_HTTPS, true );
	unset($_COOKIE['TOKEN']);
	if ( isset($_SESSION) ) {
		unset($_SESSION['__lastlogin']);
		unset($_SESSION['__generated']);
		unset($_SESSION['__ip']);
	
		unset($_SESSION['TOKEN']);
		unset($_SESSION['ID']);
	}
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