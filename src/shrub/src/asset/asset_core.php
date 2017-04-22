<?php

function asset_GetByAuthor( $author ) {
	
}

function asset_GetById( $id ) {
	
}


function asset_AddByNode( $author, $type, $mime, $size, $meta ) {
	$json_format = JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES;
	if ( is_array($meta) ) {
		$meta = json_encode($meta, $json_format);
	}
	else {
		return 0;
	}
//	else if ( is_string($meta) ) {
//	}
//	else {
//		$meta = json_encode([], $json_format);
//	}

	return db_QueryInsert(
		"INSERT IGNORE INTO ".SH_TABLE_PREFIX.SH_TABLE_ASSET." (
			author,
			type,
			mime,
			size,
			timestamp,
			meta
		)
		VALUES (
			?,
			?,
			?,
			?,
			NOW(),
			?
		);",
		$author,
		$type,
		$mime,
		$size,
		$meta
	);
}
