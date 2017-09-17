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

}

function notification_GetUnread( $user, $limit = 20, $offset = 0 ) {
	$last_read = user_GetLastReadNotificationByNode( $user )
	
}


function notification_Get( $user, $limit = 20, $offset = 0 )
{

}