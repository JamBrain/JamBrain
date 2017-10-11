<?php

function noteVersion_Add( $note, $author, $body, $tag = "", $flags = 0 ) {
	$ret = db_QueryInsert(
		"INSERT IGNORE INTO ".SH_TABLE_PREFIX.SH_TABLE_NOTE_VERSION." (
			note,
			author,
			timestamp,
			body,
			tag,
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
		$note,
		$author,
		$body,
		$tag,
		$flags
	);
	
	return $ret;
}
