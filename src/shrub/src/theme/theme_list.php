<?php
require_once __DIR__."/../constants.php";
require_once __DIR__."/../core/db.php";

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

