<?php
/// Active User Authentication

$AUTH = [];

/// 
function user_Auth() {
	global $AUTH;
	
	user_AuthReset();

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
		if ( !in_array($arg,$AUTH['permission']) ) {
			return false;
		}
	}
	
	return true;
}
