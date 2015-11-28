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
			theme, node, user, `timestamp`
		)
		VALUES ( 
			?, ?, ?, NOW()
		)",
		$idea, $node, $user
	);
}

function theme_AddMyIdeaWithLimit($idea, $node, $user, $limit) {
	db_Connect();	// Only because we're doing native DB ops, call connect //
	
	global $db;
	$db->begin_transaction();
	
	$count = 0;
	
	try {
		$count = theme_CountMyIdeas($node,$user," FOR UPDATE");
		if ( $count === false ) throw new Exception();
		if ( $count >= $limit ) throw new Exception();
		
		$result = db_DoInsert(
			"INSERT INTO ".CMW_TABLE_THEME_IDEA." (
				theme, node, user, `timestamp`
			)
			VALUES ( 
				?, ?, ?, NOW()
			)",
			$idea, $node, $user
		);
		if ( empty($result) ) throw new Exception();

		$count = theme_CountMyIdeas($node,$user);
		if ( $count === false ) throw new Exception();
		if ( $count > $limit ) throw new Exception();
		
		// We're good! Commit! We're finished //
		$db->commit();
		return ["id" => $result, "count" => $count];
	}
	catch (Exception $ex) {
		// Bad! Do a rollback! //
		$db->rollback();
		return ["id" => 0, "count" => $count];
	}
}

function theme_RemoveIdea($id) {
	return db_DoDelete(
		"DELETE FROM ".CMW_TABLE_THEME_IDEA." WHERE id=?;",
		$id
	);
}
function theme_RemoveMyIdea($id,$user_id) {
	return db_DoDelete(
		"DELETE FROM ".CMW_TABLE_THEME_IDEA." WHERE id=? AND user=?;",
		$id,$user_id
	);
}

function theme_GetMyIdeas($node, $user) {
	return db_DoFetch(
		"SELECT id,theme FROM ".CMW_TABLE_THEME_IDEA." 
		WHERE node=? AND user=?",
		$node, $user
	);
}
function theme_CountMyIdeas($node, $user, $arg_string="") {
	$ret = db_DoFetchFirst(
		"SELECT count(id) FROM ".CMW_TABLE_THEME_IDEA." 
		WHERE node=? AND user=? LIMIT 1".$arg_string,
		$node, $user
	);
	if ( is_array($ret) )
		return intval($ret[0]);
	return false;
}

// Ideas are associated with nodes //
function theme_GetIdeas($node) {
	return db_DoFetch(
		"SELECT id,theme,user,parent FROM ".CMW_TABLE_THEME_IDEA." 
		WHERE node=?",
		$node
	);
}
function theme_CountIdeas($node,$arg_string="") {
	$ret = db_DoFetchFirst(
		"SELECT count(id) FROM ".CMW_TABLE_THEME_IDEA." 
		WHERE node=? LIMIT 1".$arg_string,
		$node
	);
	if ( is_array($ret) )
		return intval($ret[0]);
	return false;
}

// An idea is considered original if it has no parent //
function theme_GetOriginalIdeas($node) {
	return db_DoFetch(
		"SELECT id,theme FROM ".CMW_TABLE_THEME_IDEA." 
		WHERE node=? AND parent=0",
		$node
	);
}
function theme_CountOriginalIdeas($node,$arg_string="") {
	$ret = db_DoFetchFirst(
		"SELECT count(id) FROM ".CMW_TABLE_THEME_IDEA." 
		WHERE node=? AND parent=0 LIMIT 1".$arg_string,
		$node
	);
	if ( is_array($ret) )
		return intval($ret[0]);
	return false;
}
