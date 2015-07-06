<?php
/**
 * List of Database Tables
 *
 * @file
*/

include_once __DIR__ . "/../config.php";

// Make sure CMW_TABLE_PREFIX exists.
if ( !defined('CMW_TABLE_PREFIX') ) {
	define('CMW_TABLE_PREFIX',"cmw_");	
}

// Tables //
define('CMW_TABLE_NODE',CMW_TABLE_PREFIX."node");
define('CMW_TABLE_NODE_LINK',CMW_TABLE_PREFIX."node_link");
define('CMW_TABLE_NODE_DIFF',CMW_TABLE_PREFIX."node_diff");
define('CMW_TABLE_NODE_LOVE',CMW_TABLE_PREFIX."node_love");
define('CMW_TABLE_NODE_STAR',CMW_TABLE_PREFIX."node_star");

define('CMW_TABLE_USER',CMW_TABLE_PREFIX."user");

define('CMW_TABLE_COMMENT',CMW_TABLE_PREFIX."comment");
define('CMW_TABLE_COMMENT_LOVE',CMW_TABLE_PREFIX."comment_love");

// Node Constants //
const CMW_NODE_ROOT = 1;				// The root of our Node tree
const CMW_NODE_USER = 2;				// Users
const CMW_NODE_ADMIN = 3;				// Administrator Control Panel
const CMW_NODE_TEAM = 4;				// Teams (uncategorized only, i.e. Admin)
const CMW_NODE_GAME = 5;				// Games (uncategorized only)
const CMW_NODE_POST = 6;				// Posts (uncategorized only)
const CMW_NODE_MEDIA = 7;				// Media (uncategorized only)
// --- //
const CMW_NODE_EVENT = 16;				// Ludum Dare Main Events
const CMW_NODE_EXTRA = 17;				// Ludum Dare Extra Events (MiniLD, October Challenge)
const CMW_NODE_OTHER = 18;				// Other Games and Game Jams (GGJ)
const CMW_NODE_TOOL = 19;				// Tools (Unity, etc)
const CMW_NODE_CUSTOM = 20;				// Custom User Generated Jams
const CMW_NODE_HOSTED = 21;				// Events we host (3rd party, or sponsored)

?>
