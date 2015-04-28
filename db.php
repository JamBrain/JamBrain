<?php

include "config.php";

if ( !isset($cfg_dbo) ) {
	$msg = "No database configuration found.";
	error_log( $msg );
	echo "<strong>ERROR:</strong> " . $msg );
}

?>
