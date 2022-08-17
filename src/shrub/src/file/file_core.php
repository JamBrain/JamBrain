<?php

/*
function file_GetById( $ids ) {
	$multi = is_array($ids);
	if ( !$multi )
		$ids = [$ids];

    // ...
}
*/

function file_GetByNode( $node, $op = "" ) {
    return db_QueryFetch(
        "SELECT id, author, node, tag, name, size, ".DB_FIELD_DATE("timestamp").", status
        FROM ".SH_TABLE_PREFIX.SH_TABLE_FILE."
        WHERE node=".$node." ".$op.";"
    );
}

/*
function file_GetIdsByNode( $node ) {
}
*/


function file_Add( $author, $node, $tag, $name, $size, $status ) {
	return db_QueryInsert(
		"INSERT IGNORE INTO ".SH_TABLE_PREFIX.SH_TABLE_FILE." (
			author,
			node,
			tag,
			name,
			size,
			timestamp,
			status
		)
		VALUES (
			?,
			?,
			?,
			?,
			?,
			NOW(),
			?
		);",
		$author,
		$node,
		$tag,
        $name,
		$size,
		$status
	);
}
