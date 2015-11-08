<?php
/** @file api.php
*	@brief a General Include for making APIs 
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

require_once __DIR__."/core/internal/json.php";		// JSON Output //
require_once __DIR__."/core/internal/core.php";
?>
