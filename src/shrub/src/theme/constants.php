<?php

// Make sure SH_TABLE_PREFIX exists.
if ( !defined('SH_TABLE_PREFIX') ) {
	define('SH_TABLE_PREFIX',"sh_");	
}

// Database Tables //
const SH_TABLE_THEME_IDEA =				SH_TABLE_PREFIX."theme_idea";
const SH_TABLE_THEME_IDEA_VOTE =		SH_TABLE_PREFIX."theme_idea_vote";
const SH_TABLE_THEME_IDEA_STAR =		SH_TABLE_PREFIX."theme_idea_star";

const SH_TABLE_THEME =					SH_TABLE_PREFIX."theme";
const SH_TABLE_THEME_VOTE =				SH_TABLE_PREFIX."theme_vote";
const SH_TABLE_THEME_FINAL =			SH_TABLE_PREFIX."theme_final";
const SH_TABLE_THEME_FINAL_VOTE =		SH_TABLE_PREFIX."theme_final_vote";
const SH_TABLE_THEME_HISTORY =			SH_TABLE_PREFIX."theme_history";
