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
/// @}

global_AddTableConstant( 
	'SH_TABLE_USER',
	'SH_TABLE_USER_ACCESS',
	'SH_TABLE_USER_STRIKE',
	'SH_TABLE_USER_MAIL'
);
