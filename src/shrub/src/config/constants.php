<?php
/// @defgroup Config
/// @ingroup Modules

/// @cond INTERNAL
$SH_TABLE_CONSTANTS = [];
/// @endcond

/// Add to the table list
/// @param [in] ... Table name string(s)
/// @addtogroup Config
function config_AddTableConstant(...$args) {
	global $SH_TABLE_CONSTANTS;

	foreach ( $args as $arg ) {
		$SH_TABLE_CONSTANTS[] = $arg;
	}
}

/// Get the table constant list
/// @retval Array[String]
function & config_GetTableConstants() {
	global $SH_TABLE_CONSTANTS;
	return $SH_TABLE_CONSTANTS;
}

/// Get (generate) the table list
/// @retval Array[String]
function config_GetTables() {
	global $SH_TABLE_CONSTANTS;
	$SH_TABLES = [];
	foreach ( $SH_TABLE_CONSTANTS as $TABLE ) {
		$SH_TABLES[] = constant($TABLE);
	}
	return $SH_TABLES;
}

/// Get the value of a constant (or just use PHP's constant function)
/// @retval Any
function config_GetConstantValue( $const ) {
	return constant($const);
}

/// @name Config Tables
/// @addtogroup Tables
/// @{
const SH_TABLE_CONFIG =					"config";
/// @}
	
config_AddTableConstant( 
	'SH_TABLE_CONFIG'
);
