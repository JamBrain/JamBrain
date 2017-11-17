#!/usr/bin/env php
<?php
const CONFIG_PATH = "../src/shrub";
const SHRUB_PATH = "../src/shrub/src";

include_once __DIR__."/".CONFIG_PATH."/config.php";
require_once __DIR__."/".SHRUB_PATH."/cron.php";
require_once __DIR__."/".SHRUB_PATH."/node/node.php";
require_once __DIR__."/".SHRUB_PATH."/core/db_sphinx.php";


$nodes = node_GetSearchIndexes(0, 1000);

//print_r($nodes);

_searchDB_Connect();

foreach ( $nodes as &$node ) {
//	db_Echo("
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
			".searchDB_String($node['type']).",
			".searchDB_String($node['subtype']).",
			".searchDB_String($node['subsubtype']).",
			".searchDB_TimeStamp($node['published']).",
			".searchDB_TimeStamp($node['created']).",
			".searchDB_TimeStamp($node['modified']).",
			".searchDB_String($node['slug']).",
			".searchDB_String($node['name']).",
			".searchDB_String($node['body'])."
		)"
	);
}
