<?php
/**
 * User Lib
 *
 * @file
 */
require_once __DIR__ . "/../config.php";
require_once __DIR__ . "/internal/cache.php";

// Global User ID
$USER_ID = 0;

// The client (browser) has a token
function user_DecodeSIDToken($token) {
	$parts = explode('|',$token);
	if ( count($parts) != 3 )
		return false;
	$ret = [];
	$ret['id'] = intval($parts[0]);			// TODO: decode
	$ret['hash'] = $parts[1];
	$ret['unique'] = $parts[2];
	return $ret;
}
function user_EncodeSIDToken($id,$hash,$unique) {
	return $id."|".$hash."|".$unique;		// TODO: encode
}

// Session ID Key
function user_EncodeSIDKey($id,$unique) {
	return "A|".$id."|".$unique;
}
function user_GenSIDKey($id) {
	// Limitation: Only 1 device can log-in per second //
	return user_EncodeSIDKey($id,time());	// TODO: encode time
}

// Do session check right now //
function _user_CheckSession() {
	global $USER_ID;
	if ( isset($_COOKIE['SID']) ) {
		$user = user_DecodeSIDToken($_COOKIE['SID']);
		$key = user_EncodeSIDKey($user['id'],$user['unique']);
		$value = cache_Fetch($key);
		if ( $value === $user['hash'] ) {
			//cache_Touch($key,60*60*24*7);	// One week //
			$USER_ID = intval($user['id']);
			
			// TODO: Regenerate hash if it's been a few hours
		}
	}
}
// Do session check right now!! //
_user_CheckSession();


function user_IsAuthenticated() {
	return $USER_ID !== 0;
}
function user_HasCookie() {
	return isset($_COOKIE['SID']);
}

//function user_IsAdmin
