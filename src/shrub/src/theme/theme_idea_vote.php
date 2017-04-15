<?php

function themeIdeaVote_GetIdeas( $event_id, $threshold = null ) {
	return themeIdea_GetOriginal($event_id, 0, $threshold);
}

function themeIdeaVote_GetMy( $event_id, $author_id ) {
	$pairs = db_QueryFetchPairUnsorted(
		"SELECT idea, value 
		FROM ".SH_TABLE_PREFIX.SH_TABLE_THEME_IDEA_VOTE." 
		WHERE node=? AND author=?
		ORDER BY id DESC;",
		$event_id, 
		$author_id
	);
	$ret = [];
	foreach ($pairs as $pair){
		$ret[] = $pairs[1];
	}
	return ret;
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


// How to get Theme Slaughter theme scores (using a basic SUM), out as a CSV

//SELECT _idea.id, _idea.theme, SUM(_vote.value) AS score
//FROM sh_theme_idea_vote AS _vote
//INNER JOIN sh_theme_idea AS _idea ON (_vote.idea = _idea.id)
//WHERE _vote.node=10
//GROUP BY _vote.idea
//ORDER BY score DESC
//
//INTO OUTFILE 'themes.csv'
//FIELDS TERMINATED BY ','
//ENCLOSED BY '"'
//LINES TERMINATED BY '\n';
