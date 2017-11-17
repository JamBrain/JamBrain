#!/usr/bin/env php
<?php
const CONFIG_PATH = "../src/shrub";
const SHRUB_PATH = "../src/shrub/src";

include_once __DIR__."/".CONFIG_PATH."/config.php";
require_once __DIR__."/".SHRUB_PATH."/cron.php";
require_once __DIR__."/".SHRUB_PATH."/node/node.php";
require_once __DIR__."/".SHRUB_PATH."/core/db_sphinx.php";


$last_modified = 0;
$count = 1000;

$nodes = node_GetSearchIndexes($last_modified, $count);
$ids = array_keys($nodes);
foreach ( $nodes as &$node ) {
	$node['authors'] = [];
	$node['tags'] = [];
}

$tags = nodeMeta_GetByKeyNode('tag', $ids);
$authors = nodeMeta_GetByKeyNode('author', $ids);

foreach ( $authors as &$author ) {
	if ( isset($nodes[$author['a']]) )
		$nodes[$author['a']]['authors'][] = $author['b'];
}
foreach ( $tags as &$tag ) {
	if ( isset($nodes[$tag['a']]) )
		$nodes[$tag['a']]['tags'][] = $author['b'];
}

//print_r($ids);
//print_r($nodes);
//print_r($tags);
//print_r($authors);

_searchDB_Connect();

foreach ( $nodes as &$node ) {
//	db_Echo("
	searchDB_Query("
		INSERT INTO node_rt (
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
			".searchDB_String($node['name']).",
			".searchDB_String($node['body']).",
			(".implode(',', $node['authors'])."),
			(".implode(',', $node['tags']).")
		)"
	);
}
