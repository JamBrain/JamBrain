<?php

function nodeMagic_GetByNode( $nodes, $offset = null, $limit = null ) {
	$QUERY = [];
	$ARGS = [];

	dbQuery_MakeEq('node', $nodes, $QUERY, $ARGS);

	return db_QueryFetchIdKeyValue(
		"SELECT
			node, name, score
		FROM
			".SH_TABLE_PREFIX.SH_TABLE_NODE_MAGIC." 
		".dbQuery_MakeQuery($QUERY)."
		".dbQuery_MakeLimit($offset, $limit, $ARGS)."
		;",
		...$ARGS
	);
}

function nodeMagic_GetNodeIdByParentName( $parent, $name, $limit = null ) {
	$LIMIT_QUERY = '';
	if ( $limit > 0 ) {
		$LIMIT_QUERY = 'LIMIT '.$limit;
	}
	return db_QueryFetchSingle(
		"SELECT 
			node
		FROM ".SH_TABLE_PREFIX.SH_TABLE_NODE_MAGIC." 
		WHERE 
			parent=? AND name=?
		$LIMIT_QUERY
		;",
		$parent,
		$name
	);
}

function nodeMagic_GetOldestByParentName( $parent, $name, $limit = null ) {
	$LIMIT_QUERY = '';
	if ( $limit > 0 ) {
		$LIMIT_QUERY = 'LIMIT '.$limit;
	}
	return db_QueryFetch(
		"SELECT 
			node,
			parent,
			superparent,
			author,
			score,
			".DB_FIELD_DATE('timestamp').",
			name
		FROM ".SH_TABLE_PREFIX.SH_TABLE_NODE_MAGIC." 
		WHERE 
			parent=? AND name=?
		ORDER BY timestamp ASC
		$LIMIT_QUERY;",
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
