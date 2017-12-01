<?php
require_once __DIR__."/notification.php";


// Notification table record is a small discrete event that a user should be notified about.
// Usually this will be a reference to a comment on a user's node or a node where that user has commented.
// It can also be due to a game link error, or a post by a user you are following, or other notifications we decide to add in the future.
$table = 'SH_TABLE_NOTIFICATION';
if ( in_array($table, $TABLE_LIST) ) {
	$ok = null;

	table_Init($table);
	switch ( $TABLE_VERSION ) {
	case 0:
		$ok = table_Create( $table,
			"CREATE TABLE ".SH_TABLE_PREFIX.constant($table)." (
				id ".DB_TYPE_UID.",
				user ".DB_TYPE_ID.",
					INDEX(user),
				node ".DB_TYPE_ID.",
				note ".DB_TYPE_ID.",
				type ".DB_TYPE_ASCII(8).", 
				created ".DB_TYPE_TIMESTAMP."
			)".DB_CREATE_SUFFIX);
		$created = true;
		if (!$ok) break; $TABLE_VERSION++;
	case 1:
		// TODO: MK DB_TYPE_UID is an autoincrement type, and will always start at 1. This should not be necessary.
			
		// Enforce that notification IDs start at 1, rather than 0. 
		// This statement has no effect if there is already data in the table with higher id values. (according to mysql docs)
		$ok = table_Update( $table,
			"ALTER TABLE ".SH_TABLE_PREFIX.constant($table)."
				AUTO_INCREMENT = 1;"
		);
		if (!$ok) break; $TABLE_VERSION++;

	};

	table_Exit($table);
}

// Notification subscription is a table storing subscription preference for users on threads (post nodes)
// when the user takes discrete action to change subscription status.
// When no record is present, the default behavior is to treat users as subscribed if they have commented.
// The 'subscribed' value is stored in a u8, with 0 = unsubscribed, 1 = subscribed
$table = 'SH_TABLE_NOTIFICATION_SUB';
if ( in_array($table, $TABLE_LIST) ) {
	$ok = null;

	table_Init($table);
	switch ( $TABLE_VERSION ) {
	case 0:
		$ok = table_Create( $table,
			"CREATE TABLE ".SH_TABLE_PREFIX.constant($table)." (
				id ".DB_TYPE_UID.",
				user ".DB_TYPE_ID.",
				node ".DB_TYPE_ID.",
					INDEX(node),
				subscribed ".DB_TYPE_UINT8."
			)".DB_CREATE_SUFFIX);
		$created = true;
		if (!$ok) break; $TABLE_VERSION++;
	case 1:
		$ok = table_Update( $table,
			"ALTER TABLE ".SH_TABLE_PREFIX.constant($table)."
				ADD UNIQUE `user_node` (`user`, `node`);"
			);
		if (!$ok) break; $TABLE_VERSION++;		
	};

	table_Exit($table);
}
