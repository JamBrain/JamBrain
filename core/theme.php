<?php
/**
 * Theme Lib
 *
 * @file
 */
require_once __DIR__ . "/../db.php";

// **** PLEASE SANITIZE BEFORE CALLING **** //

function theme_AddIdea($idea, $node, $user) {
	db_Connect();
	
	return db_DoInsertQuery(
		"INSERT INTO ".CMW_TABLE_THEME_IDEA." (
			theme, node, author, `timestamp`
		)
		VALUES ( 
			?, ?, ?, NOW()
		)",
		$idea, $node, $user
	);
}

function theme_GetIdeas($node, $user) {
	db_Connect();

	return db_DoFetch(
		"SELECT id,theme FROM ".CMW_TABLE_THEME_IDEA." 
		WHERE node=? AND author=?",
		$node, $user
	);
}

function theme_RemoveIdea($id) {
	db_Connect();
	
	return db_DoInsertQuery(
		"DELETE FROM ".CMW_TABLE_THEME_IDEA." WHERE id=?;",
		$id
	);
}
function theme_RemoveMyIdea($id,$user_id) {
	db_Connect();
	
	return db_DoInsertQuery(
		"DELETE FROM ".CMW_TABLE_THEME_IDEA." WHERE id=? AND author=?;",
		$id,$user_id
	);
}

