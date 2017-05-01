<?php
const CONFIG_PATH = "../src/shrub";
const SHRUB_PATH = "../src/shrub/src";

include_once __DIR__."/".CONFIG_PATH."/config.php";
require_once __DIR__."/".SHRUB_PATH."/cron.php";
require_once __DIR__."/".SHRUB_PATH."/node/node.php";

// This is a CRON job that regularly updates magic

// Get current featured event
$root = node_GetById(1);

echo "hey ".$root['slug']."\n";
// Find a bunch of games that don't yet have cool magic

// Add them to the magic


// Find a bunch of the oldest games with cool magic
// Recalculate their scores

