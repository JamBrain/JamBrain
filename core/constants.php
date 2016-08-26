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
const CMW_TABLE_CONFIG =				CMW_TABLE_PREFIX."config";

const CMW_TABLE_ITEM =					CMW_TABLE_PREFIX."item";
const CMW_TABLE_ITEM_LINK =				CMW_TABLE_PREFIX."item_link";
const CMW_TABLE_ITEM_META =				CMW_TABLE_PREFIX."item_meta";
const CMW_TABLE_ITEM_DIFF =				CMW_TABLE_PREFIX."item_diff";
const CMW_TABLE_ITEM_LOVE =				CMW_TABLE_PREFIX."item_love";
const CMW_TABLE_ITEM_STAR =				CMW_TABLE_PREFIX."item_star";

const CMW_TABLE_USER =					CMW_TABLE_PREFIX."user";
const CMW_TABLE_USER_ACCESS =			CMW_TABLE_PREFIX."user_access";
const CMW_TABLE_USER_STRIKE =			CMW_TABLE_PREFIX."user_strike";

const CMW_TABLE_COMMENT =				CMW_TABLE_PREFIX."comment";
const CMW_TABLE_COMMENT_LOVE =			CMW_TABLE_PREFIX."comment_love";

const CMW_TABLE_SCHEDULE_TIMESPAN =		CMW_TABLE_PREFIX."schedule_timespan";
const CMW_TABLE_SCHEDULE_SUBSCRIPTION =	CMW_TABLE_PREFIX."schedule_subscription";

const CMW_TABLE_THEME_IDEA =			CMW_TABLE_PREFIX."theme_idea";
const CMW_TABLE_THEME_IDEA_VOTE =		CMW_TABLE_PREFIX."theme_idea_vote";
const CMW_TABLE_THEME_IDEA_STAR =		CMW_TABLE_PREFIX."theme_idea_star";
const CMW_TABLE_THEME =					CMW_TABLE_PREFIX."theme";
const CMW_TABLE_THEME_VOTE =			CMW_TABLE_PREFIX."theme_vote";
const CMW_TABLE_THEME_FINAL =			CMW_TABLE_PREFIX."theme_final";
const CMW_TABLE_THEME_FINAL_VOTE =		CMW_TABLE_PREFIX."theme_final_vote";
const CMW_TABLE_THEME_HISTORY =			CMW_TABLE_PREFIX."theme_history";

const CMW_TABLE_LEGACY_USER =			CMW_TABLE_PREFIX."legacy_user";

// Field constants for Schema //
const CMW_FIELD_TYPE_IGNORE = 0;		// Field will be unset (NOTE: Prefer a custom query) //
const CMW_FIELD_TYPE_STRING = 1;
const CMW_FIELD_TYPE_INT = 2;
const CMW_FIELD_TYPE_FLOAT = 3;
const CMW_FIELD_TYPE_DATETIME = 4;
const CMW_FIELD_TYPE_JSON = 5;

// Item Constants //
const CMW_ITEM_ROOT = 1;				// The root of our Node tree
const CMW_ITEM_USER = 2;				// Users
//const CMW_ITEM_ADMIN = 3;				// Administrator Control Panel
//const CMW_ITEM_TEAM = 4;				// Teams (uncategorized only, i.e. Admin)
//const CMW_ITEM_GAME = 5;				// Games (proxy)
//const CMW_ITEM_DEMO = 6;				// Demos (proxy)
//const CMW_ITEM_CRAFT = 7;				// Crafts (proxy)
//const CMW_ITEM_POST = 8;				// Posts (proxy)
//const CMW_ITEM_MEDIA = 9;				// Media (proxy)

// --- //

const CMW_ITEM_EVENT = 16;				// Ludum Dare Events
const CMW_ITEM_PLATFORM = 17;			// Platforms
const CMW_ITEM_TAG = 18;				// Tags
const CMW_ITEM_TOOL = 19;				// Tools (Unity, etc)
const CMW_ITEM_OTHER = 20;				// Other Games and Game Jams (GGJ)
const CMW_ITEM_CUSTOM = 21;				// Custom User Generated Jams
const CMW_ITEM_HOSTED = 22;				// Extra Events we host (3rd party, or sponsored)

// --- //

const CMW_ITEM_EVENT_LD = 32;
const CMW_ITEM_EVENT_MINILD = 33;
const CMW_ITEM_EVENT_OCTOBER = 34;
const CMW_ITEM_EVENT_SCENE = 35;

const CMW_ITEM_OTHER_GAME = 36;			// Other Games (not from a Jam)
const CMW_ITEM_OTHER_DEMO = 37;			// Other Demos (from Demoscene Events we haven't added)
const CMW_ITEM_OTHER_CRAFT = 38;		// Other Crafts
const CMW_ITEM_OTHER_JAM = 39;			// Other Game Jams
const CMW_ITEM_OTHER_SCENE = 40;		// Other Demoscene Events

const CMW_ITEM_TOOL_DEV = 41;
const CMW_ITEM_TOOL_ART = 42;
const CMW_ITEM_TOOL_CONTENT = 43;
const CMW_ITEM_TOOL_OTHER = 44;
?>
