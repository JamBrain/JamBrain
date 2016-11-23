<?php
/// @defgroup Jammer
/// @brief The Jammer/Ludum Dare Plugin for Shrub

/// @cond INTERNAL
$SH_GLOBAL_DEFAULT['ludumdare-root'] = 0;
$SH_GLOBAL_DEFAULT['ludumdare-alert'] = "";		// Short alert message shown by the Ludum Dare site
$SH_GLOBAL_DEFAULT['ludumdare-event'] = 0;		// Currently Active Ludum Dare Event

$SH_GLOBAL_DEFAULT['jammer-root'] = 0;
$SH_GLOBAL_DEFAULT['jammer-alert'] = "";		// Short alert message shown by the Jammer site

$SH_GLOBAL_DEFAULT['jammer.bio-root'] = 0;
$SH_GLOBAL_DEFAULT['jammer.bio-alert'] = "";	// Short alert message shown by the jammer.bio

$SH_GLOBAL_DEFAULT['SH_NODE_ID_ITEMS'] = 0;
$SH_GLOBAL_DEFAULT['SH_NODE_ID_TAGS'] = 0;
$SH_GLOBAL_DEFAULT['SH_NODE_ID_EVENTS'] = 0;
/// @endcond

///	@addtogroup NodeTypes
/// @name Jammer Types
/// @{
// Internal Types //
const SH_NODE_TYPE_ITEMS =			'items';
const SH_NODE_TYPE_TAGS =			'tags';
const SH_NODE_TYPE_EVENTS =			'events';

const SH_NODE_TYPE_ITEM =			'item';		// Game, Tool, Demo, Craft
const SH_NODE_TYPE_TAG =			'tag';
const SH_NODE_TYPE_EVENT =			'event';
/// @}

/*
// Item Constants //
const SH_NODE_ADMIN = 3;				// Administrator Control Panel
const SH_NODE_TEAM = 4;				// Teams (uncategorized only, i.e. Admin)
const SH_NODE_GAME = 5;				// Games (proxy)
const SH_NODE_DEMO = 6;				// Demos (proxy)
const SH_NODE_CRAFT = 7;				// Crafts (proxy)
const SH_NODE_POST = 8;				// Posts (proxy)
const SH_NODE_MEDIA = 9;				// Media (proxy)

// --- //

const SH_NODE_EVENT = 16;				// Ludum Dare Events
const SH_NODE_PLATFORM = 17;			// Platforms
const SH_NODE_TAG = 18;					// Tags
const SH_NODE_TOOL = 19;				// Tools (Unity, etc)
const SH_NODE_OTHER = 20;				// Other Games and Game Jams (GGJ)
const SH_NODE_CUSTOM = 21;				// Custom User Generated Jams
const SH_NODE_HOSTED = 22;				// Extra Events we host (3rd party, or sponsored)

// --- //

const SH_NODE_EVENT_LD = 32;
const SH_NODE_EVENT_MINILD = 33;
const SH_NODE_EVENT_OCTOBER = 34;
const SH_NODE_EVENT_SCENE = 35;

const SH_NODE_OTHER_GAME = 36;			// Other Games (not from a Jam)
const SH_NODE_OTHER_DEMO = 37;			// Other Demos (from Demoscene Events we haven't added)
const SH_NODE_OTHER_CRAFT = 38;			// Other Crafts
const SH_NODE_OTHER_JAM = 39;			// Other Game Jams
const SH_NODE_OTHER_SCENE = 40;			// Other Demoscene Events

const SH_NODE_TOOL_DEV = 41;
const SH_NODE_TOOL_ART = 42;
const SH_NODE_TOOL_CONTENT = 43;
const SH_NODE_TOOL_OTHER = 44;
*/

global_AddReservedName(
	// Content Types
	'events',
	'event',
	'games',
	'game',
	'demos',
	'demo',
	'tools',
	'tool',
	'crafts',
	'craft',
	'medias',
	'media',
	'tags',
	'tag',
	'teams',
	'team',

	// Extended (may become content types, or may not)
	'platforms',
	'platform',
	'arts',
	'art',
	'photos',
	'photo',
	'comics',
	'comic',
	'videos',
	'video',
	'streams',
	'stream',
	'radios',
	'radio',
	'live',
	'broadcasts',
	'broadcast',
	'music',
	'audio',
	'sounds',
	'sound',
	'soundtracks',
	'soundtrack',
	'books',
	'book',
	'poems',
	'poem',
	'stories',
	'story',
	'novels',
	'novel',
	'comments',
	'comment',
	
	// Groups
	'help',
	'unityhelp',
	
	
	// Generally Reserved
	'jammers',
	'jammer',
	'ludumdares',
	'ludumdare',
	'ldjams',
	'ldjam',

	'jams',
	'jam',
	'compos',
	'compo',
	'hackathons',
	'hackathon',
	'gamejams',
	'gamejam',
	'scenes',
	'scene',
	'intros',
	'intro',
	'gamers',
	'gamer',
	'players',
	'player',

	'hello',
	'hey',
	'howdy',
	'love',
	'hate',
	'mom',
	'dad',

	// Tools	
	'unity',
	'unreal',
	'gamemaker',
	
	'javascript',
	'html',
	'html5',
	'css',
	'python',
	'flash',
	'web'
);
