<?php

require_once __DIR__."/../node/node.php";


const MAX_MENTIONS_TO_NOTIFY = 50;

const NOTIFY_ON_NODE_TYPE = [
	'post',
	'item'
];

// Users are being referenced by user node ID.
function notification_Add( $user, $node, $comment, $type ) {
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
		$node, $comment,
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
		$comment = intval($n['note']);
		$node = intval($n['node']);
		$type = str_replace("'","''",$n['type']); // Note string originates from website code, not user data.
		$values[] = "($user, $node, $comment, '$type', NOW())";
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
		"SELECT id, node, note, type, ".DB_FIELD_DATE('created')."
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
		"SELECT id, node, note, type, ".DB_FIELD_DATE('created')."
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

function notification_EnabledForNodeType( $type ) {
	return in_array($type, NOTIFY_ON_NODE_TYPE);
}

function notification_AddForPublishedNode( $node, $author, $type, $mentions = [] ) {
	if ( notification_EnabledForNodeType($type) ) {
		// Identify users following the author and push notifications.
		$notifications = [];
		// "Following" is a "star" link between a=user id, and b=starred node id. Find the stars on the author's node.
		// Unfortunately, this gets both the people who have starred the author, as well as the author's starred nodes. We'll filter them out.
		$starlinks = nodeMeta_GetByKeyNode('star', $author);
		$starusers = [];
		foreach($starlinks as $star) {
			if( $star['b'] == $author ) {
				$starusers[] = $star['a']; // Notify this user
			}
		}

		$starusers = array_diff($starusers, $mentions);
		foreach($starusers as $user)
		{
			$notifications[] = ['user' => $user, 'node' => $node, 'note' => 0, 'type' => $type];
		}
		foreach($mentions as $user)
		{
			if ( $user == $author ) {
				continue; // don't inform author that they mentioned themselves. That would be silly.
			}
			$notifications[] = ['user' => $user, 'node' => $node, 'note' => 0, 'type' => SH_NOTIFICATION_MENTION];
		}

		notification_AddMultiple($notifications);
	}
}

function notification_GetSubscribers( $node_id ) {
	$subs = notification_GetAllSubscriptionsForNode($node_id);
	$optin = [];
	$optout = [];
	foreach ( $subs as $sub ) {
		if ( $sub['subscribed'] ) {
			$optin[] = $sub['user'];
		}
		else {
			$optout[] = $sub['user'];
		}
	}
	return ['optin' => $optin, 'optout' => $optout];
}

function notification_AddForComment( $node_id, $comment, $author, $mentions = [] ) {
	// Look up the users who participated in this thread and send them notifications, except for the author.
	$base_notify = comment_InterestedUsers($node_id);
	$nodeauthor = node_GetAuthor($node_id);

	// Find other authors linked to this node.
	// Allow the link to be in either direction, Currently website adds author links as <game node>, <user id>
	// No need to add all authors to users though since they will get feedback type instead of note
	$feedback_notify = nodeMeta_GetAuthors($node_id);
	if ($nodeauthor) {
		$feedback_notify[] = $nodeauthor;
	}
	$feedback_notify = array_unique($feedback_notify);

	// Look up what users have expressly opted in and out of notifications for this thread.
	$subscriptions = notification_GetSubscribers($node_id);

	// Add users that are opting in to notifications
	$base_notify = array_merge($base_notify, $subscriptions['optin']);
	// Eliminate duplicate users - don't send duplicate notifications.
	$base_notify = array_unique($base_notify);
	// Remove users that opt-out of notifications
	$base_notify = array_diff($base_notify, $subscriptions['optout']);
	// Supersede normal notifications with "mention" notifications if the user was at-mentioned
	$base_notify = array_diff($base_notify, $mentions);

	// Supersede feedback with "mention" notifications if the user was at-mentioned
	$feedback_notify = array_diff($feedback_notify, $mentions);
	// Remove users who have opted out
	$feedback_notify = array_diff($feedback_notify, $subscriptions['optout']);
	// Supersede normal notifications with feedback notifications if the user was a (co)=author
	$base_notify = array_diff($base_notify, $feedback_notify);

	$notifications = [];
	foreach($base_notify as $uid)	{
		if ( $uid == $author )
			continue; // Don't bother sending the author of the note a notification for their own note.

		$notifications[] = ['user' => $uid, 'node' => $node_id, 'note' => $comment, 'type' => SH_NOTIFICATION_NOTE];
	}
	foreach($mentions as $uid)	{
		if ( $uid == $author )
			continue; // Don't bother sending the author of the note a notification for their own note.

		$notifications[] = ['user' => $uid, 'node' => $node_id, 'note' => $comment, 'type' => SH_NOTIFICATION_MENTION];
	}
	foreach($feedback_notify as $uid)	{
		if ( $uid == $author )
			continue; // Don't bother sending the author of the note a notification for their own note.

		$notifications[] = ['user' => $uid, 'node' => $node_id, 'note' => $comment, 'type' => SH_NOTIFICATION_FEEDBACK];
	}

	notification_AddMultiple($notifications);
}

function notification_AddForEdit($node, $comment, $author, $mentions = []) {

	$notifications = [];
	foreach($mentions as $uid)	{
		if ( $uid == $author )
			continue; // Don't bother sending the author of the comment a notification for their own comment.

		$notifications[] = ['user' => $uid, 'node' => $node, 'note' => $comment, 'type' => SH_NOTIFICATION_MENTION];
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
	return nodeMeta_AddOrphan($node, 0, SH_SCOPE_SERVER, 'last_read_notification', $notification);
}

/// @retval List of author IDs for any at-mentions in the text (or new at-mentions in the edited text.)
function notification_GetMentionedUsers($text, $previoustext = null) {
	$mentioned = notification_AtTokens($text);
	if ( $previoustext ) {
		$remove = notification_AtTokens($previoustext);
		$mentioned = array_diff($mentioned, $remove);
	}

	if ( count($mentioned) == 0 ) {
		return [];
	}

	// Limit the number of mentions that will actually work.
	if ( count($mentioned) > MAX_MENTIONS_TO_NOTIFY ) {
		$mentioned = array_chunk($mentioned, MAX_MENTIONS_TO_NOTIFY)[0];
	}

	// Resolve mentioned user slugs to user node IDs, if possible.
	$idmap = node_GetUserIdBySlug($mentioned);

	return array_values($idmap);
}

// Find the list of at-tokens in the specified text. Return the slugs without the at-s
// We'll define an at-token as [start of string or non-sluggable-character] [@] [string of sluggable characters]
function notification_AtTokens($text) {
	$text = strip_tags($text);
	$text = strtolower($text);
	if ( preg_match_all("/(?:^|[^a-z0-9_.\-])@([a-z0-9_.\-]+)/", $text, $matches) ) {
		return array_unique($matches[1]);
	}
	return [];
}

