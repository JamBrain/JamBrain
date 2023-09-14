<?php
/// @defgroup Global
/// @ingroup Modules

/// @cond INTERNAL
$SH_TABLE_CONSTANTS = [];
$SH_TABLE_VALUES = [];
$SH_TABLE_VALUE_KEYS = [];

/// Default global metadata
$SH_GLOBAL_DEFAULT = [
	'active' => 1,							// Is the website Active
	'alert' => "",							// Short alert message to be shown everywhere
	'web-alert' => "",						// Short alert message shown by the web site
	'api-alert' => "",						// Short alert message shown by the API
];

$SH_NAME_RESERVED = [];
/// @endcond

/// @addtogroup Global
/// @{

/// Add to the table list
/// @param [in] ... Table name string(s)
function global_AddTableConstant(...$args) {
	global $SH_TABLE_CONSTANTS,$SH_TABLE_VALUES,$SH_TABLE_VALUE_KEYS;

	foreach ( $args as $arg ) {
		$SH_TABLE_CONSTANTS[] = $arg;
		$SH_TABLE_VALUES[] = constant($arg);
		$SH_TABLE_VALUE_KEYS[constant($arg)] = $arg;
	}
}

/// Get the table constant list
/// @retval Array[String]
function global_GetTableConstants() {
	global $SH_TABLE_CONSTANTS;
	return $SH_TABLE_CONSTANTS;
}

/// Get the table list
/// @retval Array[String]
function global_GetTables() {
	global $SH_TABLE_VALUES;
	return $SH_TABLE_VALUES;
}

/// Given a value, lookup the constant
/// @retval String or Null on failure
function global_GetTableConstantByValue( $val ) {
	global $SH_TABLE_VALUE_KEYS;
	return $SH_TABLE_VALUE_KEYS[$val];
}

/// @}

function global_AddReservedName(...$args) {
	global $SH_NAME_RESERVED;

	foreach ( $args as $arg ) {
		$SH_NAME_RESERVED[] = $arg;
	}
}


/// @name Global Meta Tables
/// @addtogroup Tables
/// @{
const SH_TABLE_GLOBAL =					"global";
/// @}
	
global_AddTableConstant( 
	'SH_TABLE_GLOBAL'
);
