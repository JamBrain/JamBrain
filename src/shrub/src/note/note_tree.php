<?php

function noteTree_Add( $node, $note, $ancestor, $hops ) {
	$ret = db_QueryInsert(
		"INSERT IGNORE INTO ".SH_TABLE_PREFIX.SH_TABLE_NOTE_TREE." (
			node,
			note,
			ancestor,
			hops
		)
		VALUES (
			?,
			?,
			?,
			?
		)",
		$node,
		$note,
		$ancestor,
		$hops
	);
	
	return $ret;
}
