<?php

function nodeLove_GetByNode( $nodes ) {
	$multi = is_array($nodes);
	if ( !$multi )
		$nodes = [$nodes];
	
	if ( is_array($nodes) ) {
		// Confirm that all Nodes are not zero
		foreach( $nodes as $node ) {
			if ( intval($node) == 0 )
				return null;
		}

		// Build IN string
		$node_string = implode(',', $nodes);

		$ret = db_QueryFetch(
			"SELECT node, COUNT(node) AS count, ".DB_FIELD_DATE('MAX(timestamp)','timestamp')."
			FROM ".SH_TABLE_PREFIX.SH_TABLE_NODE_LOVE." 
			WHERE node IN ($node_string)
			GROUP BY node".($multi?';':' LIMIT 1;')
		);
		
		if ( $multi )
			return $ret;
		else
			return $ret ? $ret[0] : null;
	}
	
	return null;
}

/// Can only add 1 love at a time
function nodeLove_AddByNode( $node, $author ) {
	if ( is_array($node) ) {
		return null;
	}
	
	if ( !$node )
		return null;

	// Anonymous Love support requires newer MYSQL 5.6.3+. Scotchbox ships with 5.5.x.		
	if ( $author ) {
		$ip = '0.0.0.0';
	}
	else {
		$ip = $_SERVER['REMOTE_ADDR'];
	}
	
	return db_QueryInsert(
		"INSERT IGNORE INTO ".SH_TABLE_PREFIX.SH_TABLE_NODE_LOVE." (
			node,
			author,
			ip,
			timestamp
		)
		VALUES ( 
			?,
			?,
			INET6_ATON(?),
			NOW()
		);",
		$node,
		$author,
		$ip
	);
}

/// Can only remove 1 love at a time
function nodeLove_RemoveByNode( $node, $author ) {
	if ( is_array($node) ) {
		return null;
	}
	
	if ( !$node )
		return null;

	// Anonymous Love support requires newer MYSQL 5.6.3+. Scotchbox ships with 5.5.x.		
	if ( $author ) {
		$ip = '0.0.0.0';
	}
	else {
		$ip = $_SERVER['REMOTE_ADDR'];
	}
	
	return db_QueryDelete(
		"DELETE FROM ".SH_TABLE_PREFIX.SH_TABLE_NODE_LOVE."
		WHERE node=? AND author=? AND ip=INET6_ATON(?);",
		$node,
		$author,
		$ip
	);
}

function nodeLove_GetByAuthor( $author ) {
	if ( is_array($author) ) {
		return null;
	}

	if ( !$author )
		return null;
		
	// TODO: Limit to 500 loves?

	return db_QueryFetchSingle(
		"SELECT node
		FROM ".SH_TABLE_PREFIX.SH_TABLE_NODE_LOVE."
		WHERE author=?;",
		$author
	);
	
	return null;
}
