<?php


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


function grade_AddByNodeAuthorName( $node_id, $author_id, $name, $value ) {
	return db_QueryInsert(
		"INSERT IGNORE INTO ".SH_TABLE_PREFIX.SH_TABLE_GRADE." (
			node,
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
			NOW()
		)
		ON DUPLICATE KEY UPDATE
			value=VALUES(value), 
			timestamp=VALUES(timestamp)
		;",
		$node_id,
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

function grade_CountByNotNodeAuthor( $node_id, $authors ) {
	$multi = is_array($authors);
	if ( !$multi )
		$authors = [$authors];
	
	return db_QueryFetchValue(
		"SELECT
			count(id) AS count
		FROM ".SH_TABLE_PREFIX.SH_TABLE_GRADE." 
		WHERE node!=? AND author IN (".implode(',', $authors).")
		LIMIT 1;",
		$node_id
	);
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
