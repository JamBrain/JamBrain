<?php
/// Active User Authentication

//$lifetime=600;
//session_start();
//setcookie(session_name(),session_id(),time()+$lifetime);

// TODO: Store stuff in SESSION, instead of AUTH
// When it comes to node data and permissions, it's actually okay to do this *ONLY* if you do it after session_write_close.
// The point is, for security reasons, the node and permission data should not be stored in the actual session
// It can be stored in the global though (i.e. after important session data is serialized)

/// 
function user_Auth() {
//	global $RESPONSE;
//	$RESPONSE['sess'] = isset($RESPONSE['sess']) ? $RESPONSE['sess']+1 : 1;
	
	userSession_Start();
	// IP Check. If different, expire the session
	if ( !isset($_SESSION['ip']) || ($_SESSION['ip'] !== $_SERVER['REMOTE_ADDR']) ) {
		session_destroy();
	}
	userSession_End();
	// Refresh cookie lifetime

	// If session is set, lookup the node, and permissions
	if ( user_AuthUser() ) {
		// Lookup user
		//$_SESSION['node'] = 
		// Extract Permissions
		// Is Admin?
	}
}

// Is active user a user (i.e. logged in)
function user_AuthUser() {
	return isset($_SESSION['id']) ? $_SESSION['id'] : 0;
}

/// Is active user an administrator
function user_AuthIsAdmin() {	
	return isset($_SESSION['admin']) && ($_SESSION['admin'] === 1);
}

/// Check if active user has all listed permissions
/// @param [in] ... permission name(s) as strings
/// @retval Boolean If active user has all listed permissions
function user_AuthHas(...$args) {
	if ( !isset($_SESSION['permission']) ) {
		return false;
	}
	
	// Check if user has all permissions
	foreach ( $args as $arg ) {
		if ( !in_array($arg, $_SESSION['permission']) ) {
			return false;
		}
	}
	
	return true;
}


function userSession_Start() {
	$sid_name = 'SID';
	$is_secure = false;

	// http://stackoverflow.com/a/16076965/5678759
	if ( isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] == 'on' ) {
		$is_secure = true;
	}
	else if ( !empty($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] == 'https' || !empty($_SERVER['HTTP_X_FORWARDED_SSL']) && $_SERVER['HTTP_X_FORWARDED_SSL'] == 'on' ) {
	    $is_secure = true;
	}
	
	// Use a different name if we're connected securely
	$sid_name .= $is_secure ? 'S' : '';
	
	// This can be removed, once we've moved entirely to PHP 7
	session_name($sid_name);
//	session_set_cookie_params(
//		2*24*60*60,			// Two days
//		'/',
//		$_SERVER['HTTP_HOST'],
//		$is_secure,
//		true
//	);

	// Start Session	
	session_start([
		'name' => $sid_name,
		'cookie_lifetime' => 2*24*60*60,			// Two days
		'cookie_httponly' => 1,						// Don't pass SID to JavaScript
		'cookie_secure' => $is_secure ? 1 : 0,
		//'cookie_path' => '/',
		'cookie_domain' => $_SERVER['HTTP_HOST'],
		'sid_length' => 64,							// As of PHP 7.1
		'sid_bits_per_character' => 5,				// As of PHP 7.1
	]);
	
	// @todo: check how long the SID is. Was about 25 on PHP 5.6
}

function userSession_End() {
	session_write_close();
}
