<?php

// Make sure SH_TABLE_PREFIX exists.
if ( !defined('SH_TABLE_PREFIX') ) {
	define('SH_TABLE_PREFIX',"sh_");	
}

// Database Tables //
const SH_TABLE_SCHEDULE_TIMESPAN =		SH_TABLE_PREFIX."schedule_timespan";
const SH_TABLE_SCHEDULE_SUBSCRIPTION =	SH_TABLE_PREFIX."schedule_subscription";
