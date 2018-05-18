<?php

function commentTree_Add( $node, $comment, $ancestor, $hops ) {
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
		$comment,
		$ancestor,
		$hops
	);

	return $ret;
}
