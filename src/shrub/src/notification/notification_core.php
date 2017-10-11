<?php

require_once __DIR__."/../node/node.php";


const NOTIFY_ON_NODE_TYPE = [
	'post',
	'item'
];

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
		);",
		$user,
		$node, $note,
		$type
	);
	return $notification_id;
}

function notification_AddMultiple($notifications) {
	if( count($notifications) == 0 )
		return;
	
	$values = [];
	foreach($notifications as $n) {
		$user = intval($n['user']);
		$note = intval($n['note']);
		$node = intval($n['node']);
		$type = str_replace("'","''",$n['type']); // Note string originates from website code, not user data.
		$values[] = "($user, $node, $note, '$type', NOW())";
	}
	db_QueryInsert(
		"INSERT INTO ".SH_TABLE_PREFIX.SH_TABLE_NOTIFICATION." (
			user,
			node, note,
			type,
			created
		)
		VALUES " . implode(",",$values) . ";"
	);
	// Don't return any information as it's not very useful.
}

function notification_Max( $user ) {
	$counts = db_QueryFetchSingle(
		"SELECT max(id)
		FROM ".SH_TABLE_PREFIX.SH_TABLE_NOTIFICATION." 
		WHERE user=?;",
		$user
	);
	if ( count($counts) == 0 ) {
		return 0;
	}
	return $counts[0];
}

function notification_CountUnread( $user ) {
	$last_read = notification_GetLastReadNotification( $user );
	$counts = db_QueryFetchSingle(
		"SELECT count(*)
		FROM ".SH_TABLE_PREFIX.SH_TABLE_NOTIFICATION." 
		WHERE user=? AND id > ?;",
		$user, $last_read
	);
	return $counts[0];
}

function notification_GetUnread( $user, $limit = 20, $offset = 0 ) {
	$last_read = notification_GetLastReadNotification( $user );
	return db_QueryFetch(
		"SELECT id, node, note, type, created
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

function notification_Get( $user, $limit = 20, $offset = 0 ) {
	return db_QueryFetch(
		"SELECT id, node, note, type, created
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


function notification_AddForPublishedNode( $node, $author, $type ) {
	if ( in_array($type, NOTIFY_ON_NODE_TYPE) ) {
		// Identify users following the author and push notifications.
		$notifications = [];
		// "Following" is a "star" link between a=user id, and b=starred node id. Find the stars on the author's node.
		// Unfortunately, this gets both the people who have starred the author, as well as the author's starred nodes. We'll filter them out.
		$starlinks = nodeLink_GetByKeyNode('star', $author);
		foreach($starlinks as $star) {
			if( $star['b'] == $author ) {
				// Notify this user
				$user = $star['a'];
				$notifications[] = ['user' => $user, 'node' => $node, 'note' => 0, 'type' => $type]; 
			}
		}
		notification_AddMultiple($notifications);	
	}
}

function notification_AddForNote( $node, $note, $author ) {
	// Look up the users who participated in this thread and send them notifications, except for the author.
	$users = note_InterestedUsers($node);
	$nodeauthor = node_GetAuthor($node);
	if ( $nodeauthor ) {
		$users[] = $nodeauthor;
	}
	
	// Find other authors linked to this node.
	// Allow the link to be in either direction, Currently website adds author links as <game node>, <user id>
	$authorlinks = nodeLink_GetByKeyNode('author', $node);
	foreach($authorlinks as $link) {
		if ( $link['a'] == $node )
			$users[] = $link['b'];
		if ( $link['b'] == $node )
			$users[] = $link['a'];
	}
	
	// Eliminate duplicate users - don't send duplicate notifications.
	$users = array_unique($users);
	
	$notifications = [];
	foreach($users as $uid)	{
		if ( $uid == $author )
			continue; // Don't bother sending the author of the note a notification for their own note.
			
		$notifications[] = ['user' => $uid, 'node' => $node, 'note' => $note, 'type' => SH_NOTIFICATION_NOTE];
	}

	notification_AddMultiple($notifications);	
}


/// @retval Integer Id of highest read notification.
function notification_GetLastReadNotification( $node ) {
	// Future: Once server private meta has been added to the global user node, rework this to avoid a db lookup.

	$meta = nodeMeta_GetByKeyNode('last_read_notification',$node);
	$id = 0;
	if ( count($meta) > 0 ) {
		$id = intval($meta[0]['value']);
	}
	return $id;
}

function notification_SetLastReadNotification( $node, $notification ) {
	return nodeMeta_AddByNode($node, SH_SCOPE_SERVER, 'last_read_notification', $notification);
}

