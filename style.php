<?php
/** @file style.php 
*	@brief a General Include for generating Style sheets 
*
*	**NOTE**: Unlike api.php and web.php, files that include style.php are meant to be standalone.
**/

// Benchmarking //
$PHP_SCRIPT_TIMER = microtime(true);
function php_GetExecutionTime( $print = false ) {
	global $PHP_SCRIPT_TIMER;
	
	$timediff = microtime(true) - $PHP_SCRIPT_TIMER;
	
	if ( $timediff < 1.0 )
		$ret = number_format( $timediff * 1000.0, 2 ) . ' ms';
	else if ( $timediff === 1.0 )
		$ret = "1 second";
	else
		$ret = number_format( $timediff, 4 ) . ' seconds';

	if ( $print )
		echo $ret;
	return $ret;
}

// Emit the CSS content type //
header("Content-Type: text/css; charset: UTF-8");

// Includes //
require_once __DIR__."/core/internal/css.php";
require_once __DIR__."/core/internal/core.php";
?>
