<?php
require_once __DIR__."/../constants.php";
require_once __DIR__."/../core/db.php";

function themeIdea_GetById( $id ) {
	return db_QueryFetchFirst(
		"SELECT id, node, parent, user, theme, ".DB_FIELD_DATE('timestamp').", score
			FROM ".SH_TABLE_PREFIX.SH_TABLE_THEME_IDEA." 
			WHERE id=?;",
			$id
		);
}

/// Get all themes from an event, optionally from a specific user, or above a threshold
function themeIdea_Get( $event_id, $user_id = 0, $threshold = null, $query_suffix = ";" ) {
	if ( $user_id ) {
		return db_QueryFetchPair(
			"SELECT id, theme 
			FROM ".SH_TABLE_PREFIX.SH_TABLE_THEME_IDEA." 
			WHERE node=? AND user=?".$query_suffix,
			$event_id, 
			$user_id
		);
	}
	else {
		if ( isset($threshold) ) {
			return db_QueryFetchPair(
				"SELECT id, theme 
				FROM ".SH_TABLE_PREFIX.SH_TABLE_THEME_IDEA." 
				WHERE node=? AND score>=?".$query_suffix,
				$event_id,
				$threshold
			);
		}
		else {
			return db_QueryFetchPair(
				"SELECT id, theme 
				FROM ".SH_TABLE_PREFIX.SH_TABLE_THEME_IDEA." 
				WHERE node=?".$query_suffix,
				$event_id
			);
		}
	}
}

function themeIdea_GetTopScoring( $event_id, $count) {
	return db_QueryFetch(
		"SELECT id, node, theme, score 
		FROM ".SH_TABLE_PREFIX.SH_TABLE_THEME_IDEA." 
		WHERE node=? 
		ORDER BY score DESC
		LIMIT ?;",
		$event_id,
		$count
	);
}

/// Ideas are considered original if they have no parent
function themeIdea_GetOriginal( $event_id, $user_id = 0, $threshold = null, $query_suffix = ";" ) {
	if ( $user_id ) {
		return db_QueryFetchPair(
			"SELECT id, theme 
			FROM ".SH_TABLE_PREFIX.SH_TABLE_THEME_IDEA." 
			WHERE node=? AND user=? AND parent=0".$query_suffix,
			$event_id
		);
	}
	else {
		if ( isset($threshold) ) {
			return db_QueryFetchPair(
				"SELECT id, theme 
				FROM ".SH_TABLE_PREFIX.SH_TABLE_THEME_IDEA." 
				WHERE node=? AND parent=0 AND score>=?".$query_suffix,
				$event_id,
				$threshold
			);
		}
		else {
			return db_QueryFetchPair(
				"SELECT id, theme 
				FROM ".SH_TABLE_PREFIX.SH_TABLE_THEME_IDEA." 
				WHERE node=? AND parent=0".$query_suffix,
				$event_id
			);
		}
	}
}

/// Get everything; This will be rarely used, but is included for completenes
function themeIdea_GetAll( $user_id = 0, $threshold = null, $query_suffix = ";" ) {
	if ( $user_id ) {
		return db_QueryFetchPair(
			"SELECT id, theme 
			FROM ".SH_TABLE_PREFIX.SH_TABLE_THEME_IDEA." 
			WHERE user=?".$query_suffix,
			$user_id
		);
	}
	else {
		if ( isset($threshold) ) {
			return db_QueryFetchPair(
				"SELECT id, theme 
				FROM ".SH_TABLE_PREFIX.SH_TABLE_THEME_IDEA." 
				WHERE score>=?".$query_suffix,
				$threshold
			);
		}
		else {
			return db_QueryFetchPair(
				"SELECT id, theme 
				FROM ".SH_TABLE_PREFIX.SH_TABLE_THEME_IDEA.$query_suffix
			);
		}
	}
}

