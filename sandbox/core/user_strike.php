<?php
/**
 * User Strikes Lib
 *
 * @file
 */
require_once __DIR__ . "/../db.php";

// **** PLEASE SANITIZE BEFORE CALLING **** //

function user_AddStrike($reason, $node, $user) {
	return db_QueryInsert(
		"INSERT INTO ".CMW_TABLE_USER_STRIKE." (
			reason, node, user, `timestamp`
		)
		VALUES ( 
			?, ?, ?, NOW()
		)",
		$reason, $node, $user
	);
}

function theme_RemoveStrike($id) {
	return db_QueryDelete(
		"DELETE FROM ".CMW_TABLE_USER_STRIKE." WHERE id=?;",
		$id
	);
}

function theme_GetStrikes($user) {
	return db_QueryFetch(
		"SELECT id,node,reason,`timestamp` FROM ".CMW_TABLE_USER_STRIKE." 
		WHERE user=?",
		$user
	);
}

// TODO: Get strikes based on date
