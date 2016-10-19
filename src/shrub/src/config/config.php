<?php
require_once __DIR__."/../core/db_mysql.php";
require_once __DIR__."/../core/cache.php";

/// @addtomodule Config
/// @{

/// @cond INTERNAL
$SH_CONFIG = [];

const _SH_CONFIG_CACHE_KEY = "SH_CONFIG";
const _SH_CONFIG_CACHE_TTL = 10*60;
/// @endcond

/// @cond INTERNAL
function _config_Set($key,$value) {
	return db_Query(
		"INSERT ".SH_TABLE_PREFIX.SH_TABLE_CONFIG." (
			`key`, `value`, `timestamp`
		)
		VALUES ( 
			?, ?, NOW()
		);",
		$key,
		$value
	);
}
/// @endcond
/// Set a configuration key to a new value
function config_Set($key, $value) {
	if ( !isset($GLOBALS['SH_CONFIG'][$key]) || $GLOBALS['SH_CONFIG'][$key] !== $value ) {
		if ( !_config_Set($key,$value) )
			return false;
		$GLOBALS['SH_CONFIG'][$key] = $value;
		cache_Store(_SH_CONFIG_CACHE_KEY,$GLOBALS['SH_CONFIG'],_SH_CONFIG_CACHE_TTL);
		return true;
	}
	return false;
}

/// @cond INTERNAL
function _config_Load() {
	$ret = cache_Fetch(_SH_CONFIG_CACHE_KEY);
	
	if ( $ret === null ) {
		// Fetch the newest version of every key //
		$ret = db_QueryFetchPair(
			"SELECT `key`,`value` FROM ".SH_TABLE_PREFIX.SH_TABLE_CONFIG."
			WHERE id IN (
				SELECT MAX(id) FROM ".SH_TABLE_PREFIX.SH_TABLE_CONFIG." GROUP BY `key`
			);"
		);
		
		if ( $ret ) {
			cache_Store(_SH_CONFIG_CACHE_KEY,$ret,_SH_CONFIG_CACHE_TTL);
		}
		else {
			$ret = [];
		}
	}
	return $ret;
}
/// @endcond
/// Load the configuration ($SH_CONFIG)
function config_Load() {
	$GLOBALS['SH_CONFIG'] = _config_Load();
}

/// Purge the cached configuration
function config_Purge() {
	cache_Delete(_SH_CONFIG_CACHE_KEY);
	$GLOBALS['SH_CONFIG'] = [];
}

/// @}
