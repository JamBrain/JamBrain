<?php
/**
 * Config Library
 *
 * The Configuration Library is a smart key-value store that keeps a record of all changes.
 *
 * @file
 */
require_once __DIR__."/../db.php";
require_once __DIR__."/internal/cache.php";

// Default Configuration //
const DEFAULT_CONFIG = [
	'active' => '1',

	// Database Table Versions //
	CMW_TABLE_CONFIG => '0',				// Configuration Table (i.e. this)

//	CMW_TABLE_NODE => '0',
//	CMW_TABLE_NODE_META => '0',
//	CMW_TABLE_NODE_DIFF => '0',
//	CMW_TABLE_NODE_LOVE => '0',				// Likes
//	CMW_TABLE_NODE_STAR => '0',				// Bookmark
	                               
	CMW_TABLE_USER => '0',
	CMW_TABLE_USER_ACCESS => '0',			// User Account Access Log
	CMW_TABLE_USER_STRIKE => '0',			// User Strikes
	                               
//	CMW_TABLE_COMMENT => '0',
//	CMW_TABLE_COMMENT_LOVE => '0',			// Likes
	
	CMW_TABLE_SCHEDULE_TIMESPAN => '0',
	CMW_TABLE_SCHEDULE_SUBSCRIPTION => '0',
	
	CMW_TABLE_THEME_IDEA => '0',			// Suggestions
	CMW_TABLE_THEME_IDEA_VOTE => '0',		// Slaughter (Raw Votes)
	CMW_TABLE_THEME_IDEA_STAR => '0',		// Bookmarks
	CMW_TABLE_THEME => '0',					// Themes
	CMW_TABLE_THEME_VOTE => '0',			// Theme Votes
	CMW_TABLE_THEME_FINAL => '0',			// Final Themes
	CMW_TABLE_THEME_FINAL_VOTE => '0',		// Final Theme Votes
//	CMW_TABLE_THEME_NOTES => '0',			// Theme Notes (extra details, such as themes that previously won)
	
	CMW_TABLE_LEGACY_USER => '0',			// Placeholder Legacy User List
	
	'event-active' => '0',					// Currently Active Event
	
	'alert' => "",							// Alert message across all sites
//	'main-alert' => "",						// Alert message for main site
	'theme-alert' => "",					// Alert message for the theme micro-site
//	'api-alert' => "",						// Alert message for API site
	'jammer.bio-alert' => "",				// Alert message for the jammer.bio
//	'jammer.tv-alert' => "",				// Alert message for the jammer.tv
];

const _CONFIG_CACHE_KEY = "CMW_CORE_CONFIG";
const _CONFIG_CACHE_TTL = 10*60;

function _config_Set($key,$value) {
	return db_Query(
		"INSERT ".CMW_TABLE_CONFIG." (
			`key`, `value`, `timestamp`
		)
		VALUES ( 
			?, ?, NOW()
		);",
		$key,
		$value
	);
}
function config_Set($key,$value) {
	if ( !isset($GLOBALS['CONFIG'][$key]) || $GLOBALS['CONFIG'][$key] !== $value ) {
		if ( !_config_Set($key,$value) )
			return false;
		$GLOBALS['CONFIG'][$key] = $value;
		cache_Store(_CONFIG_CACHE_KEY,$GLOBALS['CONFIG'],_CONFIG_CACHE_TTL);
		return true;
	}
	return false;
}

function _config_Load() {
	$ret = cache_Fetch(_CONFIG_CACHE_KEY);
	
	if ( $ret === null ) {
		$ret = db_QueryFetchPair(
			"SELECT `key`,`value` FROM ".CMW_TABLE_CONFIG."
			WHERE id IN (
				SELECT MAX(id) FROM ".CMW_TABLE_CONFIG." GROUP BY `key`
			);"
		);
		
		cache_Store(_CONFIG_CACHE_KEY,$ret,_CONFIG_CACHE_TTL);
	}
	return $ret;
}
function config_Load() {
	$GLOBALS['CONFIG'] = _config_Load();
}
