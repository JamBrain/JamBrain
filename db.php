<?php

include "config.php";

if ( !isset($cfg_dbo) ) {
	error_log( "No database configuration found." );
	echo "<strong>ERROR:</strong> " . "No database configuration found." );
}

?>
