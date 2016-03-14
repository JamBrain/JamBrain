<?php

$EVENT_NAME = "Ludum Dare 35";
$EVENT_MODE = 1;
$EVENT_NODE = 101;
$EVENT_DATE = new DateTime("2016-04-16T01:00:00Z");

// HACK, don't hardcode me! //
const THEME_MODE_TIMES = [
	0,
	(2*7*24*60*60) - ((24+21)*60*60),
	(1*7*24*60*60) - (18*60*60),
	(2*24*60*60),
	(60*60),
	0,
	0,
];


const THEME_VOTE_START_TIMES = [
	(5*24*60*60) - (12*60*60),
	(5*24*60*60) - (24*60*60),
	(4*24*60*60) - (12*60*60),
	(4*24*60*60) - (18*60*60),
];
const FINAL_VOTE_START_TIME =
	(2*24*60*60);

const THEME_VOTE_END_TIMES = [
	(4*24*60*60) - (24*60*60),
	(3*24*60*60) - (12*60*60),
	(3*24*60*60) - (18*60*60),
	(3*24*60*60) - (24*60*60),
];
const FINAL_VOTE_END_TIME =
	(60*60);

$THEME_VOTE_START_DATE = [];
$THEME_VOTE_START_DIFF = [];
$THEME_VOTE_END_DATE = [];
$THEME_VOTE_END_DIFF = [];

// Date Hack //
$EVENT_MODE_DATE = $EVENT_DATE->getTimestamp() - THEME_MODE_TIMES[$EVENT_MODE];
$EVENT_MODE_DIFF = $EVENT_MODE_DATE - time();

$EVENT_VOTE_ACTIVE = 3;
for( $idx = 0; $idx < count(THEME_VOTE_START_TIMES); $idx++ ) {
	$THEME_VOTE_START_DATE[$idx] = $EVENT_DATE->getTimestamp() - THEME_VOTE_START_TIMES[$idx];
	$THEME_VOTE_START_DIFF[$idx] = $THEME_VOTE_START_DATE[$idx] - time();
	$THEME_VOTE_END_DATE[$idx] = $EVENT_DATE->getTimestamp() - THEME_VOTE_END_TIMES[$idx];
	$THEME_VOTE_END_DIFF[$idx] = $THEME_VOTE_END_DATE[$idx] - time();
	
	if ( $THEME_VOTE_START_DIFF[$idx] <= 0 ) {
		$EVENT_VOTE_ACTIVE = $idx;
	}
}
$FINAL_VOTE_START_DATE = $EVENT_DATE->getTimestamp() - FINAL_VOTE_START_TIME;
$FINAL_VOTE_START_DIFF = $FINAL_VOTE_START_DATE - time();
$FINAL_VOTE_END_DATE = $EVENT_DATE->getTimestamp() - FINAL_VOTE_END_TIME;
$FINAL_VOTE_END_DIFF = $FINAL_VOTE_END_DATE - time();


function IsThemeSuggestionsOpen() {
	global $EVENT_MODE, $EVENT_MODE_DIFF;
	return ($EVENT_MODE == 1) && ($EVENT_MODE_DIFF > 0);
}
function IsThemeSlaughterOpen() {
	global $EVENT_MODE, $EVENT_MODE_DIFF;
	return ($EVENT_MODE == 2) && ($EVENT_MODE_DIFF > 0);
}
function IsThemeVotingOpen() {
	global $EVENT_MODE, $EVENT_MODE_DIFF;
	return ($EVENT_MODE == 3) && ($EVENT_MODE_DIFF > 0);
}
function IsFinalThemeVotingOpen() {
	global $EVENT_MODE, $EVENT_MODE_DIFF;
	return ($EVENT_MODE == 4) && ($EVENT_MODE_DIFF > 0);
}
