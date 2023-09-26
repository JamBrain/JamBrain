<?php
require_once __DIR__."/../constants.php";
require_once __DIR__."/../core/db.php";

function themeList_GetById( $id ) {
	return db_QueryFetchFirst(
		"SELECT id, node, idea, theme, page, score, ".DB_FIELD_DATE('timestamp')."
			FROM ".SH_TABLE_PREFIX.SH_TABLE_THEME_LIST."
			WHERE id=? LIMIT 1;",
			$id
		);	
}

function themeList_GetByNode( $id, $page = null ) {
	if ( isset($page) ) {
		return db_QueryFetch(
			"SELECT id, node, idea, theme, page, score, ".DB_FIELD_DATE('timestamp')."
				FROM ".SH_TABLE_PREFIX.SH_TABLE_THEME_LIST."
				WHERE node=? AND page=?;",
				$id, $page
			);
	}
	else {
		return db_QueryFetch(
			"SELECT id, node, idea, theme, page, score, ".DB_FIELD_DATE('timestamp')."
				FROM ".SH_TABLE_PREFIX.SH_TABLE_THEME_LIST."
				WHERE node=?;",
				$id
			);
	}
}


function themeList_SetScore( $id, $score ) {
	return db_QueryInsert(
		"UPDATE ".SH_TABLE_PREFIX.SH_TABLE_THEME_LIST."
		SET
			score=?
		WHERE
			id=?;",
		$score, $id
	);
}


function themeList_SetPage( $id, $page ) {
	return db_QueryInsert(
		"UPDATE ".SH_TABLE_PREFIX.SH_TABLE_THEME_LIST."
		SET
			page=?
		WHERE
			id=?;",
		$page, $id
	);
}


function themeList_Add( $event_id, $idea_id, $theme, $page, $score = 0 ) {
	return db_QueryInsert(
		"INSERT INTO ".SH_TABLE_PREFIX.SH_TABLE_THEME_LIST." (
			node, idea, theme, page, score, timestamp
		)
		VALUES ( 
			?, ?, ?, ?, ?, NOW()
		)
		;",
		$event_id, $idea_id, $theme, $page, $score 
	);
}