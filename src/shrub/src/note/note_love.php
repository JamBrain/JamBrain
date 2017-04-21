<?php

function noteLove_CountByNode( $node ) {
	$ret = db_QueryFetch(
		"SELECT note, COUNT(note) AS count, ".DB_FIELD_DATE('MAX(timestamp)','timestamp')."
		FROM ".SH_TABLE_PREFIX.SH_TABLE_NOTE_LOVE."
		WHERE $node=?
		GROUP BY note;",
		$node
	);

	return $ret;
}

/*
// This should actually work fine, I just want to discourage myself from using it, due to preformance
function noteLove_GetByNote( $notes ) {
	$multi = is_array($notes);
	if ( !$multi )
		$notes = [$notes];

	if ( is_array($notes) ) {
		// Confirm that all Notes are not zero
		foreach( $notes as $note ) {
			if ( intval($note) == 0 )
				return null;
		}

		// Build IN string
		$note_string = implode(',', $notes);

		$ret = db_QueryFetch(
			"SELECT note, COUNT(note) AS count, ".DB_FIELD_DATE('MAX(timestamp)','timestamp')."
			FROM ".SH_TABLE_PREFIX.SH_TABLE_NOTE_LOVE."
			WHERE note IN ($note_string)
			GROUP BY note".($multi?';':' LIMIT 1;')
		);

		if ( $multi )
			return $ret;
		else
			return $ret ? $ret[0] : null;
	}

	return null;
}
*/

/// Can only add 1 love at a time (NOTE: has an extra arguments versus the node code)
function noteLove_AddByNote( $id, $author, $node, $supernode, $authornode ) {
	if ( is_array($id) ) {
		return null;
	}

	if ( !$id || !$node || !is_int($supernode) || !$authornode )
		return null;

	// Anonymous Love support requires newer MYSQL 5.6.3+. Scotchbox ships with 5.5.x.
	if ( $author ) {
		$ip = '0.0.0.0';
	}
	else {
		$ip = $_SERVER['REMOTE_ADDR'];
	}

	return db_QueryInsert(
		"INSERT IGNORE INTO ".SH_TABLE_PREFIX.SH_TABLE_NOTE_LOVE." (
			note,
			node,
			supernode,
			authornode,
			author,
			ip,
			timestamp
		)
		VALUES (
			?,
			?,
			?,
			?,
			?,
			INET6_ATON(?),
			NOW()
		);",
		$id,
		$node,
		$supernode,
		$authornode,
		$author,
		$ip
	);
}

/// Can only remove 1 love at a time
function noteLove_RemoveByNote( $id, $author ) {
	if ( is_array($id) ) {
		return null;
	}

	if ( !$id )
		return null;

	// Anonymous Love support requires newer MYSQL 5.6.3+. Scotchbox ships with 5.5.x.
	if ( $author ) {
		$ip = '0.0.0.0';
	}
	else {
		$ip = $_SERVER['REMOTE_ADDR'];
	}

	return db_QueryDelete(
		"DELETE FROM ".SH_TABLE_PREFIX.SH_TABLE_NOTE_LOVE."
		WHERE note=? AND author=? AND ip=INET6_ATON(?);",
		$id,
		$author,
		$ip
	);
}

function noteLove_GetByAuthor( $author, $node = null, $limit = 200 ) {
	if ( is_array($author) ) {
		return null;
	}

	$QUERY = [];
	$ARGS = [];

	if ( $author ) {
		$QUERY[] = 'author=?';
		$ARGS[] = $author;
	}
	else {
		return null;
	}

	if ( is_integer($node) ) {
		$QUERY[] = 'node=?';
		$ARGS[] = $node;
	}

	$limit_string = '';
	if ( is_integer($limit) ) {
		$limit_string = 'LIMIT ?';
		$ARGS[] = $limit;
	}

	$full_query = '('.implode(' AND ', $QUERY).')';

	return db_QueryFetch(
		"SELECT note
		FROM ".SH_TABLE_PREFIX.SH_TABLE_NOTE_LOVE."
		WHERE $full_query
		$limit_string;",
		...$ARGS
	);

	return null;
}
