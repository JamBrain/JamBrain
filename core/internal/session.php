<?php

$__session_started = false;

function session_IsActive() {
	global $__session_started;
	return $__session_started;//return (session_status() == PHP_SESSION_NONE);
}

function session_Start() {
	global $__session_started;
	if ( !$__session_started ) {
		//session_set_cookie_params(60);
		
		session_start();	// Start Session //
		
		$__session_started = true;
	}
}

function session_End() {
	global $__session_started;
	if ( $__session_started ) {
		session_unset();	// Remove Session Variables //
		session_destroy();	// Destroy the Session //

		$__session_started = false;
	}		
}

?>