<?php
require_once __DIR__."/perfstats.php";


// Notification table record is a small discrete event that a user should be notified about.
// Usually this will be a reference to a comment on a user's node or a node where that user has commented.
// It can also be due to a game link error, or a post by a user you are following, or other notifications we decide to add in the future.
$table = 'SH_TABLE_PERFSTATS';
if ( in_array($table, $TABLE_LIST) ) {
	$ok = null;

	table_Init($table);
	switch ( $TABLE_VERSION ) {
	case 0:
		$ok = table_Create( $table,
			"CREATE TABLE ".SH_TABLE_PREFIX.constant($table)." (
				id ".DB_TYPE_UID.",
				apiname ".DB_TYPE_ASCII(64).",
				periodend ".DB_TYPE_TIMESTAMP.",
				periodduration ".DB_TYPE_INT32.",	
				count ".DB_TYPE_INT32.",
				avg ".DB_TYPE_FLOAT64.",
				p0 ".DB_TYPE_FLOAT64.",
				p10 ".DB_TYPE_FLOAT64.",
				p20 ".DB_TYPE_FLOAT64.",
				p30 ".DB_TYPE_FLOAT64.",
				p40 ".DB_TYPE_FLOAT64.",
				p50 ".DB_TYPE_FLOAT64.",
				p60 ".DB_TYPE_FLOAT64.",
				p70 ".DB_TYPE_FLOAT64.",
				p80 ".DB_TYPE_FLOAT64.",
				p90 ".DB_TYPE_FLOAT64.",
				p95 ".DB_TYPE_FLOAT64.",
				p98 ".DB_TYPE_FLOAT64.",
				p100 ".DB_TYPE_FLOAT64."
			)".DB_CREATE_SUFFIX);
		$created = true;
		if (!$ok) break; $TABLE_VERSION++;

	};

	table_Exit($table);
}

