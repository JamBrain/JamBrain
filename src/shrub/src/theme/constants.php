<?php
/// @defgroup Theme
/// @brief Theme Selection Plugin for Shrub

/// @name Theme Tables *
/// @addtogroup Tables
/// @{
const SH_TABLE_THEME_IDEA =				"theme_idea";			///< Theme Suggestions
const SH_TABLE_THEME_IDEA_VOTE =		"theme_idea_vote";		///< Votes for Theme Slaughter
const SH_TABLE_THEME_IDEA_COMPARE =		"theme_idea_compare";	///< Votes for Theme Fusion
const SH_TABLE_THEME_IDEA_STAR =		"theme_idea_star";		///< Theme suggestions I like

const SH_TABLE_THEME_LIST =				"theme_list";			///< Themes
const SH_TABLE_THEME_LIST_VOTE =		"theme_list_vote";		///< Votes for Themes
const SH_TABLE_THEME_FINAL =			"theme_final";			///< Final Round Themes
const SH_TABLE_THEME_FINAL_VOTE =		"theme_final_vote";		///< Votes for Final Round Themes

const SH_TABLE_THEME_HISTORY =			"theme_history";		///< Historic Theme List
/// @}

global_AddTableConstant( 
	'SH_TABLE_THEME_IDEA',
	'SH_TABLE_THEME_IDEA_VOTE',
	'SH_TABLE_THEME_IDEA_COMPARE',	
	'SH_TABLE_THEME_IDEA_STAR',
	
	'SH_TABLE_THEME_LIST',
	'SH_TABLE_THEME_LIST_VOTE',
	'SH_TABLE_THEME_FINAL',
	'SH_TABLE_THEME_FINAL_VOTE',

	'SH_TABLE_THEME_HISTORY'
);
