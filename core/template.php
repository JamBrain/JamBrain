<?php

/**
 * **INTERNAL**: Name of the current theme.
*/
$_cmw_theme = "default";

/**
 * **INTERNAL**: Includes template files (.php) and sets up the environment.
 *
 * @param {string} - Fully qualified path to a file.
 * @param {bool} - Should we use include_once? (default: false)
*/
function _template_Include( $path_to_file, $include_once = false ) {
	// Make certain global variables implicitly available to the template.
	//global $db;
	
	// Include the template file.
	if ( $include_once ) {
		include_once $path_to_file;
	}
	else {
		include $path_to_file;
	}
}

/**
 * Instance a template.
 *
 * @param {string} - File to load.
 * @param {string} - Theme to use (default: "default")
 * @param {bool} - Should we use include_once? (default: false)
*/
function template_Get( $file, $theme = null, $include_once = false ) {
	_template_Include( __DIR__."/..".CMW_STATIC_DIR.CMW_THEME_BASE."/".template_GetTheme($theme).$file, $include_once );
}


function template_SetTheme( $theme = null ) {
	global $_cmw_theme;
	if ( is_null($theme) ) {
		$_cmw_theme = "default";
	}
	$_cmw_theme = $theme;
}

function template_GetTheme( $theme = null ) {
	global $_cmw_theme;
	if ( is_null($theme) ) {
		if ( !is_null($_cmw_theme) ) {
			return $_cmw_theme;
		}
		return "default";
	}
	return $theme;
}


function template_GetHeader( $theme = null, $include_once = true ) {
	template_Get( "/header.php", $theme, $include_once );
}

function template_GetFooter( $theme = null, $include_once = true ) {
	template_Get( "/footer.php", $theme, $include_once );	
}

?>
