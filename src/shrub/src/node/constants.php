<?php
/// @defgroup Node
/// @ingroup Modules

///	@addtogroup NodeIds
/// @{
const SH_NODE_ID_ROOT = 			1;	///< Root of the node-tree
const SH_NODE_ID_USERS = 			2;	///< Special group for Users
/// @}

$SH_GLOBAL_DEFAULT['SH_NODE_ID_ROOT'] = 0;		// Set by table_create tool
$SH_GLOBAL_DEFAULT['SH_NODE_ID_USERS'] = 0;

///	@addtogroup NodeTypes
/// @name Internal Types
/// @{
const SH_NODE_TYPE_ROOT =			'root';
const SH_NODE_TYPE_USERS =			'users';
const SH_NODE_TYPE_SYMLINK =		'symlink';
/// @}

///	@addtogroup NodeTypes
/// @name Core Types
/// @{
const SH_NODE_TYPE_SITE =			'site';
const SH_NODE_TYPE_USER =			'user';
const SH_NODE_TYPE_POST =			'post';
/// @}

///	@addtogroup NodeMetaPrivacy
/// @name Privacy Types
/// @{
const SH_SCOPE_PUBLIC = 				0;			// Anyone can see
const SH_SCOPE_SHARED = 				4;			// Shared between 2 users (a and b)
const SH_SCOPE_PRIVATE = 				16;			// My eyes only
const SH_SCOPE_SERVER = 				64;			// Server only

const SH_SCOPE_PUBLIC_DELETED = 		0^-1;
const SH_SCOPE_SHARED_DELETED = 		4^-1;
const SH_SCOPE_PRIVATE_DELETED = 		16^-1;
const SH_SCOPE_SERVER_DELETED = 		64^-1;
/// @}

/// @name Node Tables
///	@addtogroup Tables
/// @{
const SH_TABLE_NODE =				"node";
const SH_TABLE_NODE_VERSION =		"node_version";
const SH_TABLE_NODE_LINK =			"node_link";
const SH_TABLE_NODE_META =			"node_meta";
const SH_TABLE_NODE_LOVE =			"node_love";
const SH_TABLE_NODE_SEARCH =		"node_search";
const SH_TABLE_NODE_MAGIC =			"node_magic";
/// @}

global_AddTableConstant( 
	'SH_TABLE_NODE',
	'SH_TABLE_NODE_VERSION',
	'SH_TABLE_NODE_LINK',
	'SH_TABLE_NODE_META',
	'SH_TABLE_NODE_LOVE',
	'SH_TABLE_NODE_SEARCH',
	'SH_TABLE_NODE_MAGIC'
);

global_AddReservedName(
	'nodes',
	'node',
	'roots',
	'root',
	'symlinks',
	'symlink',
	'groups',
	'group',

	'posts',
	'post',
	'comments',
	'comment',
	'stars',
	'star',
	'karma',
	'love',

	'likes',
	'like',
	
	'edit',
	'update',
	'add',
	'set',
	'reset',
	'create',
	'delete',
	'remove',
	'destroy',
	'push',
	'pull',
	'pop',
	'patch',
	'diff',
	'tag',
	'branch',
	'merge',
	'checkout',
	'commit',
	'get',
	'fetch',
	'log',
	'grep',
	'show',
	'hide',
	'status',
	'mv',
	'move',
	'rm',
	'clone',
	'init',
	'help',
	'publish',
	'reserve',
	'require',
	'include',
	'upload',
	'download',
	'up',
	'down',
	'left',
	'right',
	'forward',
	'back',
	'tab',
	'stop',
	'start',
	'save',
	'load',
	'block',
	'unblock',
	'submit',
	'cancel',
	'erase',
	'format',
	
	'name',
	'slug',
	'title',
	'body',
	'list',
	'dir',
	'directory',
	'file',
	'files',
	'permission',
	'permissions',
	
	'news'
);
