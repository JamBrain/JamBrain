<?php

// BUG: authornode should be authorcomment *
// supernode (event), node (game), then author of the comment (i.e. authorcomment), and finally the author of the love

function commentLove_CountByNode( $node ) {
	$ret = db_QueryFetch(
		"SELECT
			note,
			COUNT(note) AS count,
			".DB_FIELD_DATE('MAX(timestamp)','timestamp')."
		FROM ".SH_TABLE_PREFIX.SH_TABLE_NOTE_LOVE."
		WHERE node=?
		GROUP BY note;",
		$node
	);

	return $ret;
}

// For us: event_id, our game_id, our team's author ids
// Not our node (i.e. other games), comments (comments) authored by us, ignoring love from us and our team
function commentLove_CountBySuperNotNodeAuthorKnownNotAuthor( $supernode_id, $node_id, $author_ids ) {
	if ( !is_array($author_ids) )
		$author_ids = [$author_ids];

	return db_QueryFetchValue(
		"SELECT
			COUNT(id) AS count
		FROM
			".SH_TABLE_PREFIX.SH_TABLE_NOTE_LOVE."
		WHERE
			supernode=?
			AND node!=?
			AND authornode IN (".implode(',', $author_ids).")
			AND author > 0
			AND author NOT IN (".implode(',', $author_ids).")
		;",
		$supernode_id,
		$node_id
	);
}

// Against us: event_id, our game_id, our team's author ids
// All comments (comments) on our game not by us, and ignoring any love by us and our team
function commentLove_CountBySuperNodeNotAuthorKnownNotAuthor( $supernode_id, $node_id, $author_ids ) {
	if ( !is_array($author_ids) )
		$author_ids = [$author_ids];

	return db_QueryFetchValue(
		"SELECT
			COUNT(id) AS count
		FROM
			".SH_TABLE_PREFIX.SH_TABLE_NOTE_LOVE."
		WHERE
			supernode=?
			AND node=?
			AND authornode NOT IN (".implode(',', $author_ids).")
			AND author > 0
			AND author NOT IN (".implode(',', $author_ids).")
		;",
		$supernode_id,
		$node_id
	);
}


// This should actually work fine, I just want to discourage myself from using it, due to preformance
function commentLove_GetByComment( $comments ) {
	$multi = is_array($comments);
	if ( !$multi )
		$comments = [$comments];

	if ( is_array($comments) ) {
		// Confirm that all Comments are not zero
		foreach( $comments as $comment ) {
			if ( intval($comment) == 0 )
				return null;
		}

		// Build IN string
		$comment_string = implode(',', $comments);

		$ret = db_QueryFetch(
			"SELECT note, COUNT(note) AS count, ".DB_FIELD_DATE('MAX(timestamp)','timestamp')."
			FROM ".SH_TABLE_PREFIX.SH_TABLE_NOTE_LOVE."
			WHERE note IN ($comment_string)
			GROUP BY note".($multi?';':' LIMIT 1;')
		);

		if ( $multi )
			return $ret;
		else
			return $ret ? $ret[0] : null;
	}

	return null;
}


/// Can only add 1 love at a time (NOTE: has an extra arguments versus the node code)
function commentLove_AddByComment( $id, $author, $node, $supernode, $authornode ) {
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
function commentLove_RemoveByComment( $id, $author ) {
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

function commentLove_GetByAuthor( $author, $node = null, $limit = 200 ) {
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
