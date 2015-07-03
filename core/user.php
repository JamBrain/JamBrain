<?php
/**
 * User/Session
 *
 * @file
 */
 
// TODO: user_IsAdmin(), user_IsSuper()

$__session_started = false;

function user_IsSessionActive() {
	global $__session_started;
	return $__session_started;//return (session_status() == PHP_SESSION_NONE);
}
function user_StartSession() {
	global $__session_started;
	if ( !$__session_started ) {
		//session_set_cookie_params(60);
		
		session_start();	// Start Session //
		
		$__session_started = true;
	}
}
function user_EndSession() {
	global $__session_started;
	if ( $__session_started ) {
		session_unset();	// Remove Session Variables //
		session_destroy();	// Destroy the Session //

		$__session_started = false;
	}		
}


function user_GetId() {
	if ( isset($_SESSION['uid']) ) {
		return intval($_SESSION['uid']);
	}
	else {
		return 0;
	}
}

function user_SetId( $uid ) {
	$_SESSION['uid'] = $uid;
	
	// Should I return the old Id? //
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