<?php
/**
 * Theme Lib
 *
 * @file
 */
require_once __DIR__ . "/../db.php";

// **** PLEASE SANITIZE BEFORE CALLING **** //

function theme_AddMyIdea($idea, $node, $user) {
	return db_DoInsert(
		"INSERT INTO ".CMW_TABLE_THEME_IDEA." (
			theme, node, author, `timestamp`
		)
		VALUES ( 
			?, ?, ?, NOW()
		)",
		$idea, $node, $user
	);
}
function theme_RemoveIdea($id) {
	return db_DoInsert(
		"DELETE FROM ".CMW_TABLE_THEME_IDEA." WHERE id=?;",
		$id
	);
}
function theme_RemoveMyIdea($id,$user_id) {
	return db_DoInsert(
		"DELETE FROM ".CMW_TABLE_THEME_IDEA." WHERE id=? AND author=?;",
		$id,$user_id
	);
}

function theme_GetMyIdeas($node, $user) {
	return db_DoFetch(
		"SELECT id,theme FROM ".CMW_TABLE_THEME_IDEA." 
		WHERE node=? AND author=?",
		$node, $user
	);
}
function theme_CountMyIdeas($node, $user) {
	return intval(db_DoFetchFirst(
		"SELECT count(id) FROM ".CMW_TABLE_THEME_IDEA." 
		WHERE node=? AND author=?",
		$node, $user
	)[0]);
}