/// Not the most useful data, but again, included for completeness
function themeIdea_GetAllOriginal( $user_id = 0, $threshold = null, $query_suffix = ";" ) {
	if ( $user_id ) {
		return db_QueryFetchPair(
			"SELECT id, theme 
			FROM ".SH_TABLE_PREFIX.SH_TABLE_THEME_IDEA." 
			WHERE user=? AND parent=0".$query_suffix,
			$user_id
		);
	}
	else {
		if ( isset($threshold) ) {
			return db_QueryFetchPair(
				"SELECT id, theme 
				FROM ".SH_TABLE_PREFIX.SH_TABLE_THEME_IDEA." 
				WHERE parent=0 AND score>=?".$query_suffix,
				$threshold
			);
		}
		else {
			return db_QueryFetchPair(
				"SELECT id, theme 
				FROM ".SH_TABLE_PREFIX.SH_TABLE_THEME_IDEA."
				WHERE parent=0".$query_suffix
			);
		}
	}
}

// *** //

function themeIdea_Count( $event_id, $user_id = 0, $threshold = null, $query_suffix = ";" ) {
	if ( $user_id ) {
		return db_QueryFetchValue(
			"SELECT count(id) FROM ".SH_TABLE_PREFIX.SH_TABLE_THEME_IDEA." 
			WHERE node=? AND user=?
			LIMIT 1".$query_suffix,
			$event_id, 
			$user_id
		);
	}
	else {
		if ( isset($threshold) ) {
			return db_QueryFetchValue(
				"SELECT count(id) FROM ".SH_TABLE_PREFIX.SH_TABLE_THEME_IDEA." 
				WHERE node=? AND score>=?
				LIMIT 1".$query_suffix,
				$event_id, 
				$threshold
			);
		}
		else {
			return db_QueryFetchValue(
				"SELECT count(id) FROM ".SH_TABLE_PREFIX.SH_TABLE_THEME_IDEA." 
				WHERE node=?
				LIMIT 1".$query_suffix,
				$event_id
			);
		}
	}
}

function themeIdea_CheckExisting( $event_id = 0, $user_id = 0, $theme = "" ) {
	return db_QueryFetchValue(
		"SELECT count(id)
		FROM ".SH_TABLE_PREFIX.SH_TABLE_THEME_IDEA."
		WHERE node=? AND user=? AND theme=?
		LIMIT 1",
		$event_id,
		$user_id,
		$theme
	) > 0;
}

function themeIdea_CountOriginal( $event_id, $user_id = 0, $threshold = null, $query_suffix = ";" ) {
	if ( $user_id ) {
		return db_QueryFetchValue(
			"SELECT count(id) 
			FROM ".SH_TABLE_PREFIX.SH_TABLE_THEME_IDEA." 
			WHERE node=? AND parent=0 AND user=?
			LIMIT 1".$query_suffix,
			$event_id, 
			$user_id
		);
	}
	else {
		if ( isset($threshold) ) {
			return db_QueryFetchValue(
				"SELECT count(id) 
				FROM ".SH_TABLE_PREFIX.SH_TABLE_THEME_IDEA." 
				WHERE node=? AND parent=0 AND score>=?
				LIMIT 1".$query_suffix,
				$event_id, 
				$threshold
			);
		}
		else {
			return db_QueryFetchValue(
				"SELECT count(id) 
				FROM ".SH_TABLE_PREFIX.SH_TABLE_THEME_IDEA." 
				WHERE node=? AND parent=0
				LIMIT 1".$query_suffix,
				$event_id
			);
		}
	}
}


function themeIdea_CountAll( $user_id = 0, $threshold = null, $query_suffix = ";" ) {
	if ( $user_id ) {
		return db_QueryFetchValue(
			"SELECT count(id) 
			FROM ".SH_TABLE_PREFIX.SH_TABLE_THEME_IDEA." 
			WHERE user=?
			LIMIT 1".$query_suffix,
			$user_id
		);
	}
	else {
		if ( isset($threshold) ) {
			return db_QueryFetchValue(
				"SELECT count(id) 
				FROM ".SH_TABLE_PREFIX.SH_TABLE_THEME_IDEA." 
				WHERE score>=?
				LIMIT 1".$query_suffix,
				$threshold
			);
		}
		else {
			return db_QueryFetchValue(
				"SELECT count(id)
				FROM ".SH_TABLE_PREFIX.SH_TABLE_THEME_IDEA." 
				LIMIT 1".$query_suffix
			);
		}
	}
}

