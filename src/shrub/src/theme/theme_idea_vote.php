<?php

function themeIdeaVote_GetIdeas( $event_id, $threshold = null ) {
	return themeIdea_GetOriginal($event_id, 0, $threshold);
}

function themeIdeaVote_GetMy( $event_id, $author_id ) {
	return db_QueryFetchPair(
		"SELECT idea, value 
		FROM ".SH_TABLE_PREFIX.SH_TABLE_THEME_IDEA_VOTE." 
		WHERE node=? AND author=?;",
		$event_id, 
		$author_id
	);
}

function themeIdeaVote_Add( $event_id, $idea_id, $author_id, $value ) {
	return db_QueryInsert(
		"INSERT INTO ".SH_TABLE_PREFIX.SH_TABLE_THEME_IDEA_VOTE." (
			node, idea, author, value, timestamp
		)
		VALUES ( 
			?, ?, ?, ?, NOW()
		)
		ON DUPLICATE KEY UPDATE
			value=VALUES(value), timestamp=VALUES(timestamp)
		;",
		$event_id, $idea_id, $author_id, $value
	);
}

function themeIdeaVote_Remove( $event_id, $idea_id, $author_id ) {
	return db_QueryDelete(
		"DELETE FROM ".SH_TABLE_PREFIX.SH_TABLE_THEME_IDEA_VOTE." 
		WHERE node=? AND 
			idea=? AND 
			author=?;",
		$event_id,
		$idea_id,
		$author_id
	);
}

function themeIdeaVote_RemoveById( $id ) {
	return db_QueryDelete(
		"DELETE FROM ".SH_TABLE_PREFIX.SH_TABLE_THEME_IDEA_VOTE." 
		WHERE id=?;",
		$id
	);
}
