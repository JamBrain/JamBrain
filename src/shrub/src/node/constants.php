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
const SH_NODE_META_PUBLIC = 				0;
const SH_NODE_META_PROTECTED = 				32;
const SH_NODE_META_PRIVATE = 				64;

const SH_NODE_META_PUBLIC_DELETED = 		0^-1;
const SH_NODE_META_PROTECTED_DELETED = 		32^-1;
const SH_NODE_META_PRIVATE_DELETED = 		64^-1;
/// @}

/// @name Node Tables
///	@addtogroup Tables
/// @{
const SH_TABLE_NODE =				"node";
const SH_TABLE_NODE_VERSION =		"node_version";
const SH_TABLE_NODE_LINK =			"node_link";
const SH_TABLE_NODE_META =			"node_meta";
const SH_TABLE_NODE_LOVE =			"node_love";
//const SH_TABLE_NODE_STAR =			"node_star";
const SH_TABLE_NODE_SEARCH =		"node_search";
/// @}

global_AddTableConstant( 
	'SH_TABLE_NODE',
	'SH_TABLE_NODE_VERSION',
	'SH_TABLE_NODE_LINK',
	'SH_TABLE_NODE_META',
	'SH_TABLE_NODE_LOVE',
//	'SH_TABLE_NODE_STAR',
	'SH_TABLE_NODE_SEARCH'
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
	'permissions'
);
