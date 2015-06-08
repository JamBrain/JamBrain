<?php
/* core/util.php - Utilities Library. */

require_once __DIR__ . "/../config.php";	// Configuration and Settings //

// Bump this whenever you want to force a refresh. //
const INTERNAL_VERSION = '0.1.1';

// Helper Functions used to create Paths and URLs. //
function STATIC_URL() {
	echo CMW_STATIC_URL;
}

function VERSION_QUERY( $my_version = null ) {
	if ( is_string($my_version) )
		echo "?v=",$my_version,"-",INTERNAL_VERSION;
	else
		echo "?v=",INTERNAL_VERSION;
}	

?>
