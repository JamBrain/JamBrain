<?php

function commentVersion_Add( $comment, $author, $body, $detail = "", $flags = 0 ) {
	$ret = db_QueryInsert(
		"INSERT IGNORE INTO ".SH_TABLE_PREFIX.SH_TABLE_COMMENT_VERSION." (
			comment,
			author,
			timestamp,
			body,
			detail,
			flags
		)
		VALUES (
			?,
			?,
			NOW(),
			?,
			?,
			?
		)",
		$comment,
		$author,
		$body,
		$detail,
		$flags
	);

	return $ret;
}