/// Not entirely accurate, as the originality assignment is per-event, not globally
function themeIdea_CountAllOriginal( $user_id = 0, $threshold = null, $query_suffix = ";" ) {
	if ( $user_id ) {
		return db_QueryFetchValue(
			"SELECT count(id) 
			FROM ".SH_TABLE_PREFIX.SH_TABLE_THEME_IDEA." 
			WHERE user=? AND parent=0
			LIMIT 1".$query_suffix,
			$user_id
		);
	}
	else {
		if ( isset($threshold) ) {
			return db_QueryFetchValue(
				"SELECT count(id) 
				FROM ".SH_TABLE_PREFIX.SH_TABLE_THEME_IDEA." 
				WHERE score>=? AND parent=0
				LIMIT 1".$query_suffix,
				$threshold
			);
		}
		else {
			return db_QueryFetchValue(
				"SELECT count(id) 
				FROM ".SH_TABLE_PREFIX.SH_TABLE_THEME_IDEA."
				WHERE parent=0
				LIMIT 1".$query_suffix
			);
		}
	}
}

// *** //

function themeIdea_CountUsers( $event_id, $query_suffix = ";" ) {
	return db_QueryFetchValue(
		"SELECT count(DISTINCT user)
		FROM ".SH_TABLE_PREFIX.SH_TABLE_THEME_IDEA." 
		WHERE node=?
		LIMIT 1".$query_suffix,
		$event_id
	);
}

// *** //

// Like themeIdea_Get, but returns a more detailed result
function themeIdea_GetDetail( $event_id, $user_id = 0, $threshold = null, $query_suffix = ";" ) {
	if ( $user_id ) {
		return db_QueryFetch(
			"SELECT id, theme, parent, user, score, ".DB_FIELD_DATE('timestamp')."
			FROM ".SH_TABLE_PREFIX.SH_TABLE_THEME_IDEA." 
			WHERE node=? AND user=?".$query_suffix,
			$event_id, 
			$user_id
		);
	}
	else {
		if ( isset($threshold) ) {
			return db_QueryFetch(
				"SELECT id, theme, parent, user, score, ".DB_FIELD_DATE('timestamp')."
				FROM ".SH_TABLE_PREFIX.SH_TABLE_THEME_IDEA." 
				WHERE node=? AND score>=?".$query_suffix,
				$event_id,
				$threshold
			);
		}
		else {
			return db_QueryFetch(
				"SELECT id, theme, parent, user, score, ".DB_FIELD_DATE('timestamp')."
				FROM ".SH_TABLE_PREFIX.SH_TABLE_THEME_IDEA." 
				WHERE node=?".$query_suffix,
				$event_id
			);
		}
	}
}

// *** //

function themeIdea_GetOther( $event_id, $user_id = 0, $threshold = null, $query_suffix = ";" ) {
	if ( $user_id ) {
		return db_QueryFetchPair(
			"SELECT id, theme 
			FROM ".SH_TABLE_PREFIX.SH_TABLE_THEME_IDEA." 
			WHERE node!=? AND user=?".$query_suffix,
			$event_id, 
			$user_id
		);
	}
	else {
		if ( isset($threshold) ) {
			return db_QueryFetchPair(
				"SELECT id, theme 
				FROM ".SH_TABLE_PREFIX.SH_TABLE_THEME_IDEA." 
				WHERE node!=? AND score>=?".$query_suffix,
				$event_id,
				$threshold
			);
		}
		else {
			return db_QueryFetchPair(
				"SELECT id,theme 
				FROM ".SH_TABLE_PREFIX.SH_TABLE_THEME_IDEA." 
				WHERE node!=?".$query_suffix,
				$event_id
			);
		}
	}
}

