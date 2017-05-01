<?php

// TODO: add limit support
function nodeMagic_GetNodeIdByParentName( $parent, $name ) {
	return db_QueryFetchSingle(
		"SELECT 
			node
		FROM ".SH_TABLE_PREFIX.SH_TABLE_NODE_MAGIC." 
		WHERE 
			parent=? AND name=?
		;",
		$parent,
		$name
	);
}

function nodeMagic_Add( $node, $parent, $superparent, $author, $score, $name ) {
	return db_QueryInsert(
		"INSERT IGNORE INTO ".SH_TABLE_PREFIX.SH_TABLE_NODE_MAGIC." (
			node,
			parent,
			superparent,
			author,
			score,
			timestamp,
			name
		)
		VALUES ( 
			?,
			?,
			?,
			?,
			?,
			NOW(),
			?
		)
		ON DUPLICATE KEY UPDATE
			score=VALUES(score), 
			timestamp=VALUES(timestamp)		
		;",
		$node,
		$parent,
		$superparent,
		$author,
		$score,
		$name
	);
}

function nodeMagic_Update( $node, $name, $score ) {
	return db_QueryUpdate(
		"UPDATE ".SH_TABLE_PREFIX.SH_TABLE_NODE_MAGIC."
		SET
			score=?, 
			timestamp=NOW()
		WHERE
			node=? AND name=?
		;",
		$score,
		$node,
		$name
	);
}
