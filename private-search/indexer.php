#!/usr/bin/env php
<?php
const CONFIG_PATH = "../src/shrub";
const SHRUB_PATH = "../src/shrub/src";

include_once __DIR__."/".CONFIG_PATH."/config.php";
require_once __DIR__."/".SHRUB_PATH."/cron.php";
require_once __DIR__."/".SHRUB_PATH."/node/node.php";
require_once __DIR__."/".SHRUB_PATH."/core/db_sphinx.php";


$nodes = node_GetSearchIndexes(0, 3);

print_r($nodes);

//	return db_QueryFetch(

_searchDB_Connect();

foreach ( $nodes as &$node ) {
	searchDB_Query("
			INSERT INTO node_rt (
				id,
				parent,
				superparent,
				type,
				subtype,
				subsubtype,
				published,
				created,
				modified,
				slug,
				name,
				body
			)
			VALUES ( 
				".$node['id'].", 
				".$node['parent'].", 
				".$node['superparent'].",
				'".mysqli_real_escape_string($SearchDB, $node['type'])."',
				'".mysqli_real_escape_string($SearchDB, $node['subtype'])."',
				'".mysqli_real_escape_string($SearchDB, $node['subsubtype'])."',
				".$node['published'].",
				".$node['created'].",
				".$node['modified'].",
				'".mysqli_real_escape_string($SearchDB, $node['slug'])."',
				'".mysqli_real_escape_string($SearchDB, $node['name'])."',
				'".mysqli_real_escape_string($SearchDB, $node['body'])."'
			)
		"
	);
//	searchDB_Query("
//			INSERT INTO node_rt VALUES ( 
//				?, ?, ?, 
//				?, ?, ?,
//				?, ?, ?,
//				?, ?, ?
//			);
//		",
//		$node['id'],
//		$node['parent'],
//		$node['superparent'],
//		$node['type'],
//		$node['subtype'],
//		$node['subsubtype'],
//		$node['published'],
//		$node['created'],
//		$node['modified'],
//		$node['slug'],
//		$node['name'],
//		$node['body']
//	);
}