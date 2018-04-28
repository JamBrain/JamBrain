<?php
/// Active User Authentication
require_once __DIR__."/../node/node.php";


$USER = null;

function userAuth_Start() {
	global $USER;
	
	userSession_Start();
	// IP Check. If different, expire the session
	if ( !isset($_SESSION['ip']) || ($_SESSION['ip'] !== $_SERVER['REMOTE_ADDR']) ) {
		userSession_Expire();
	}
	else {
		if (isset($_SESSION['LAST_ACTIVITY']) && (time() - $_SESSION['LAST_ACTIVITY'] > (24*60*60))) {
			userSession_Expire();
		}
		else {
			$_copy = isset($_SESSION['LAST_ACTIVITY']) ? $_SESSION['LAST_ACTIVITY'] : null;
			$_SESSION['LAST_ACTIVITY'] = time();
			userSession_End();
			$_SESSION['OLD_LAST_ACTIVITY'] = $_copy;
		}
	}
	
	// TODO: Refresh Cookie/Session timeouts

	// If session is set, lookup the node, and permissions
	if ( $id = userAuth_GetId() ) {
		// Lookup user
		$USER = nodeCache_GetById($id);
		//$USER = nodeComplete_GetById($id);
		if ( $USER ) {
			// Extract Permissions
			//$USER['private'] = nodeMeta_GetPrivateByNode($id);
		}
		else {
			userSession_Start();
			userSession_Expire();
		}
	}
}

// Is active user a user (i.e. logged in)
function userAuth_GetId() {
	return isset($_SESSION['id']) ? intval($_SESSION['id']) : 0;
}

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
//	session_name($sid_name);
//	session_set_cookie_params(
//		2*24*60*60,			// Two days
//		'/',
//		$_SERVER['HTTP_HOST'],
//		$is_secure,
//		true
//	);

	$domain = $_SERVER['HTTP_HOST'];
	$prefix = "api.";
	if ( substr($domain, 0, strlen($prefix)) == $prefix ) {
		$domain = substr($domain, strlen($prefix));
	}

	// Start Session	
	session_start([
		'name' => $sid_name,
		'cookie_lifetime' => 3*24*60*60,			// Three days
		'cookie_httponly' => 1,						// Don't pass SID to JavaScript
		'cookie_secure' => $is_secure ? 1 : 0,
		//'cookie_path' => '/',
		'cookie_domain' => $domain,
//		'sid_length' => 64,							// As of PHP 7.1
//		'sid_bits_per_character' => 5,				// As of PHP 7.1
	]);
	
	// @todo: check how long the SID is. Was about 25 on PHP 5.6
}

function userSession_End() {
	session_write_close();
}

// http://php.net/manual/en/function.session-unset.php#107089
function userSession_Expire() {
	session_unset();
	session_destroy();
	userSession_End();
	setcookie(session_name(), '', 0, '/');
//	session_regenerate_id(true);					// error: "Cannot regenerate session id - session is not active"
}
