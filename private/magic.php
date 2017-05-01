<?php
const CONFIG_PATH = "../src/shrub";
const SHRUB_PATH = "../src/shrub/src";

include_once __DIR__."/".CONFIG_PATH."/config.php";
require_once __DIR__."/".SHRUB_PATH."/cron.php";
require_once __DIR__."/".SHRUB_PATH."/node/node.php";

// This is a CRON job that regularly updates magic
const COOL_MAX_ITEMS_TO_ADD = 100;
const COOL_MAX_ITEMS_TO_CALC = 100;


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
	{
		// Get all items with cool magic
		$cool_nodes = nodeMagic_GetNodeIdByParentName($featured_id, 'cool');
		
		// Get all published item ids
		$node_ids = node_GetIdByParentTypePublished($featured_id, 'item');
		
		$diff = array_diff($node_ids, $cool_nodes);
		
		$new_nodes = array_slice($diff, 0, COOL_MAX_ITEMS_TO_ADD);
		
		foreach ( $new_nodes as $key => &$value ) {
			$node = node_GetById($value);
			if ( $node ) {
				nodeMagic_Add(
					$node['id'],
					$node['parent'],
					$node['superparent'],
					$node['author'],
					0,	// score
					'cool'
				);
			}
		}
	}
	
	
	// ** Find a bunch of the oldest games with cool magic **
	{
		$cool = nodeMagic_GetOldestByParentName($featured_id, 'cool', COOL_MAX_ITEMS_TO_CALC);
		
		print_r($cool);
		
//		nodeMagic_Add(
//					$node['id'],
//					$node['parent'],
//					$node['superparent'],
//					$node['author'],
//					0,	// score
//					'cool'
//				);
		// Calculate their scores
	}
}

