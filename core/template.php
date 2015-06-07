<?php

function template_Include( $template_file, $require_once = true ) {
	// Make certain global variables implicitly available to the template.
	//global $db;
	
	// Include (Require) the template file.
	if ( $require_once )
		require_once $template_file;
	else
		require $template_file;
}

function template_Load( $template_names, $require_once = true ) {
	foreach ( (array)$template_names as $name ) {
		if ( file_exists(TEMPLATEPATH.'/'.$name) ) {
			return template_Include( TEMPLATEPATH.'/'.$name, $require_once );
		}
	}
	return "";
}

?>
