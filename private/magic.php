<?php
const CONFIG_PATH = "../src/shrub";
const SHRUB_PATH = "../src/shrub/src";

include_once __DIR__."/".CONFIG_PATH."/config.php";
require_once __DIR__."/".SHRUB_PATH."/cron.php";
require_once __DIR__."/".SHRUB_PATH."/node/node.php";

// This is a CRON job that regularly updates magic

// Get the root node
$root = nodeComplete_GetById(1);

// Get current featured event
$featured_id = null;
if ( isset($root['meta']['featured']) )
	$featured_id = $root['meta']['featured']|0;

// As long as an event is featured, do coolness calculation
if ( $featured_id ) {
	$featured = nodeComplete_GetById($featured_id);
	
	// TODO: freak out if featured_id's don't match?
	
	// ** Find a bunch of games that don't yet have cool magic **
	// Get all items with cool magic
	$cool_nodes = nodeMagic_GetNodeIdByParentName($featured_id, 'cool');
	
	// Get all published item ids
	$node_ids = node_GetIdByParentTypePublished($featured_id, 'item');
	
	// Add them to the magic
	print_r($cool_nodes);
	print_r($node_ids);
	
	
	// Find a bunch of the oldest games with cool magic
	// Recalculate their scores

}

