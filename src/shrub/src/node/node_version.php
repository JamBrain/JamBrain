<?php

function nodeVersion_Add( $node, $author, $type, $subtype, $subsubtype, $slug, $name, $body, $tag = "" ) {
	$ret = db_QueryInsert(
		"INSERT IGNORE INTO ".SH_TABLE_PREFIX.SH_TABLE_NODE_VERSION." (
			node,
			author, 
			type, subtype, subsubtype, 
			timestamp,
			slug, name, body,
			tag
		)
		VALUES ( 
			?,
			?,
			?, ?, ?,
			NOW(),
			?, ?, ?,
			?
		)",
		$node,
		$author,
		$type, $subtype, $subsubtype,
		/**/
		$slug, $name, $body,
		$tag
	);
	
	return $ret;
}
