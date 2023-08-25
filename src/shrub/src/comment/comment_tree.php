<?php

function commentTree_Add( $node, $comment, $ancestor, $hops ) {
	$ret = db_QueryInsert(
		"INSERT IGNORE INTO ".SH_TABLE_PREFIX.SH_TABLE_COMMENT_TREE." (
			_node,
			comment,
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
