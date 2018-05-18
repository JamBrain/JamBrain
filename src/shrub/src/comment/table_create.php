<?php
require_once __DIR__."/comment.php";

const DB_TYPE_COMMENT_BODY = 'MEDIUMTEXT NOT NULL';		// MEDIUMTEXT: 2^24 characters
const DB_TYPE_COMMENT_HOPS = 'INT NOT NULL';			// INT: 2^16 signed (32k)

// Simliar to the regular COMMENT, but just a snapshot
// IMPORTANT: This has to come first, just in case the COMMENT table needs to make comments
$table = 'SH_TABLE_NOTE_VERSION';
if ( in_array($table, $TABLE_LIST) ) {
	$ok = null;

	table_Init($table);
	switch ( $TABLE_VERSION ) {
	case 0:
		// NOTES:
		// - author is the author of the version, not the author of the comment

		$ok = table_Create( $table,
			"CREATE TABLE ".SH_TABLE_PREFIX.constant($table)." (
				id ".DB_TYPE_UID.",
				note ".DB_TYPE_ID.",
					INDEX(note),
				author ".DB_TYPE_ID.",
				timestamp ".DB_TYPE_TIMESTAMP.",
				body ".DB_TYPE_COMMENT_BODY.",
				tag ".DB_TYPE_ASCII(32)."
			)".DB_CREATE_SUFFIX);
		$created = true;
		if (!$ok) break; $TABLE_VERSION++;
	case 1:
		$ok = table_Update( $table,
			"ALTER TABLE ".SH_TABLE_PREFIX.constant($table)."
				ADD COLUMN flags ".DB_TYPE_INT32."
					AFTER timestamp;"
			);
		if (!$ok) break; $TABLE_VERSION++;
	};
	table_Exit($table);
}

$table = 'SH_TABLE_NOTE_TREE';
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
				note ".DB_TYPE_ID.",
					INDEX(note),
				ancestor ".DB_TYPE_ID.",
					INDEX(ancestor),
				hops ".DB_TYPE_COMMENT_HOPS.",
					INDEX(hops)
			)".DB_CREATE_SUFFIX);
		$created = true;
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
		// No "published" date, just modified, as comments aren't drafted

		$ok = table_Create( $table,
			"CREATE TABLE ".SH_TABLE_PREFIX.constant($table)." (
				id ".DB_TYPE_UID.",
				node ".DB_TYPE_ID.",
					INDEX(node),
				author ".DB_TYPE_ID.",
					INDEX(author),
				created ".DB_TYPE_TIMESTAMP.",
				modified ".DB_TYPE_TIMESTAMP.",
					INDEX(modified),
				version ".DB_TYPE_ID.",
				body ".DB_TYPE_COMMENT_BODY."
			)".DB_CREATE_SUFFIX);
		$created = true;
		if (!$ok) break; $TABLE_VERSION++;
	case 1:
		$ok = table_Update( $table,
			"ALTER TABLE ".SH_TABLE_PREFIX.constant($table)."
				ADD COLUMN supernode ".DB_TYPE_ID."
					AFTER node;"
			);
		if (!$ok) break; $TABLE_VERSION++;
	case 2:
		$ok = table_Update( $table,
			"ALTER TABLE ".SH_TABLE_PREFIX.constant($table)."
				ADD INDEX supernode (supernode);"
			);
		if (!$ok) break; $TABLE_VERSION++;
	case 3:
		$ok = table_Update( $table,
			"ALTER TABLE ".SH_TABLE_PREFIX.constant($table)."
				ADD COLUMN parent ".DB_TYPE_ID."
					AFTER id;"
			);
		if (!$ok) break; $TABLE_VERSION++;
	case 4:
		$ok = table_Update( $table,
			"ALTER TABLE ".SH_TABLE_PREFIX.constant($table)."
				ADD COLUMN flags ".DB_TYPE_INT32."
					AFTER version;"
			);
		if (!$ok) break; $TABLE_VERSION++;
	};

	table_Exit($table);
}

$table = 'SH_TABLE_NOTE_LOVE';
if ( in_array($table, $TABLE_LIST) ) {
	$ok = null;

	// NOTE: What is love(d), baby don't hurt me
	// AUTHOR: Who loves it
	// IP: IP address of who loves it (if anonymous)

	table_Init($table);
	switch ( $TABLE_VERSION ) {
	case 0:
		$ok = table_Create( $table,
			"CREATE TABLE ".SH_TABLE_PREFIX.constant($table)." (
				id ".DB_TYPE_UID.",
				note ".DB_TYPE_ID.",
					INDEX(note),
				author ".DB_TYPE_ID.",
				ip ".DB_TYPE_IP.",
					UNIQUE `node_author_ip` (note, author, ip),
				timestamp ".DB_TYPE_TIMESTAMP."
			)".DB_CREATE_SUFFIX);
		$created = true;
		if (!$ok) break; $TABLE_VERSION++;
	case 1:
		$ok = table_Update( $table,
			"ALTER TABLE ".SH_TABLE_PREFIX.constant($table)."
				ADD COLUMN node ".DB_TYPE_ID."
					AFTER note;"
			);
		if (!$ok) break; $TABLE_VERSION++;
	case 2:
		$ok = table_Update( $table,
			"ALTER TABLE ".SH_TABLE_PREFIX.constant($table)."
				ADD INDEX node (node);"
			);
		if (!$ok) break; $TABLE_VERSION++;
	case 3:
		$ok = table_Update( $table,
			"ALTER TABLE ".SH_TABLE_PREFIX.constant($table)."
				ADD COLUMN supernode ".DB_TYPE_ID."
					AFTER node;"
			);
		if (!$ok) break; $TABLE_VERSION++;
	case 4:
		$ok = table_Update( $table,
			"ALTER TABLE ".SH_TABLE_PREFIX.constant($table)."
				ADD INDEX supernode (supernode);"
			);
		if (!$ok) break; $TABLE_VERSION++;
	case 5:
		$ok = table_Update( $table,
			"ALTER TABLE ".SH_TABLE_PREFIX.constant($table)."
				ADD COLUMN authornode ".DB_TYPE_ID."
					AFTER supernode;"
			);
		if (!$ok) break; $TABLE_VERSION++;
	case 6:
		$ok = table_Update( $table,
			"ALTER TABLE ".SH_TABLE_PREFIX.constant($table)."
				ADD INDEX authornode (authornode);"
			);
		if (!$ok) break; $TABLE_VERSION++;
	};
	table_Exit($table);
}

