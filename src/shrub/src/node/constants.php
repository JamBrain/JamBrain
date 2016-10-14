<?php
///	@addtogroup NodeIds
/// @{
const SH_NODE_ID_ROOT = 			1;	///< Root of the node-tree
const SH_NODE_ID_USER = 			2;	///< Special group for Users
/// @}

///	@addtogroup NodeTypes
/// @name Internal Types
/// @{
// Internal Types //
const SH_NODE_TYPE_ROOT =			'root';
const SH_NODE_TYPE_USERS =			'users';
const SH_NODE_TYPE_SYMLINK =		'symlink';
/// @}

///	@addtogroup NodeTypes
/// @name Core Types
/// @{
// Core Types //
const SH_NODE_TYPE_USER =			'user';
const SH_NODE_TYPE_POST =			'post';
/// @}

/// @name Node Tables
///	@addtogroup Tables
/// @{
const SH_TABLE_NODE =				"node";
const SH_TABLE_NODE_LINK =			"node_link";
const SH_TABLE_NODE_META =			"node_meta";
const SH_TABLE_NODE_DIFF =			"node_diff";
const SH_TABLE_NODE_LOVE =			"node_love";
const SH_TABLE_NODE_STAR =			"node_star";
/// @}