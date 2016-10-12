<?php

if ( !defined('SH_TABLE_PREFIX') ) {
	define('SH_TABLE_PREFIX',"sh_");	
}

// Database Tables //
const SH_TABLE_NODE =				SH_TABLE_PREFIX."node";
const SH_TABLE_NODE_LINK =			SH_TABLE_PREFIX."node_link";
const SH_TABLE_NODE_META =			SH_TABLE_PREFIX."node_meta";
const SH_TABLE_NODE_DIFF =			SH_TABLE_PREFIX."node_diff";
const SH_TABLE_NODE_LOVE =			SH_TABLE_PREFIX."node_love";
const SH_TABLE_NODE_STAR =			SH_TABLE_PREFIX."node_star";

// Node ID Constants (these nodes will be created by default) //
const SH_NODE_ID_ROOT = 1;			// The root of the Node tree //
const SH_NODE_ID_USER = 2;			// Users group //

// Special Node Types //
const SH_NODE_TYPE_ROOT =			'root';
const SH_NODE_TYPE_USERS =			'users';
const SH_NODE_TYPE_SYMLINK =		'symlink';

// Node Types (add your own in your constants.php) //
const SH_NODE_TYPE_USER =			'user';
const SH_NODE_TYPE_POST =			'post';
