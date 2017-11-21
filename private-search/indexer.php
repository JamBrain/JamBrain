#!/usr/bin/env php
<?php
const CONFIG_PATH = "../src/shrub";
const SHRUB_PATH = "../src/shrub/src";

include_once __DIR__."/".CONFIG_PATH."/config.php";
require_once __DIR__."/".SHRUB_PATH."/core/cli.php";	// Confirm CLI
require_once __DIR__."/".SHRUB_PATH."/cron.php";
require_once __DIR__."/".SHRUB_PATH."/node/node.php";
require_once __DIR__."/".SHRUB_PATH."/core/db_sphinx.php";

// Usage
if ( count($argv) < 2 ) {
	echo "\nUsage: ".$argv[0]." [nodes]\n";
	echo "\n";
	echo "  [nodes]         - How many nodes to index (e.g. 100)\n";
	echo "\n";
	die;
}

// Important variables
$last_modified = 0;
$count = intval($argv[1]);

// Confirm the requested number of nodes is valid
if ( $count <= 0 ) {
	echo "Invalid number of nodes\n";
	die;
}

// Figure out where we should start from (modified date as a timestamp)
$lm = searchDB_QueryFetch("
	SELECT id, modified
	FROM node_rt
	ORDER BY modified DESC
	LIMIT 1;
");
if ( count($lm) ) {
	$last_modified = intval($lm[0]['modified']);
//	var_dump($lm);
}

// Get nodes
$nodes = node_GetSearchIndexes($last_modified, $count);
$ids = array_keys($nodes);
// Add placeholders for author and tag metadata
foreach ( $nodes as &$node ) {
	$node['authors'] = [];
	$node['tags'] = [];
}

// Fetch Authors and Tags
$authors = nodeMeta_GetByKeyNode('author', $ids);
foreach ( $authors as &$author ) {
	if ( isset($nodes[$author['a']]) )
		$nodes[$author['a']]['authors'][] = $author['b'];
}
$tags = nodeMeta_GetByKeyNode('tag', $ids);
foreach ( $tags as &$tag ) {
	if ( isset($nodes[$tag['a']]) )
		$nodes[$tag['a']]['tags'][] = $author['b'];
}

//print_r($ids);
//print_r($nodes);
//print_r($tags);
//print_r($authors);

// Workaround for a bug (might not be needed anymore)
_searchDB_Connect();

// Replace the data in the search database
foreach ( $nodes as &$node ) {
//	db_Echo("
	searchDB_Query("
		REPLACE INTO node_rt (
			id,
			parent,
			superparent,
			author,

			type,
			subtype,
			subsubtype,

			published,
			created,
			modified,

			slug,
			name,
			body,
			
			authors,
			tags
		)
		VALUES (
			".$node['id'].",
			".$node['parent'].",
			".$node['superparent'].",
			".$node['author'].",
			".searchDB_String($node['type']).",
			".searchDB_String($node['subtype']).",
			".searchDB_String($node['subsubtype']).",
			".searchDB_TimeStamp($node['published']).",
			".searchDB_TimeStamp($node['created']).",
			".searchDB_TimeStamp($node['modified']).",
			".searchDB_String($node['slug']).",
			".searchDB_Field($node['name']).",
			".searchDB_Field($node['body']).",
			(".implode(',', $node['authors'])."),
			(".implode(',', $node['tags']).")
		)"
	);
}

