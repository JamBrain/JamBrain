<?php
/**
 * Theme Lib
 *
 * @file
 */
require_once __DIR__."/../db.php";
require_once __DIR__."/internal/cache.php";

// **** PLEASE SANITIZE BEFORE CALLING **** //

const _THEME_CACHE_KEY = "CMW_THEME_";
const _THEME_CACHE_TTL = 10*60;

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

function theme_SetParent($id, $value) {
	return db_DoInsert(
		"UPDATE ".CMW_TABLE_THEME_IDEA."
		SET
			parent=?
		WHERE
			id=?;",
		$value, $id
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
	$ret = db_DoFetchSingle(
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
	$ret = db_DoFetchSingle(
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
	return db_DoFetchPair(
		"SELECT id,theme FROM ".CMW_TABLE_THEME_IDEA." 
		WHERE node=? AND parent=0;",
		$node
	);
}
function theme_CountOriginalIdeas($node,$arg_string="") {
	$ret = db_DoFetchSingle(
		"SELECT count(id) FROM ".CMW_TABLE_THEME_IDEA." 
		WHERE node=? AND parent=0 LIMIT 1".$arg_string,
		$node
	);
	if ( is_array($ret) )
		return intval($ret[0]);
	return false;
}

// DO NOT USE THIS! It's too slow! For testing only. //
function theme_GetRandom($node) {
	return db_DoFetchFirst(
		"SELECT id,theme FROM ".CMW_TABLE_THEME_IDEA." 
		WHERE node=? AND parent=0
		ORDER BY rand() LIMIT 1",
		$node
	);
}

// The official list used by the Theme Slaughter
function theme_GetIdeaList($node) {
	$ret = cache_Fetch(_THEME_CACHE_KEY."IDEA_LIST");
	
	if ( $ret === null ) {
		$ret = theme_GetOriginalIdeas($node); // Hack: For now, just use all original ideas

		cache_Store(_THEME_CACHE_KEY."IDEA_LIST",$ret,_THEME_CACHE_TTL);
	}
	return $ret;
}

function theme_AddIdeaVote($idea_id, $value, $user) {
	return db_DoInsert(
		"INSERT INTO ".CMW_TABLE_THEME_IDEA_VOTE." (
			node, user, value, `timestamp`
		)
		VALUES ( 
			?, ?, ?, NOW()
		)
		ON DUPLICATE KEY UPDATE 
			value=VALUES(value),
			`timestamp`=VALUES(`timestamp`)
		",
		$idea_id, $user, $value
	);
}
function theme_RemoveIdeaVoteById($id) {
	return db_DoDelete(
		"DELETE FROM ".CMW_TABLE_THEME_IDEA_VOTE." WHERE id=?;",
		$id
	);
}
function theme_RemoveIdeaVoteByUser($idea_id,$user) {
	return db_DoDelete(
		"DELETE FROM ".CMW_TABLE_THEME_IDEA_VOTE." WHERE node=? AND user=?;",
		$idea_id,$user
	);
}

function theme_GetMyIdeaVotes($user,$limit) {
	$suffix = "";
	if ( isset($limit) ) {
		$suffix = " LIMIT ".$limit;
	}
	return db_DoFetch(
		"SELECT node,value FROM ".CMW_TABLE_THEME_IDEA_VOTE." 
		WHERE user=?
		ORDER BY id DESC
		".$suffix,
		$user
	);
}

function theme_GetMyIdeaStats($user) {
	return db_DoFetchPair(
		"SELECT value,COUNT(id) FROM ".CMW_TABLE_THEME_IDEA_VOTE."
			WHERE user=?
			GROUP BY value
		",
		$user
	);
}
function theme_GetIdeaStats() {
	$ret = cache_Fetch(_THEME_CACHE_KEY."IDEA_STATS");
	
	if ( $ret === null ) {
		$ret = db_DoFetchPair(
			"SELECT value,COUNT(id) FROM ".CMW_TABLE_THEME_IDEA_VOTE."
				GROUP BY value
			"
		);

		cache_Store(_THEME_CACHE_KEY."IDEA_STATS",$ret,_THEME_CACHE_TTL);
	}
	return $ret;
}

function theme_GetIdeaHourlyStats() {
	$ret = cache_Fetch(_THEME_CACHE_KEY."IDEA_HOURLYSTATS");

	if ( $ret === null ) {
		$result = db_DoFetch(
			"SELECT value,COUNT(id) AS count,timestamp,HOUR(timestamp) as hour,DAYOFYEAR(timestamp) as day FROM ".CMW_TABLE_THEME_IDEA_VOTE."
				GROUP BY day,hour,value
			"
		);
		
		$ret = [];
		foreach( $result as $item ) {
			$idx = ($item['day']*24)+$item['hour'];
			
			$ret[$idx]['timestamp'] = $item['timestamp'];
			$ret[$idx]['day'] = $item['day'];
			$ret[$idx]['hour'] = $item['hour'];
			$ret[$idx]['count'][$item['value']] = $item['count'];
			if ( isset($ret[$idx]['total']) )
				$ret[$idx]['total'] += $item['count'];
			else
				$ret[$idx]['total'] = $item['count'];
		}
		
		$ret = array_values($ret);
		
		cache_Store(_THEME_CACHE_KEY."IDEA_HOURLYSTATS",$ret,_THEME_CACHE_TTL);
	}
	return $ret;
}

