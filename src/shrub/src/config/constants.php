<?php
/// @defgroup Config
/// @ingroup Modules

/// @cond INTERNAL
$SH_TABLE_CONSTANTS = [];
$SH_TABLE_VALUES = [];
$SH_TABLE_VALUE_KEYS = [];

/// Default configuration settings
$SH_CONFIG_DEFAULT = [
	'active' => '1',						// Is the website Active
	'alert' => "",							// Short alert message to be shown everywhere
	'web-alert' => "",						// Short alert message shown by the web site
	'api-alert' => "",						// Short alert message shown by the API
];
/// @endcond

/// @addtogroup Config
/// @{

/// Add to the table list
/// @param [in] ... Table name string(s)
function config_AddTableConstant(...$args) {
	global $SH_TABLE_CONSTANTS,$SH_TABLE_VALUES,$SH_TABLE_VALUE_KEYS;

	foreach ( $args as $arg ) {
		$SH_TABLE_CONSTANTS[] = $arg;
		$SH_TABLE_VALUES[] = constant($arg);
		$SH_TABLE_VALUE_KEYS[constant($arg)] = $arg;
	}
}

/// Get the table constant list
/// @retval Array[String]
function config_GetTableConstants() {
	global $SH_TABLE_CONSTANTS;
	return $SH_TABLE_CONSTANTS;
}

/// Get the table list
/// @retval Array[String]
function config_GetTables() {
	global $SH_TABLE_VALUES;
	return $SH_TABLE_VALUES;
}

/// Given a value, lookup the constant
/// @retval String or Null on failure
function config_GetTableConstantByValue( $val ) {
	global $SH_TABLE_VALUE_KEYS;
	return $SH_TABLE_VALUE_KEYS[$val];
}

/// @}

/// @name Config Tables
/// @addtogroup Tables
/// @{
const SH_TABLE_CONFIG =					"config";
/// @}
	
config_AddTableConstant( 
	'SH_TABLE_CONFIG'
);
