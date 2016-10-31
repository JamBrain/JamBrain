<?php
/// Active User Authentication

$AUTH = [];

//$lifetime=600;
//session_start();
//setcookie(session_name(),session_id(),time()+$lifetime);

// TODO: Store stuff in SESSION, instead of AUTH
// When it comes to node data and permissions, it's actually okay to do this *ONLY* if you do it after session_write_close.
// The point is, for security reasons, the node and permission data should not be stored in the actual session
// It can be stored in the global though (i.e. after important session data is serialized)

/// 
function user_Auth() {
	global $AUTH;
	
	user_AuthReset();
	
	session_Start();
	// IP Check //
	if ( isset($_SESSION['ip']) && ($_SESSION['ip'] !== $_SERVER['REMOTE_ADDR']) ) {
		session_destroy();
	}
	session_write_close();		// Nothing to write, so close immediately to avoid hanging
	// Refresh cookie lifetime //

	
	if ( $_SESSION['user'] ) {
//		$AUTH['user'] = $AUTH['user'];
		// Lookup user
		//$_SESSION['node'] = 
		// Extract Permissions
		// Is Admin?
	}

	//$AUTH['node'] = &Blah;
	//$AUTH['admin'] = 1;
}

function user_AuthReset() {
	global $AUTH;
	
	$AUTH = [];
	$AUTH['user'] = 0;
	$AUTH['permission'] = [];
}

// Is active user a user (i.e. logged in)
function user_AuthIsUser() {
	global $AUTH;
	
	return isset($AUTH['user']) && ($AUTH['user'] !== 0);
}

/// Is active user an administrator
function user_AuthIsAdmin() {
	global $AUTH;
	
	return isset($AUTH['admin']) && ($AUTH['admin'] === 1);
}

/// Check if active user has all listed permissions
/// @param [in] ... permission name(s) as strings
/// @retval Boolean If active user has all listed permissions
function user_AuthHas(...$args) {
	global $AUTH;
	
	if ( !isset($AUTH['permission']) ) {
		return false;
	}
	
	// Check if user has all permissions
	foreach ( $args as $arg ) {
		if ( !in_array($arg, $AUTH['permission']) ) {
			return false;
		}
	}
	
	return true;
}
