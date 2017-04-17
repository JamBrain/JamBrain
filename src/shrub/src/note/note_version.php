<?php

function noteVersion_Add( $note, $author, $body, $tag = "" ) {
	$ret = db_QueryInsert(
		"INSERT IGNORE INTO ".SH_TABLE_PREFIX.SH_TABLE_NOTE_VERSION." (
			note,
			author,
			timestamp,
			body,
			tag
		)
		VALUES (
			?,
			?,
			NOW(),
			?,
			?
		)",
		$note,
		$author,
		$body,
		$tag
	);
	
	return $ret;
}
