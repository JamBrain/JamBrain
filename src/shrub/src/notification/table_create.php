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
				created ".DB_TYPE_TIMESTAMP.",
			)".DB_CREATE_SUFFIX);
		$created = true;
		if (!$ok) break; $TABLE_VERSION++;
	case 1:
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

