<?php

/// @name Internal: Error Logging
/// Used internally for logging database errors.
/// @{
function _db_Error( $msg, $public = false ) {
	$unique = uniqid();
	$error = "shrub/src/core/db_mysql.php [$unique]: ".$msg;
	
	// Log the error to system log
	error_log($error);
	
	if ( php_sapi_name() === 'cli' ) {
		// CLI, we assume is private
		echo($error."\n");
	}
	else {
		require_once __DIR__."/json.php";
		json_EmitError(500, $public ? $error : "See Log [$unique]");
	}
}
function _db_FatalError( $msg, $public = false ) {
	_db_Error($msg, $public);
	exit;
}
/// @}

