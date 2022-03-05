<?php
require_once __DIR__."/../constants.php";
require_once __DIR__."/../core/db.php";
require_once __DIR__."/../core/cache.php";

/// @addtomodule Global
/// @{

/// @cond INTERNAL
// MK: This file is the home of $SH. Try to avoid using $SH directly.
$SH = [];

const _SH_GLOBAL_CACHE_KEY = "SH";
const _SH_GLOBAL_CACHE_TTL = 10*60; // Every 10 minutes.
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
$value) {
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
	// Fetch the newest version of every key //
	$ret = db_QueryFetchPair(
/// @cond INTERNAL
function _global_Load() {
	// Fetch the newest version of every key //
	$ret = db_QueryFetchPair(
		"SELECT `key`,`value` FROM ".SH_TABLE_PREFIX.SH_TABLE_GLOBAL."
		WHERE id IN (
			SELECT MAX(id) FROM ".SH_TABLE_PREFIX.SH_TABLE_GLOBAL." GROUP BY `key`
		);"
	);

	if ( !is_array($ret) )
		return [];

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

	return $ret;
}
/// @endcond
/// Load the Globals ($SH)
function global_Load() {
	global $SH;
	
	$SH = cache_Fetch(_SH_GLOBAL_CACHE_KEY);

	if ( $SH === null ) {
		$SH = _global_Load();
		cache_Store(_SH_GLOBAL_CACHE_KEY,$SH,_SH_GLOBAL_CACHE_TTL);
	}
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

function global_Get($key) {
	global $SH;

	return isset($SH[$key]) ? $SH[$key] : null;
}
function global_GetInt($key) {
	global $SH;

	return isset($SH[$key]) ? intval($SH[$key]) : 0;
}

function global_Exists($key) {
	global $SH;

	return isset($SH[$key]);
}

function global_Count() {
	global $SH;

	return count($SH);
}

/// @}
