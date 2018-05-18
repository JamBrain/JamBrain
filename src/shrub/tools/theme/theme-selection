#!/usr/bin/env php
<?php
const CONFIG_PATH = "../../";
const SHRUB_PATH = "../../src/";

include_once __DIR__."/".CONFIG_PATH."config.php";
require_once __DIR__."/".SHRUB_PATH."core/cli.php";	// Confirm CLI
require_once __DIR__."/".SHRUB_PATH."core/db.php";
require_once __DIR__."/".SHRUB_PATH."core/core.php";
require_once __DIR__."/".SHRUB_PATH."constants.php";		// For the SH_TABLE constants. run gen.sh if not up-to-date.
require_once __DIR__."/".SHRUB_PATH."global/global.php";
require_once __DIR__."/".SHRUB_PATH."node/node.php";

print "\nEVENT THEME MANAGEMENT\n";
print "----------------------\n\n";

if ( count($argv) < 3 ) {
	echo "Usage: ".$argv[0]." [ACTION] event-node \n";
	echo "Usage: ".$argv[0]." [ACTION] event-node [parameters]\n";
}

array_shift($argv);
$ACTION = array_shift($argv);
$EVENT_ID = intval(array_shift($argv));

$root = nodeComplete_GetById(1);
$eventsId = db_QueryFetchValue(
	"SELECT
		n.id
	FROM
		".SH_TABLE_PREFIX.SH_TABLE_NODE." AS n
	WHERE n.type = 'events'
	LIMIT 1
	;"
);

if (!$root || !$eventsId) {
	print " ** Error: Database not yet fully setup\n";
	exit(1);
}

if ($EVENT_ID > 0) {
	$event = nodeComplete_GetById($EVENT_ID, F_NODE_NO_BODY | F_NODE_META | F_NODE_PATH);

	if (!$event) {
		print " ** Error: Event with id ".$EVENT_ID." doesn't exist\n";
		exit(1);
	}

	if ($event['parents'][0] != $root['id'] || $event['parents'][1] != $eventsId) {
		print " ** Error: The node '".$event['name']."' is not a properly setup event.\n";
		exit(1);
	}
} 
else {
	$ACTION = null;
}
//print_r($event);

if ($ACTION == "has-selection") {
	$metaKey = 'theme-has-selection';
	if (sizeof($argv) == 0) {
		if (array_key_exists($metaKey, $event['meta'])) {
			print "\t* Theme selection enabled.\n";
		} else {
			print "\t* Theme selection disabled.\n";			
		}
	}
	else if ($argv[0] == 'enabled') {
		nodeMeta_Add($EVENT_ID, 0, SH_SCOPE_PUBLIC, $metaKey, 'enabled');
		print " SUCCESS! (enabled)\n";
	}
	else if ($argv[0] == 'disabled') {
		nodeMeta_Remove($EVENT_ID, 0, SH_SCOPE_PUBLIC, $metaKey, 'enabled');
		print " SUCCESS! (disabled)\n";
	} else {
		print " ** ERROR: Can only set 'enabled' or 'disabled'\n";
	}
}
else if ($ACTION == "idea-limit") {
	$metaKey = 'theme-idea-limit';
	if (sizeof($argv) == 0) {
		if (array_key_exists($metaKey, $event['meta'])) {
			print "\t* ".$event['meta'][$metaKey]." suggestions per user.\n";
		} else {
			print "\t* No suggestions from users.\n";
		}
	}
	else if (ctype_digit($argv[0])) {
		$maxIdeas = intval($argv[0]);
		nodeMeta_Add($EVENT_ID, 0, SH_SCOPE_PUBLIC, $metaKey, $maxIdeas);
		print " SUCCESS! (max=".$maxIdeas.")\n";
	}
	else if ($argv[0] == 'disabled') {
		nodeMeta_Remove($EVENT_ID, 0, SH_SCOPE_PUBLIC, $metaKey, $event['meta'][$metaKey]);
		print " SUCCESS! (disabled)\n";
	} else {
		print " ** ERROR: Can only set a number >= 0 or 'disabled'\n";
	}	
} else {
	if ($ACTION) {
		print " ** ERROR: Action '".$ACTION."' unknown.\n";
	}
	print "\nACTIONS:\n";
	print "\t* 'has-selection': If event includes theme suggestions round.\n";
	print "\t* 'idea-limit': The number of idea suggestions per user.\n";
}

print "\n";
