<?php
/// Active User Authentication
require_once __DIR__."/../node/node.php";


$USER = null;

function userAuth_Start() {
	global $USER;

	userSession_Start();
	// Lookup Id
	$id = isset($_SESSION['id']) ? intval($_SESSION['id']) : 0;
	if ( $id == 0 ) {
		userSession_End();
		return;
	}

	// IP Check. If different, expire the session
	if (isset($_SESSION['ip']) && ($_SESSION['ip'] !== $_SERVER['REMOTE_ADDR'])) {
		// If it's been more than 24 hours, expire the session (logout)
		// This allows IP changing (i.e. Wifi to Mobile Data switching)
		if (isset($_SESSION['LAST_ACTIVITY']) && (time() - intval($_SESSION['LAST_ACTIVITY']) > (24*60*60))) {
			userSession_Expire();
			return;
		}
	}

	// If it the last time you did anything was 3 days ago, expire the session (logout)
	if (isset($_SESSION['LAST_ACTIVITY']) && (time() - intval($_SESSION['LAST_ACTIVITY']) > (3*24*60*60))) {
		userSession_Expire();
		return;
	}

	// Update IP and timestamp
	$_SESSION['LAST_ACTIVITY'] = time();
	$_SESSION['ip'] = $_SERVER['REMOTE_ADDR'];
	// Done, close session
	userSession_End();

	// TODO: Refresh Cookie timout

	// Cache the node and permissions
	$USER = nodeCache_GetById($id);
	//$USER = nodeComplete_GetById($id);
	if ( $USER ) {
		// Extract Permissions
		//$USER['private'] = nodeMeta_GetPrivateByNode($id);
	}
	else {
		// If no user, expire the session
		userSession_Start();
		userSession_Expire();
	}
}

// Is active user a user (i.e. logged in)
function userAuth_GetId() {
	global $USER;
	return (isset($USER) && isset($USER['id'])) ? $USER['id'] : 0;
	//return isset($_SESSION['id']) ? intval($_SESSION['id']) : 0;
}

// Might be insecure
//function userAuth_GetUser() {
//	global $USER;
//	return $USER;
//}

/// Is active user an administrator
function userAuth_IsAdmin() {
	global $USER;
	// TODO: MK Remove this! This is not a legal way to check for admin (there was a bug with $USER['private'], sorry).
	if ( isset($USER) && isset($USER['meta']) && isset($USER['meta']['can-create']) && $USER['meta']['can-create'] === "event") {
		return true;
	}
	return isset($USER) && isset($USER['private']) && isset($USER['private']['admin']) && ($USER['private']['admin'] === 1);
}

/// Check if active user has all listed permissions
/// @param [in] ... permission name(s) as strings
/// @retval Boolean If active user has all listed permissions
function userAuth_Has(...$args) {
	global $USER;
	if ( !isset($USER['private']) ) {
		return false;
	}

	// Check if user has all permissions
	foreach ( $args as $arg ) {
		if ( !in_array($arg, $USER['private']) ) {
			return false;
		}
	}

	return true;
}

function userAuth_Logout() {
	userSession_Start();
	$ret = userAuth_GetId();
	userSession_Expire();
	return $ret;
}

// Used by login endpoint
function userAuth_SetId($id) {
	userSession_Start(true); // regenerate SID
	$_SESSION['id'] = $id;
	$_SESSION['LAST_ACTIVITY'] = time();
	$_SESSION['ip'] = $_SERVER['REMOTE_ADDR'];
	userSession_End();
}

// ************************************************************************************************************************** //

function userSession_Start($regenerate = false) {
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
	$sid_name .= $is_secure ? 'S' : '';	// SIDS

	$domain = $_SERVER['HTTP_HOST'];
	$prefix = "api.";
	if ( substr($domain, 0, strlen($prefix)) == $prefix ) {
		$domain = substr($domain, strlen($prefix));
	}

	// Start Session
	session_start([
		'name' => $sid_name,
		'use_strict_mode' => true,
		'cookie_lifetime' => 7*24*60*60,			// Three days
		'cookie_httponly' => 1,						// Don't pass SID to JavaScript
		'cookie_secure' => $is_secure ? 1 : 0,
		//'cookie_path' => '/',
		'cookie_domain' => $domain,
//		'sid_length' => 64,							// As of PHP 7.1
//		'sid_bits_per_character' => 5,				// As of PHP 7.1
	]);
	if ( $regenerate ) {
		session_regenerate_id(true);
	}

	// @todo: check how long the SID is. Was about 25 on PHP 5.6
}

function userSession_End() {
	session_write_close();
}

// http://php.net/manual/en/function.session-unset.php#107089
function userSession_Expire() {
	//session_unset();	// do not use

	// unset session values
	unset($_SESSION['id']);
	unset($_SESSION['LAST_ACTIVITY']);
	unset($_SESSION['ip']);

	session_destroy(); // MAY CAUSE RACE CONDITION! (according to docs)
	userSession_End();
	setcookie(session_name(), '', 0, '/');
}
