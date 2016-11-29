<?php

function themeIdeaVote_GetMy( $event_id, $user_id ) {
	return db_QueryFetchPair(
		"SELECT node, value 
		FROM ".SH_TABLE_PREFIX.SH_TABLE_THEME_IDEA_VOTE." 
		WHERE node=? AND author=?;",
		$event_id, 
		$user_id
	);
}
