<?php
require_once __DIR__."/../constants.php";
require_once __DIR__."/../core/db.php";

function themeListVote_GetByNodeUser( $event_id, $author_id ) {
	return db_QueryFetch(
		"SELECT node, author, theme, vote, ".DB_FIELD_DATE('timestamp')."
			FROM ".SH_TABLE_PREFIX.SH_TABLE_THEME_LIST_VOTE."
			WHERE node=? AND author=?;",
			$event_id, $author_id
		);
}

function themeListVote_Add( $event_id, $author_id, $theme_id, $vote ) {
	return db_QueryInsert(
		"INSERT INTO ".SH_TABLE_PREFIX.SH_TABLE_THEME_LIST_VOTE." (
			node, author, theme, vote, timestamp
		)
		VALUES ( 
			?, ?, ?, ?, NOW()
		)
		ON DUPLICATE KEY UPDATE
			vote=VALUES(vote), timestamp=VALUES(timestamp)
		;",
		$event_id, $author_id, $theme_id, $vote
	);
}
