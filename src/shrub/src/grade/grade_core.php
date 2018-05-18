<?php


function grade_GetByNode( $node_id ) {
	return db_QueryFetch(
		"SELECT
			name,
			value
		FROM ".SH_TABLE_PREFIX.SH_TABLE_GRADE."
		WHERE node=?
		;",
		$node_id
	);
}

function grade_GetByNodeAuthor( $node_id, $author_id ) {
	return db_QueryFetchPair(
		"SELECT
			name,
			value
		FROM ".SH_TABLE_PREFIX.SH_TABLE_GRADE."
		WHERE node=? AND author=?
		;",
		$node_id,
		$author_id
	);
}

function grade_GetByAuthorParent( $author_id, $parent_id ) {
	$query = "SELECT
			node AS id,
			name,
			value,
			timestamp
		FROM ".SH_TABLE_PREFIX.SH_TABLE_GRADE."
		WHERE author=? AND parent=?
		;";
	return db_QueryFetch($query, $author_id, $parent_id);
}

function grade_GetNodeIdByAuthorParent( $author_id, $parent_id ) {
	return db_QueryFetchSingle(
		"SELECT
			DISTINCT node
		FROM ".SH_TABLE_PREFIX.SH_TABLE_GRADE."
		WHERE author=? AND parent=?
		;",
		$author_id,
		$parent_id
	);
}


function grade_AddByNodeAuthorName( $node_id, $parent_id, $author_id, $name, $value ) {
	return db_QueryInsert(
		"INSERT IGNORE INTO ".SH_TABLE_PREFIX.SH_TABLE_GRADE." (
			node,
			parent,
			author,
			name,
			value,
			timestamp
		)
		VALUES (
			?,
			?,
			?,
			?,
			?,
			NOW()
		)
		ON DUPLICATE KEY UPDATE
			value=VALUES(value),
			timestamp=VALUES(timestamp)
		;",
		$node_id,
		$parent_id,
		$author_id,
		$name,
		$value
	);
}

function grade_RemoveByNodeAuthorName( $node_id, $author_id, $name ) {
	return db_QueryDelete(
		"DELETE FROM ".SH_TABLE_PREFIX.SH_TABLE_GRADE."
		WHERE
			node=? AND
			author=? AND
			name=?
		;",
		$node_id,
		$author_id,
		$name
	);
}


function grade_CountByNodeAuthor( $node_id, $authors ) {
	$multi = is_array($authors);
	if ( !$multi )
		$authors = [$authors];

	return db_QueryFetchValue(
		"SELECT
			count(id) AS count
		FROM ".SH_TABLE_PREFIX.SH_TABLE_GRADE."
		WHERE node=? AND author IN (".implode(',', $authors).")
		LIMIT 1;",
		$node_id
	);
}

function grade_CountByNotNodeAuthor( $node_id, $authors, $parent_id ) {
	$QUERY = ['parent=?','node!=?'];
	$ARGS = [$parent_id, $node_id];

	if ( is_array($authors) ) {
		$QUERY[] = "author IN (".implode(',', $authors).")";
	}
	else {
		$QUERY[] = 'author=?';
		$ARGS[] = $authors;
	}

	return db_QueryFetchValue(
		"SELECT
			count(id) AS count
		FROM ".SH_TABLE_PREFIX.SH_TABLE_GRADE."
		WHERE ".implode(' AND ', $QUERY)."
		LIMIT 1;",
		...$ARGS
	);
	 //node!=? AND author IN (".implode(',', $authors).")
}

function grade_CountByNodeNotAuthor( $node_id, $authors ) {
	$multi = is_array($authors);
	if ( !$multi )
		$authors = [$authors];

	return db_QueryFetchValue(
		"SELECT
			count(id) AS count
		FROM ".SH_TABLE_PREFIX.SH_TABLE_GRADE."
		WHERE node=? AND author NOT IN (".implode(',', $authors).")
		LIMIT 1;",
		$node_id
	);
}


function grade_CountByNode( $node_id, $limit = 8*250 ) {
	$multi = is_array($node_id);
	if ( !$multi )
		$node_id = [$node_id];

	return db_QueryFetchIdKeyValue(
		"SELECT
			node AS id,
			name,
			count(id) AS count
		FROM ".SH_TABLE_PREFIX.SH_TABLE_GRADE."
		WHERE node IN (".implode(',', $node_id).")
		GROUP BY node, name
		LIMIT ?
		;",
		$limit
	);
}
