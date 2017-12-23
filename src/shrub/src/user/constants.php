<?php
/// @defgroup User
/// @ingroup Modules

/// @name User Tables
/// @addtogroup Tables
/// @{
const SH_TABLE_USER =					"user";
const SH_TABLE_USER_ACCESS =			"user_access";
const SH_TABLE_USER_STRIKE =			"user_strike";
const SH_TABLE_USER_MAIL =				"user_mail";
const SH_TABLE_USER_RESERVED =			"user_reserved";
/// @}

global_AddTableConstant( 
	'SH_TABLE_USER',
	'SH_TABLE_USER_ACCESS',
	'SH_TABLE_USER_STRIKE',
	'SH_TABLE_USER_MAIL',
	'SH_TABLE_USER_RESERVED'
);

global_AddReservedName(
	'users',
	'user',
	'administrators',
	'administrator',
	'admins',
	'admin',
	'moderators',
	'moderator',
	'mods',
	'mod',
	'anonymous',
	'anon'
);

//ALTER TABLE `sh_user` ADD `user_group` SMALLINT UNSIGNED NOT NULL DEFAULT '0' AFTER `last_auth`;

const USER_GROUP_FLAG_PARTICIPANT = 0;
const USER_GROUP_FLAG_VETERAN = 1;
const USER_GROUP_FLAG_MODERATOR = 2;
const USER_GROUP_FLAG_CONTRIBUTOR = 3;
const USER_GROUP_FLAG_MEDIA = 4;
const USER_GROUP_FLAG_ADMIN = 5;
const USER_GROUP_FLAG_CAN_NEWS = 6;
const USER_GROUP_FLAG_ACTIVE_EVENT_HOST = 7;
//SMALLINT allows adding up to 18 non-exclusive categories