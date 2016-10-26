<?php
require_once __DIR__."/../constants.php";
require_once __DIR__."/../core/db.php";
require_once __DIR__."/../core/cache.php";

/// @addtomodule Global
/// @{

/// @cond INTERNAL
$SH = [];

const _SH_GLOBAL_CACHE_KEY = "SH";
const _SH_GLOBAL_CACHE_TTL = 3*60; // Every 3 minutes.
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
	global $SH;
	
	if ( !isset($SH[$key]) || $SH[$key] !== $value ) {
		if ( !_global_Set($key,$value) )
			return false;
		$SH[$key] = $value;
		cache_Store(_SH_GLOBAL_CACHE_KEY,$SH,_SH_GLOBAL_CACHE_TTL);
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
		
		// Convert types of the values of certain keys found in globals //
		foreach ( $ret as $key => &$value ) {
			if ( strcmp($key, "active") === 0 ) {
				$value = intval($value);
				continue;
			}
			else if ( strpos($key, "-active") !== false ) {
				$value = intval($value);
				continue;
			}
			else if ( strpos($key, "SH_TABLE_") === 0 ) {
				$value = intval($value);
				continue;
			}
		}
		
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
	global $SH;
	
	$SH = _global_Load();
}

/// Purge the cached globals
function global_Purge() {
	global $SH;
	
	cache_Delete(_SH_GLOBAL_CACHE_KEY);
	$SH = [];
}

function global_IsActive() {
	global $SH;
	
	return isset($SH['active']) && $SH['active'];
}

//function global_Has(...$args) {
//	global $SH;
//	foreach ( $args as $arg ) {
//		if ( !isset($SH[$arg]) || (!$SH[$arg]) ) {
//			return false;
//		}
//	}
//	return true;
//}

/// @}
