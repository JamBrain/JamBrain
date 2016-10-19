<?php
/// @defgroup Config
/// @ingroup Modules

/// @cond INTERNAL
$SH_TABLES = [];
/// @endcond

/// Add a table to the table list
/// @param [in] ... Table name string(s)
/// @addtogroup Config
function config_AddTable(...$args) {
	global $SH_TABLES;

	foreach ( $args as $arg ) {
		$SH_TABLES[] = $arg;
	}
}

/// @name Config Tables
/// @addtogroup Tables
/// @{
const SH_TABLE_CONFIG =					"config";
/// @}
	
config_AddTable( SH_TABLE_CONFIG);