/// You shouldn't use this, but it is here; It's slow, and will give duplicates
function _themeIdea_GetRandom( $event_id, $threshold = null, $query_suffix = ";" ) {
	if ( isset($threshold) ) {
		return db_QueryFetchPair(
			"SELECT id, theme 
			FROM ".SH_TABLE_PREFIX.SH_TABLE_THEME_IDEA." 
			WHERE node=? AND parent=0 AND score>=?
			ORDER BY rand() LIMIT 1".$query_suffix,
			$event_id,
			$threshold
		);
	}
	else {
		return db_QueryFetchPair(
			"SELECT id, theme 
			FROM ".SH_TABLE_PREFIX.SH_TABLE_THEME_IDEA." 
			WHERE node=? AND parent=0
			ORDER BY rand() LIMIT 1".$query_suffix,
			$event_id
		);		
	}
}

function themeIdea_Add( $idea, $event_id, $user_id, $limit = null ) {
	global $db;

	_db_Connect();	// Only because we're doing native DB ops, call connect //
	
	$db->begin_transaction();
	
	$count = 0;
	
	try {
		if ( isset($limit) ) {
			$count = themeIdea_Count($event_id, $user_id, " FOR UPDATE;");
			if ( $count === false ) 
				throw new Exception();
			if ( $count >= $limit ) 
				throw new Exception();
		}

		// Check for a possible duplicate
		if ( themeIdea_CheckExisting($event_id, $user_id, $idea) ) {
			throw new Exception();
		}
		
		$result = db_QueryInsert(
			"INSERT INTO ".SH_TABLE_PREFIX.SH_TABLE_THEME_IDEA." (
				theme, node, user, timestamp
			)
			VALUES ( 
				?, ?, ?, NOW()
			)",
			$idea, 
			$event_id, 
			$user_id
		);
		if ( empty($result) ) 
			throw new Exception();

		if ( isset($limit) ) {
			$count = themeIdea_Count($event_id, $user_id);
			if ( $count === false ) 
				throw new Exception();
			if ( $count > $limit ) 
				throw new Exception();
		}
		
		// We're good! Commit! We're finished //
		$db->commit();
		return [
			"id" => $result, 
			"count" => $count
		];
	}
	catch (Exception $ex) {
		// Bad! Do a rollback! //
		$db->rollback();
		return [
			"id" => 0,
			"count" => $count
		];
	}
}

function themeIdea_Remove( $id, $user_id = 0 ) {
	if ( $user_id === 0 ) {
		return db_QueryDelete(
			"DELETE FROM ".SH_TABLE_PREFIX.SH_TABLE_THEME_IDEA." WHERE id=?;",
			$id
		);
	}
	else {
		return db_QueryDelete(
			"DELETE FROM ".SH_TABLE_PREFIX.SH_TABLE_THEME_IDEA." WHERE id=? AND user=?;",
			$id,$user_id
		);
	}
}

// *** //

function themeIdea_SetParent( $id, $event_id ) {
	return db_QueryUpdate(
		"UPDATE ".SH_TABLE_PREFIX.SH_TABLE_THEME_IDEA."
		SET
			parent=?
		WHERE
			id=?;",
		$event_id, $id
	);
}

function themeIdea_SetScore( $id, $score ) {
	return db_QueryUpdate(
		"UPDATE ".SH_TABLE_PREFIX.SH_TABLE_THEME_IDEA."
		SET
			score=?
		WHERE
			id=?;",
		$score, $id
	);
}

function themeIdea_SetTheme( $id, $idea ) {
	return db_QueryUpdate(
		"UPDATE ".SH_TABLE_PREFIX.SH_TABLE_THEME_IDEA."
		SET
			idea=?
		WHERE
			id=?;",
		$idea, $id
	);
}

// *** //

function themeIdea_GetStats( $event_id ) {
	return db_QueryFetchFirst(
		"SELECT COUNT(id) AS ideas, COUNT(DISTINCT user) AS users
		FROM ".SH_TABLE_PREFIX.SH_TABLE_THEME_IDEA." 
		WHERE node=?;",
		$event_id
	);
}

