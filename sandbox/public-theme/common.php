<?php

// IMPORTANT NOTE! 
//   There is a hardcoded threshold value in "/core/theme.php". Make sure
//   you set it to -100.0 (or -50.0, -25.0, or such) before opening
//   the slaughter. Eventually this value should be set automatically by
//   the "theme score" script. i.e. every 100k votes raise the threshold.
//   Threshold of 0 catches all offensive themes. Depending on scoring
//   frequency, you may want to use negative values (i.e. -25) to allow
//   all themes to temporarily dip due to aggressive flagging. But once
//   we have enough data, setting it to 0 will remove the offensive ones.
//   I'm assuming 100k is enough data, but I'll have to look at snapshots.

$EVENT_NAME = "Ludum Dare 35";
$EVENT_MODE = 5;
$EVENT_NODE = 101;
$EVENT_DATE = new DateTime("2016-04-16T01:00:00Z");

// HACK, don't hardcode me! //
const THEME_MODE_TIMES = [
	0,
	(2*7*24*60*60) + ((24+6)*60*60),	// Theme Suggestions (now ending Thursday afternoon)
	(6*24*60*60) + (6*60*60),			// Theme Slaughter (ends Saturday afternoon)
	//(7*24*60*60) + ((24+24+6)*60*60),	// TODO: Theme Slaughter (ends Wednesday afternoon)
	//(6*24*60*60) + (6*60*60),			// TODO: Theme A/B (ends Saturday afternoon)
	(2*24*60*60) + (3*60*60),			// Theme Voting (ends Wednesday night)
	(60*60),							// Final Voting (ends 1 hour before)
	0,									// Countdown (ends at start time)
	0,
];


const THEME_VOTE_START_TIMES = [
	(6*24*60*60) + (9*60*60),
	(5*24*60*60) + (9*60*60),
	(4*24*60*60) + (9*60*60),
	(3*24*60*60) + (9*60*60),
];
const FINAL_VOTE_START_TIME =
	(2*24*60*60) + (3*60*60);

const THEME_VOTE_END_TIMES = [
	(3*24*60*60) + (9*60*60),
	(3*24*60*60) + (3*60*60),
	(2*24*60*60) + (9*60*60),
	(2*24*60*60) + (3*60*60),
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
