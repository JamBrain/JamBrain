<?php

include "config.php";

if ( !isset($cfg_db) ) {
	$msg = "No database configuration found.";
	error_log( $msg );
	echo "<strong>ERROR:</strong> " . $msg;
}

?>
