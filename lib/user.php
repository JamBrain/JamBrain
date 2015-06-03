<?php

// TODO: user_isAdmin(), user_isSuper()

$__user_session_started = null;

function user_isActive() {
	global $__user_session_started;
	return $__user_session_started;//return (session_status() == PHP_SESSION_NONE);
}

function user_start() {
	global $__user_session_started;
	if ( !isset($__user_session_started) ) {
		//session_set_cookie_params(60);
		
		session_start();	// Start Session //
		
		$__user_session_started = true;
	}
}

function user_end() {
	global $__user_session_started;
	if ( !isset($__user_session_started) ) {
		session_unset();	// Remove Session Variables //
		session_destroy();	// Destroy the Session //

		$__user_session_started = true;
	}		
}

function user_getId() {
	if ( isset($_SESSION['uid']) ) {
		return intval($_SESSION['uid']);
	}
	else {
		return 0;
	}
}

function user_setId( $uid ) {
	$_SESSION['uid'] = $uid;
	
	// Should I return the old Id? //
}


// Reference: http://blog.nic0.me/post/63180966453/php-5-5-0s-password-hash-api-a-deeper-look

function user_hashPassword($password) {
	return password_hash($password, PASSWORD_DEFAULT); //, ['cost'=>10] );
}

function user_verifyPassword($password,$hash) {
	return password_verify($password,$hash);
}

function user_doesPasswordNeedRehash($hash) {
	return password_needs_rehash($hash, PASSWORD_DEFAULT); //, ['cost'=>10] );
}

?>