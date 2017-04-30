<?php


function grade_AddByNode( $node_id, $author_id, $name, $value ) {
	// todo add exists variant

	return db_QueryInsert(
		"INSERT IGNORE INTO ".SH_TABLE_PREFIX.SH_TABLE_GRADE." (
			node,
			author,
			name,
			value
		)
		VALUES (
			?,
			?,
			?,
			?,
			NOW()
		);",
		$node_id,
		$author_id,
		$name,
		$value
	);
}
