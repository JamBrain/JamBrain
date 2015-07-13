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

// Database Tables //
define('CMW_TABLE_NODE',CMW_TABLE_PREFIX."node");
define('CMW_TABLE_NODE_META',CMW_TABLE_PREFIX."node_meta");
define('CMW_TABLE_NODE_DIFF',CMW_TABLE_PREFIX."node_diff");
define('CMW_TABLE_NODE_LOVE',CMW_TABLE_PREFIX."node_love");
define('CMW_TABLE_NODE_STAR',CMW_TABLE_PREFIX."node_star");

define('CMW_TABLE_USER',CMW_TABLE_PREFIX."user");

define('CMW_TABLE_COMMENT',CMW_TABLE_PREFIX."comment");
define('CMW_TABLE_COMMENT_LOVE',CMW_TABLE_PREFIX."comment_love");

// Field constants for Schema //
const CMW_FIELD_TYPE_IGNORE = 0;		// Field will be unset (NOTE: Prefer a custom query) //
const CMW_FIELD_TYPE_STRING = 1;
const CMW_FIELD_TYPE_INT = 2;
const CMW_FIELD_TYPE_FLOAT = 3;
const CMW_FIELD_TYPE_DATETIME = 4;

// Node Constants //
const CMW_NODE_ROOT = 1;				// The root of our Node tree
const CMW_NODE_USER = 2;				// Users
const CMW_NODE_ADMIN = 3;				// Administrator Control Panel
//const CMW_NODE_TEAM = 4;				// Teams (uncategorized only, i.e. Admin)
//const CMW_NODE_GAME = 5;				// Games (proxy)
//const CMW_NODE_DEMO = 6;				// Demos (proxy)
//const CMW_NODE_CRAFT = 7;				// Crafts (proxy)
//const CMW_NODE_POST = 8;				// Posts (proxy)
//const CMW_NODE_MEDIA = 9;				// Media (proxy)

// --- //

const CMW_NODE_EVENT = 16;				// Ludum Dare Events
const CMW_NODE_PLATFORM = 17;			// Platforms
const CMW_NODE_TAG = 18;				// Tags
const CMW_NODE_TOOL = 19;				// Tools (Unity, etc)
const CMW_NODE_OTHER = 20;				// Other Games and Game Jams (GGJ)
const CMW_NODE_CUSTOM = 21;				// Custom User Generated Jams
const CMW_NODE_HOSTED = 22;				// Extra Events we host (3rd party, or sponsored)

// --- //

const CMW_NODE_EVENT_LD = 32;
const CMW_NODE_EVENT_MINILD = 33;
const CMW_NODE_EVENT_OCTOBER = 34;
const CMW_NODE_EVENT_SCENE = 35;

const CMW_NODE_OTHER_GAME = 36;			// Other Games (not from a Jam)
const CMW_NODE_OTHER_DEMO = 37;			// Other Demos (from Demoscene Events we haven't added)
const CMW_NODE_OTHER_CRAFT = 38;		// Other Crafts
const CMW_NODE_OTHER_JAM = 39;			// Other Game Jams
const CMW_NODE_OTHER_SCENE = 40;		// Other Demoscene Events

const CMW_NODE_TOOL_DEV = 41;
const CMW_NODE_TOOL_ART = 42;
const CMW_NODE_TOOL_CONTENT = 43;
const CMW_NODE_TOOL_OTHER = 44;
?>
