<?php
/// @defgroup Theme
/// @brief Theme Selection Plugin for Shrub

/// @name Theme Tables *
/// @addtogroup Tables
/// @{
const SH_TABLE_THEME_IDEA =				"theme_idea";		///< Theme Suggestions
const SH_TABLE_THEME_IDEA_VOTE =		"theme_idea_vote";	///< Votes for theme suggestions
const SH_TABLE_THEME_IDEA_STAR =		"theme_idea_star";	///< Theme suggestions I like

const SH_TABLE_THEME =					"theme";			///< Themes
const SH_TABLE_THEME_VOTE =				"theme_vote";		///< Votes for themes
const SH_TABLE_THEME_FINAL =			"theme_final";		///< Final round themes
const SH_TABLE_THEME_FINAL_VOTE =		"theme_final_vote";	///< Final round theme votes
const SH_TABLE_THEME_HISTORY =			"theme_history";	///< Historic Theme List
/// @}

global_AddTableConstant( 
	'SH_TABLE_THEME_IDEA',
	'SH_TABLE_THEME_IDEA_VOTE',
	'SH_TABLE_THEME_IDEA_STAR',
	
	'SH_TABLE_THEME',
	'SH_TABLE_THEME_VOTE',
	'SH_TABLE_THEME_FINAL',
	'SH_TABLE_THEME_FINAL_VOTE',
	'SH_TABLE_THEME_HISTORY'
);
