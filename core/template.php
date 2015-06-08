<?php

$cmw_theme = "default";

function template_Include( $file, $include_once ) {
	// Make certain global variables implicitly available to the template.
	//global $db;
	
	// Include the template file.
	if ( $include_once ) {
		include_once $file;
	}
	else {
		include $file;
	}
}

function template_Load( $name, $include_once ) {
	return template_Include( __DIR__."/..".CMW_STATIC_DIR.CMW_THEME_BASE."/".$name, $include_once );
}

function template_SetTheme( $theme = null ) {
	global $cmw_theme;
	if ( is_null($theme) ) {
		$cmw_theme = "default";
	}
	$cmw_theme = $theme;
}

function template_GetTheme( $theme = null ) {
	global $cmw_theme;
	if ( is_null($theme) ) {
		if ( !is_null($cmw_theme) ) {
			return $cmw_theme;
		}
		return "default";
	}
	return $theme;
}

function template_Get( $file, $theme = null, $include_once = false ) {
	template_Load( template_GetTheme($theme).$file, $include_once );
}

function template_GetHeader( $theme = null, $include_once = true ) {
	template_Load( template_GetTheme($theme)."/header.php", $include_once );
}

function template_GetFooter( $theme = null, $include_once = true ) {
	template_Load( template_GetTheme($theme)."/footer.php", $include_once );	
}

?>
