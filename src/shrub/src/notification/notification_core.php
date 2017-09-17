<?php

// Users are being referenced by user node ID.
function notification_Add( $user, $node, $note, $type ) {
	$notification_id = db_QueryInsert(
		"INSERT INTO ".SH_TABLE_PREFIX.SH_TABLE_NOTIFICATION." (
			user,
			node, note,
			type,
			created
		)
		VALUES (
			?,
			?, ?,
			?,
			NOW()
		)",
		$user,
		$node, $note,
		$type
	);
	return $notification_id;
}

function notification_CountUnread( $user ) {
	$last_read = user_GetLastReadNotificationByNode( $user );
	$counts = db_QueryFetchSingle(
		"SELECT count(*)
		FROM ".SH_TABLE_PREFIX.SH_TABLE_NOTIFICATION." 
		WHERE user=? AND id > ?;",
		$user, $last_read
	);
	return $counts[0];
}

function notification_GetUnread( $user, $limit = 20, $offset = 0 ) {
	$last_read = user_GetLastReadNotificationByNode( $user )
	return db_QueryFetch(
		"SELECT *
		FROM ".SH_TABLE_PREFIX.SH_TABLE_NOTIFICATION."
		WHERE user=? AND id > ?
		ORDER BY id DESC
		LIMIT ?
		OFFSET ?
		;",
		$user, $last_read,
		$limit,
		$offset
	);
}

function notification_Count( $user ) {
	$counts = db_QueryFetchSingle(
		"SELECT count(*)
		FROM ".SH_TABLE_PREFIX.SH_TABLE_NOTIFICATION." 
		WHERE user=?;",
		$user
	);
	return $counts[0];
}

function notification_Get( $user, $limit = 20, $offset = 0 )
{
	return db_QueryFetch(
		"SELECT *
		FROM ".SH_TABLE_PREFIX.SH_TABLE_NOTIFICATION."
		WHERE user=?
		ORDER BY id DESC
		LIMIT ?
		OFFSET ?
		;",
		$user,
		$limit,
		$offset
	);
}