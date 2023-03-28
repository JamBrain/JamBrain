<?php

function nodeMagic_GetByNode( $nodes, $offset = null, $limit = null ) {
	$QUERY = [];
	$ARGS = [];

	dbQuery_MakeEq('node', $nodes, $QUERY, $ARGS);

	return db_QueryFetchIdKeyValue(
		"SELECT
			node, name, value
		FROM
			".SH_TABLE_PREFIX.SH_TABLE_NODE_MAGIC."
		".dbQuery_MakeQuery($QUERY)."
		".dbQuery_MakeLimit($offset, $limit, $ARGS)."
		;",
		...$ARGS
	);
}

function nodeMagic_CountByParentName( $parent, $name, $value_op = null ) {
	$QUERY = [];
	$ARGS = [];
	
	dbQuery_MakeEq('parent', $parent, $QUERY, $ARGS);
	dbQuery_MakeEq('name', $name, $QUERY, $ARGS);
	
	if ( $value_op )
		$QUERY[] = 'value'.$value_op;

	return db_QueryFetchValue(
		"SELECT
			count(id)
		FROM
			".SH_TABLE_PREFIX.SH_TABLE_NODE_MAGIC."
		".dbQuery_MakeQuery($QUERY)."
		LIMIT 1
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
			_superparent,
			author,
			".DB_FIELD_DATE('timestamp').",
			name,
			value
		FROM ".SH_TABLE_PREFIX.SH_TABLE_NODE_MAGIC." 
		WHERE 
			parent=? AND name=?
		ORDER BY timestamp ASC
		$LIMIT_QUERY;",
		$parent,
		$name
	);	
}

function nodeMagic_Add( $node, $parent, $superparent, $author, $name, $value ) {
	return db_QueryInsert(
		"INSERT IGNORE INTO ".SH_TABLE_PREFIX.SH_TABLE_NODE_MAGIC." (
			node,
			parent,
			_superparent,
			author,
			timestamp,
			name,
			value
		)
		VALUES ( 
			?,
			?,
			?,
			?,
			NOW(),
			?,
			?
		)
		ON DUPLICATE KEY UPDATE
			value=VALUES(value), 
			timestamp=VALUES(timestamp)		
		;",
		$node,
		$parent,
		$superparent,
		$author,
		$name,
		$value
	);
}

function nodeMagic_Update( $node, $name, $value ) {
	return db_QueryUpdate(
		"UPDATE ".SH_TABLE_PREFIX.SH_TABLE_NODE_MAGIC."
		SET
			value=?, 
			timestamp=NOW()
		WHERE
			node=? AND name=?
		;",
		$value,

		$node,
		$name
	);
}
