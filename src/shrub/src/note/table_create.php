<?php
require_once __DIR__."/note.php";

const DB_TYPE_NOTE_BODY = 'MEDIUMTEXT NOT NULL';	// MEDIUMTEXT: 2^24 characters
const DB_TYPE_NOTE_SCOPE = 'TINYINT NOT NULL';
/*
// Simliar to the regular NOTE, but just a snapshot
// IMPORTANT: This has to come first, just in case the NOTE table needs to make notes
$table = 'SH_TABLE_NOTE_VERSION';
if ( in_array($table, $TABLE_LIST) ) {
	$ok = null;

	table_Init($table);
	switch ( $TABLE_VERSION ) {
	case 0:
		// NOTES:
		// - author is the author of the version, not the author of the note
	
		$ok = table_Create( $table,
			"CREATE TABLE ".SH_TABLE_PREFIX.constant($table)." (
				id ".DB_TYPE_UID.",
				note ".DB_TYPE_ID.",
					INDEX(note),
				author ".DB_TYPE_ID.",
				timestamp ".DB_TYPE_TIMESTAMP.",
				body ".DB_TYPE_NOTE_BODY.",
				tag ".DB_TYPE_ASCII(32)."
			)".DB_CREATE_SUFFIX);
		if (!$ok) break; $TABLE_VERSION++;
	};
	table_Exit($table);
}

$table = 'SH_TABLE_NOTE';
if ( in_array($table, $TABLE_LIST) ) {
	$ok = null;

	table_Init($table);
	switch ( $TABLE_VERSION ) {
	case 0:
		$ok = table_Create( $table,
			"CREATE TABLE ".SH_TABLE_PREFIX.constant($table)." (
				id ".DB_TYPE_UID.",
				node ".DB_TYPE_ID.",
					INDEX(node),
				author ".DB_TYPE_ID.",
				published ".DB_TYPE_TIMESTAMP.",
					INDEX(published),
				created ".DB_TYPE_TIMESTAMP.",
				modified ".DB_TYPE_TIMESTAMP.",
				version ".DB_TYPE_ID.",
				body ".DB_TYPE_NODE_BODY."
			)".DB_CREATE_SUFFIX);
		$created = true;
		if (!$ok) break; $TABLE_VERSION++;
	};

	table_Exit($table);
}
*/
