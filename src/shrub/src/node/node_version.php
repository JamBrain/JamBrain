<?php

function nodeVersion_Add( $node, $author, $type, $subtype, $subsubtype, $slug, $name, $body, $detail = "" ) {
	$ret = db_QueryInsert(
		"INSERT IGNORE INTO ".SH_TABLE_PREFIX.SH_TABLE_NODE_VERSION." (
			node,
			author, 
			type, subtype, subsubtype, 
			timestamp,
			slug, name, body,
			detail
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
		$detail
	);
	
	return $ret;
}
