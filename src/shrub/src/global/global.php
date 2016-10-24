<?php
require_once __DIR__."/../constants.php";
require_once __DIR__."/../core/db.php";
require_once __DIR__."/../core/cache.php";

/// @addtomodule Global
/// @{

/// @cond INTERNAL
$SH = [];

const _SH_GLOBAL_CACHE_KEY = "SH";
const _SH_GLOBAL_CACHE_TTL = 10*60;
/// @endcond

/// @cond INTERNAL
function _global_Set($key, $value) {
	return db_Query(
		"INSERT ".SH_TABLE_PREFIX.SH_TABLE_GLOBAL." (
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
/// Set a global key to a new value
function global_Set($key, $value) {
	if ( !isset($GLOBALS['SH'][$key]) || $GLOBALS['SH'][$key] !== $value ) {
		if ( !_global_Set($key,$value) )
			return false;
		$GLOBALS['SH'][$key] = $value;
		cache_Store(_SH_GLOBAL_CACHE_KEY,$GLOBALS['SH'],_SH_GLOBAL_CACHE_TTL);
		return true;
	}
	return false;
}

/// @cond INTERNAL
function _global_Load() {
	$ret = cache_Fetch(_SH_GLOBAL_CACHE_KEY);
	
	if ( $ret === null ) {
		// Fetch the newest version of every key //
		$ret = db_QueryFetchPair(
			"SELECT `key`,`value` FROM ".SH_TABLE_PREFIX.SH_TABLE_GLOBAL."
			WHERE id IN (
				SELECT MAX(id) FROM ".SH_TABLE_PREFIX.SH_TABLE_GLOBAL." GROUP BY `key`
			);"
		);
		
		if ( $ret ) {
			cache_Store(_SH_GLOBAL_CACHE_KEY,$ret,_SH_GLOBAL_CACHE_TTL);
		}
		else {
			$ret = [];
		}
	}
	return $ret;
}
/// @endcond
/// Load the Globals ($SH)
function global_Load() {
	$GLOBALS['SH'] = _global_Load();
}

/// Purge the cached globals
function global_Purge() {
	cache_Delete(_SH_GLOBAL_CACHE_KEY);
	$GLOBALS['SH'] = [];
}

/// @}
