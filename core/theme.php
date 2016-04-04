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
	return db_QueryInsert(
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
		
		$result = db_QueryInsert(
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
	return db_QueryDelete(
		"DELETE FROM ".CMW_TABLE_THEME_IDEA." WHERE id=?;",
		$id
	);
}
function theme_RemoveMyIdea($id,$user_id) {
	return db_QueryDelete(
		"DELETE FROM ".CMW_TABLE_THEME_IDEA." WHERE id=? AND user=?;",
		$id,$user_id
	);
}

function theme_SetParent($id, $value) {
	return db_QueryInsert(
		"UPDATE ".CMW_TABLE_THEME_IDEA."
		SET
			parent=?
		WHERE
			id=?;",
		$value, $id
	);
}

function theme_SetScore($id, $value) {
	return db_QueryInsert(
		"UPDATE ".CMW_TABLE_THEME_IDEA."
		SET
			score=?
		WHERE
			id=?;",
		$value, $id
	);
}

function theme_GetMyIdeas($node, $user) {
	return db_QueryFetch(
		"SELECT id,theme FROM ".CMW_TABLE_THEME_IDEA." 
		WHERE node=? AND user=?",
		$node, $user
	);
}
function theme_CountMyIdeas($node, $user, $arg_string="") {
	$ret = db_QueryFetchSingle(
		"SELECT count(id) FROM ".CMW_TABLE_THEME_IDEA." 
		WHERE node=? AND user=? LIMIT 1".$arg_string,
		$node, $user
	);
	if ( is_array($ret) )
		return intval($ret[0]);
	return false;
}
function theme_GetMyIdeasWithScores($node, $user) {
	$ret = db_QueryFetch(
		"SELECT id,theme,parent,score FROM ".CMW_TABLE_THEME_IDEA." 
		WHERE node=? AND user=?",
		$node, $user
	);
	
	$parents = [];
	foreach( $ret as $idea ) {
		if ( $idea['parent'] > 0 ) {
			$parents[] = intval($idea['id']);
		}
	}
	
	if ( !empty($parents) ) {
		$parent_scores = db_QueryFetch(
			"SELECT id,score FROM ".CMW_TABLE_THEME_IDEA." 
			WHERE node IN ?",
			$parents
		);
		
		foreach( $ret as &$idea ) {
			$idx = intval($idea['parent']);
			if ( isset($parent_scores[$idx]) ) {
				$idea['score'] = intval($parent_scores[$idx]);
			}
		}
	}
	
	return $ret;
}

function theme_GetMyOtherIdeas($node, $user) {
	return db_QueryFetch(
		"SELECT id,theme FROM ".CMW_TABLE_THEME_IDEA." 
		WHERE node!=? AND user=?",
		$node, $user
	);
}


// Ideas are associated with nodes //
function theme_GetIdeas($node) {
	return db_QueryFetch(
		"SELECT id,theme,user,parent FROM ".CMW_TABLE_THEME_IDEA." 
		WHERE node=?",
		$node
	);
}
function theme_CountIdeas($node,$arg_string="") {
	$ret = cache_Fetch(_THEME_CACHE_KEY."IDEA_COUNT");

	if ( $ret === null ) {
		$ret = db_QueryFetchSingle(
			"SELECT count(id) FROM ".CMW_TABLE_THEME_IDEA." 
			WHERE node=? LIMIT 1".$arg_string,
			$node
		);
		if ( is_array($ret) ) {
			$ret = intval($ret[0]);
			
			cache_Store(_THEME_CACHE_KEY."IDEA_COUNT",$ret,_THEME_CACHE_TTL);
		}
		else {
			return null;
		}
	}
	return $ret;
}
function theme_CountTotalIdeas($node,$arg_string="") {
	$ret = cache_Fetch(_THEME_CACHE_KEY."TOTAL_IDEA_COUNT");

	if ( $ret === null ) {
		$ret = db_QueryFetchSingle(
			"SELECT count(id) FROM ".CMW_TABLE_THEME_IDEA." 
			LIMIT 1".$arg_string
		);
		if ( is_array($ret) ) {
			$ret = intval($ret[0]);
			
			cache_Store(_THEME_CACHE_KEY."TOTAL_IDEA_COUNT",$ret,_THEME_CACHE_TTL);
		}
		else {
			return null;
		}
	}
	return $ret;
}

function theme_CountUsersWithIdeas($node,$arg_string="") {
	$ret = cache_Fetch(_THEME_CACHE_KEY."USERS_WITH_IDEAS");

	if ( $ret === null ) {
		$ret = db_QueryFetchSingle(
			"SELECT count(DISTINCT user) FROM ".CMW_TABLE_THEME_IDEA." 
			WHERE node=?".$arg_string,
			$node
		);
		if ( is_array($ret) ) {
			$ret = intval($ret[0]);
			
			cache_Store(_THEME_CACHE_KEY."USERS_WITH_IDEAS",$ret,_THEME_CACHE_TTL);
		}
		else {
			return null;
		}
	}
	return $ret;
}


// An idea is considered original if it has no parent //
function theme_GetOriginalIdeas($node) {
	return db_QueryFetchPair(
		"SELECT id,theme FROM ".CMW_TABLE_THEME_IDEA." 
		WHERE node=? AND parent=0;",
		$node
	);
}
function theme_CountOriginalIdeas($node,$arg_string="") {
	$ret = db_QueryFetchSingle(
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
	return db_QueryFetchFirst(
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
		$ret = db_QueryFetchPair(
			"SELECT id,theme FROM ".CMW_TABLE_THEME_IDEA." 
			WHERE node=? AND parent=0 AND score >= 0;",
			$node
		);

		cache_Store(_THEME_CACHE_KEY."IDEA_LIST",$ret,_THEME_CACHE_TTL);
	}
	return $ret;
}

function theme_CountUsersThatKill($node,$arg_string="") {
	$ret = cache_Fetch(_THEME_CACHE_KEY."USERS_THAT_KILL");

	if ( $ret === null ) {
		$ret = db_QueryFetchSingle(
			"SELECT count(DISTINCT user) FROM ".CMW_TABLE_THEME_IDEA_VOTE."
				WHERE timestamp >= curdate() - INTERVAL 5 WEEK"
		);
		if ( is_array($ret) ) {
			$ret = intval($ret[0]);
			
			cache_Store(_THEME_CACHE_KEY."USERS_THAT_KILL",$ret,_THEME_CACHE_TTL);
		}
		else {
			return null;
		}
	}
	return $ret;
}

function theme_AddIdeaVote($idea_id, $value, $user) {
	return db_QueryInsert(
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
	return db_QueryDelete(
		"DELETE FROM ".CMW_TABLE_THEME_IDEA_VOTE." WHERE id=?;",
		$id
	);
}
function theme_RemoveIdeaVoteByUser($idea_id,$user) {
	return db_QueryDelete(
		"DELETE FROM ".CMW_TABLE_THEME_IDEA_VOTE." WHERE node=? AND user=?;",
		$idea_id,$user
	);
}

function theme_GetMyIdeaVotes($user,$limit) {
	$suffix = "";
	if ( isset($limit) ) {
		$suffix = " LIMIT ".$limit;
	}
	return db_QueryFetch(
		"SELECT node,value FROM ".CMW_TABLE_THEME_IDEA_VOTE." 
		WHERE user=?
		ORDER BY id DESC
		".$suffix,
		$user
	);
}

function theme_GetMyIdeaStats($user) {
	// HACK: only taking votes from the past 5 weeks isn't technically correct
	return db_QueryFetchPair(
		"SELECT value,COUNT(id) FROM ".CMW_TABLE_THEME_IDEA_VOTE."
			WHERE user=? AND timestamp >= curdate() - INTERVAL 5 WEEK
			GROUP BY value
		",
		$user
	);
}

function theme_GetVotesForIdea($node) {
	return db_QueryFetchSingle(
		"SELECT value FROM ".CMW_TABLE_THEME_IDEA_VOTE." 
		WHERE node=?",
		$node
	);	
}

function theme_GetIdeaStats() {
	// HACK: only taking votes from the past 5 weeks isn't technically correct
	$ret = cache_Fetch(_THEME_CACHE_KEY."IDEA_STATS");
	
	if ( $ret === null ) {
		$ret = db_QueryFetchPair(
			"SELECT value,COUNT(id) FROM ".CMW_TABLE_THEME_IDEA_VOTE."
				WHERE timestamp >= curdate() - INTERVAL 5 WEEK
				GROUP BY value
			"
		);

		cache_Store(_THEME_CACHE_KEY."IDEA_STATS",$ret,_THEME_CACHE_TTL);
	}
	return $ret;
}

function theme_GetUserKillCounts() {
	$ret = cache_Fetch(_THEME_CACHE_KEY."IDEA_KILL_COUNTS");
	
	if ( $ret === null ) {
		$ret = db_QueryFetchPair(
			"SELECT user,COUNT(id) FROM ".CMW_TABLE_THEME_IDEA_VOTE."
				GROUP BY user
			"
		);

		cache_Store(_THEME_CACHE_KEY."IDEA_KILL_COUNTS",$ret,_THEME_CACHE_TTL);
	}
	return $ret;
}

function theme_GetIdeaHourlyStats() {
	$ret = cache_Fetch(_THEME_CACHE_KEY."IDEA_HOURLYSTATS");

	if ( $ret === null ) {
		$result = db_QueryFetch(
			"SELECT value,COUNT(id) AS count,".MYSQL_ISO_FORMAT('timestamp').",HOUR(timestamp) as hour,DAYOFYEAR(timestamp) as day FROM ".CMW_TABLE_THEME_IDEA_VOTE."
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

function theme_GetThemeValidVotingList($node) {
	$ret = cache_Fetch(_THEME_CACHE_KEY."VALID_VOTE_LIST");

	if ( $ret === null ) {
		$result = db_QueryFetch(
			"SELECT id,theme,page FROM ".CMW_TABLE_THEME." 
			WHERE node=? AND page<4",
			$node
		);
		
		$ret = [];
		foreach ($result AS &$item) {
			$ret[$item['id']] = $item;
		}

		cache_Store(_THEME_CACHE_KEY."VALID_VOTE_LIST",$ret,_THEME_CACHE_TTL);
	}
	return $ret;
}

function theme_GetFinalThemeValidVotingList($node) {
	$ret = cache_Fetch(_THEME_CACHE_KEY."FINAL_VALID_VOTE_LIST");

	if ( $ret === null ) {
		$result = db_QueryFetch(
			"SELECT id,theme FROM ".CMW_TABLE_THEME_FINAL." 
			WHERE node=?",
			$node
		);
		
		$ret = [];
		foreach ($result AS &$item) {
			$ret[$item['id']] = $item;
		}

		cache_Store(_THEME_CACHE_KEY."FINAL_VALID_VOTE_LIST",$ret,_THEME_CACHE_TTL);
	}
	return $ret;
}

function theme_GetTopThemes($node) {
	$ret = db_QueryFetch(
		"SELECT id,theme,page,score FROM ".CMW_TABLE_THEME." 
		WHERE node=? AND page<4
		ORDER BY score DESC
		LIMIT 20",
		$node
	);
	
	return $ret;
}

function theme_GetThemeVotingList($node) {
	$ret = cache_Fetch(_THEME_CACHE_KEY."VOTE_LIST");

	if ( $ret === null ) {
		$ret = db_QueryFetch(
			"SELECT id,theme,page FROM ".CMW_TABLE_THEME." 
			WHERE node=? AND page<4
			ORDER BY page ASC,score DESC,id ASC",
			$node
		);

		cache_Store(_THEME_CACHE_KEY."VOTE_LIST",$ret,_THEME_CACHE_TTL);
	}
	return $ret;
}

function theme_GetFinalVotingList($node) {
	$ret = cache_Fetch(_THEME_CACHE_KEY."FINAL_VOTE_LIST");

	if ( $ret === null ) {
		$ret = db_QueryFetch(
			"SELECT id,theme FROM ".CMW_TABLE_THEME_FINAL." 
			WHERE node=?
			ORDER BY score DESC,id ASC",
			$node
		);

		cache_Store(_THEME_CACHE_KEY."FINAL_VOTE_LIST",$ret,_THEME_CACHE_TTL);
	}
	return $ret;	
}

function theme_AddVote($node, $value, $user) {
	return db_QueryInsert(
		"INSERT INTO ".CMW_TABLE_THEME_VOTE." (
			node, user, value, `timestamp`
		)
		VALUES ( 
			?, ?, ?, NOW()
		)
		ON DUPLICATE KEY UPDATE 
			value=VALUES(value),
			`timestamp`=VALUES(`timestamp`)
		",
		$node, $user, $value
	);
}
function theme_RemoveVoteById($id) {
	return db_QueryDelete(
		"DELETE FROM ".CMW_TABLE_THEME_VOTE." WHERE id=?;",
		$id
	);
}
function theme_RemoveVoteByUser($idea_id,$user) {
	return db_QueryDelete(
		"DELETE FROM ".CMW_TABLE_THEME_VOTE." WHERE node=? AND user=?;",
		$idea_id,$user
	);
}

function theme_GetMyVotes($user) {
	return db_QueryFetch(
		"SELECT node,value FROM ".CMW_TABLE_THEME_VOTE." 
		WHERE user=?
		",
		$user
	);
}

function theme_GetMyFinalVotes($user) {
	return db_QueryFetch(
		"SELECT node,value FROM ".CMW_TABLE_THEME_FINAL_VOTE." 
		WHERE user=?
		",
		$user
	);
}


function theme_GetScoredIdeaList($node,$limit=80) {
	$ret = db_QueryFetch(
		"SELECT id,theme,score FROM ".CMW_TABLE_THEME_IDEA." 
		WHERE node=? AND parent=0
		ORDER BY score DESC
		LIMIT ".$limit,
		$node
	);

	return $ret;
}

function theme_AddTheme($id,$node,$theme) {
	return db_QueryInsert(
		"INSERT INTO ".CMW_TABLE_THEME." (
			id, node, theme, `timestamp`
		)
		VALUES ( 
			?, ?, ?, NOW()
		)",
		$id, $node, $theme
	);
}

function theme_AddFinalTheme($id,$node,$theme) {
	return db_QueryInsert(
		"INSERT INTO ".CMW_TABLE_THEME_FINAL." (
			id, node, theme
		)
		VALUES ( 
			?, ?, ?
		)",
		$id, $node, $theme
	);
}

function theme_SetPage($id, $value) {
	return db_QueryInsert(
		"UPDATE ".CMW_TABLE_THEME."
		SET
			page=?
		WHERE
			id=?;",
		$value, $id
	);
}


function theme_GetVotes($node) {
	return db_QueryFetchSingle(
		"SELECT value FROM ".CMW_TABLE_THEME_VOTE." 
		WHERE node=?",
		$node
	);	
}
function theme_GetFinalVotes($node) {
	return db_QueryFetchSingle(
		"SELECT value FROM ".CMW_TABLE_THEME_FINAL_VOTE." 
		WHERE node=?",
		$node
	);	
}

function theme_SetVoteScore($id, $value) {
	return db_QueryInsert(
		"UPDATE ".CMW_TABLE_THEME."
		SET
			score=?
		WHERE
			id=?;",
		$value, $id
	);
}
function theme_SetFinalVoteScore($id, $value) {
	return db_QueryInsert(
		"UPDATE ".CMW_TABLE_THEME_FINAL."
		SET
			score=?
		WHERE
			id=?;",
		$value, $id
	);
}

function theme_CalculateScores($node,$page) {
	$themes = theme_GetThemeValidVotingList($node);
	
	$ret = [];
	foreach( $themes AS $key => $value ) {
		if ($value['page'] !== $page)
			continue;
			
		$votes = theme_GetVotes($key);
		
		$score_sum = 0;
		$scores = [ -1 => 0, 0 => 0, 1 => 0 ];
		
		$votes_count = count($votes);
		for ($idx = 0; $idx < $votes_count; $idx++ ) {
			$score_sum += intval($votes[$idx]);
			$scores[$votes[$idx]]++;
		}
		
		theme_SetVoteScore($key,$score_sum);
		$ret[$key] = [ 'score' => $score_sum, 'scores' => $scores, 'count' => $votes_count ];
	}
	
	return $ret;
}

function theme_CalculateFinalScores($node) {
	$themes = theme_GetFinalThemeValidVotingList($node);
	
	$ret = [];
	foreach( $themes AS $key => $value ) {			
		$votes = theme_GetFinalVotes($key);
		
		$score_sum = 0;
		$scores = [ -1 => 0, 0 => 0, 1 => 0 ];
		
		$votes_count = count($votes);
		for ($idx = 0; $idx < $votes_count; $idx++ ) {
			$score_sum += intval($votes[$idx]);
			$scores[$votes[$idx]]++;
		}
		
		theme_SetFinalVoteScore($key,$score_sum);
		$ret[$key] = [ 'id' => $key, 'theme' => $themes[$key]['theme'], 'score' => $score_sum, 'scores' => $scores, 'count' => $votes_count ];
	}
	
	return $ret;
}
function theme_GetFinalScores($node) {
	$themes = theme_GetFinalThemeValidVotingList($node);
	
	$ret = [];
	foreach( $themes AS $key => $value ) {			
		$votes = theme_GetFinalVotes($key);
		
		$score_sum = 0;
		$scores = [ -1 => 0, 0 => 0, 1 => 0 ];
		
		$votes_count = count($votes);
		for ($idx = 0; $idx < $votes_count; $idx++ ) {
			$score_sum += intval($votes[$idx]);
			$scores[$votes[$idx]]++;
		}
		
		$ret[$key] = [ 'id' => $key, 'theme' => $themes[$key]['theme'], 'score' => $score_sum, 'scores' => $scores, 'count' => $votes_count ];
	}
	
	usort($ret,function($a,$b){     
		if ($a['score'] == $b['score'])
			return 0;
		return ($a['score'] > $b['score']) ? -1 : 1;
	});

	return $ret;
}



function theme_AddFinalVote($node, $value, $user) {
	return db_QueryInsert(
		"INSERT INTO ".CMW_TABLE_THEME_FINAL_VOTE." (
			node, user, value, `timestamp`
		)
		VALUES ( 
			?, ?, ?, NOW()
		)
		ON DUPLICATE KEY UPDATE 
			value=VALUES(value),
			`timestamp`=VALUES(`timestamp`)
		",
		$node, $user, $value
	);
}
function theme_RemoveFinalVoteById($id) {
	return db_QueryDelete(
		"DELETE FROM ".CMW_TABLE_THEME_VOTE_FINAL." WHERE id=?;",
		$id
	);
}
function theme_RemoveFinalVoteByUser($idea_id,$user) {
	return db_QueryDelete(
		"DELETE FROM ".CMW_TABLE_THEME_VOTE_FINAL." WHERE node=? AND user=?;",
		$idea_id,$user
	);
}
