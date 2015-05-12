<?php

$_user_session_started = null;

function user_isActive() {
	global $_user_session_started;
	return $_user_session_started;//return (session_status() == PHP_SESSION_NONE);
}

function user_start() {
	global $_user_session_started;
	if ( !isset($_user_session_started) ) {
		//session_set_cookie_params(60);
		session_start();
		
		$_user_session_started = true;
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

?>