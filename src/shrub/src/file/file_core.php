<?php

/*
function file_GetById( $ids ) {
	$multi = is_array($ids);
	if ( !$multi )
		$ids = [$ids];

    // ...
}
*/

function file_GetByNode( $node, ...$ops) {
	$where = [];
	$vars = [];

	$where[] = "node=?";
	$vars[] = $node;

	array_merge($where, $ops);

    return db_QueryFetch(
        "SELECT id, author, node, tag, name, size, ".DB_FIELD_DATE("timestamp").", status
        FROM ".SH_TABLE_PREFIX.SH_TABLE_FILE."
        WHERE ".join(' AND ', $where).";",
		...$vars
    );
}

/*
function file_GetIdsByNode( $node ) {
}
*/


function file_Add( $author, $node, $tag, $name, $size, $status, $token = "" ) {
	return db_QueryInsert(
		"INSERT IGNORE INTO ".SH_TABLE_PREFIX.SH_TABLE_FILE." (
			author,
			node,
			tag,
			name,
			size,
			timestamp,
			status,
			token
		)
		VALUES (
			?,
			?,
			?,
			?,
			?,
			NOW(),
			?,
			?
		);",
		$author,
		$node,
		$tag,
        $name,
		$size,
		$status,
		$token
	);
}


function file_SetStatusById( $id, $status, $token = "", $only_if_token = null, $only_if_author = null) {
	$set = [];
	$vars = [];
	$where = [];

	$set[] = "`status`=?";
	$vars[] = $status;
	$set[] = "token=?";
	$vars[] = $token;

	$where[] = "`id`=?";
	$vars[] = $id;

	if ( $only_if_token ) {
		$where[] = "token=?";
		$vars[] = $only_if_token;
	}

	if ( $only_if_author ) {
		$where[] = "author=?";
		$vars[] = $only_if_author;
	}

	return db_QueryUpdate(
		"UPDATE ".SH_TABLE_PREFIX.SH_TABLE_FILE."
		SET".join(', ', $set)."
		\nWHERE ".join(' AND ', $where).";",
		...$vars
	);
}
