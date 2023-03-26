<?php
require_once __DIR__."/comment.php";

const DB_TYPE_COMMENT_BODY = 'MEDIUMTEXT NOT NULL';		// MEDIUMTEXT: 2^24 characters
const DB_TYPE_COMMENT_HOPS = 'INT NOT NULL';			// INT: 2^16 signed (32k)

// Simliar to the regular COMMENT, but just a snapshot
// IMPORTANT: This has to come first, just in case the COMMENT table needs to make comments
// TODO: author here should be who made the change, irregardless of who it is credited to
$table = 'SH_TABLE_NOTE_VERSION';
$new_table = 'SH_TABLE_COMMENT_VERSION';
if ( in_array($table, $TABLE_LIST) && in_array($new_table, $TABLE_LIST) ) {
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
	case 2:
		$ok = table_Update( $table,
			"ALTER TABLE ".SH_TABLE_PREFIX.constant($table)."
				CHANGE COLUMN note comment ".DB_TYPE_ID.";"
			);
		if (!$ok) break; $TABLE_VERSION++;
	case 3:
		$ok = table_Update( $table,
			"RENAME TABLE ".SH_TABLE_PREFIX.constant($table)." TO ".SH_TABLE_PREFIX.constant($new_table).";"
			);
		if (!$ok) break; $TABLE_VERSION++;
	};
	// IMPORTANT! DO NOT ADD ANY MORE STEPS HERE! THE TABLE WAS RENAMED! ADD THEM BELOW!
	table_Exit($table);
}
$table = 'SH_TABLE_COMMENT_VERSION';
if ( in_array($table, $TABLE_LIST) && (global_GetInt('SH_TABLE_NOTE_VERSION') == 3+1) ) {
	$ok = null;

	table_Init($table);
	switch ( $TABLE_VERSION ) {
	case 0:
		$ok = table_Query( $table,
			"SELECT * from ".SH_TABLE_PREFIX.constant($table)." LIMIT 1;");
		if (!$ok) break; $TABLE_VERSION++;
	case 1:
		// Rename tag to detail
		$ok = table_Update( $table,
			"ALTER TABLE ".SH_TABLE_PREFIX.constant($table)."
				CHANGE COLUMN `tag` `detail` ".DB_TYPE_ASCII(32).";"
			);
		if (!$ok) break; $TABLE_VERSION++;
	};
	table_Exit($table);
}


$table = 'SH_TABLE_NOTE_TREE';
$new_table = 'SH_TABLE_COMMENT_TREE';
if ( in_array($table, $TABLE_LIST) && in_array($new_table, $TABLE_LIST) ) {
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
	case 1:
		$ok = table_Update( $table,
			"ALTER TABLE ".SH_TABLE_PREFIX.constant($table)."
				CHANGE COLUMN `note` `comment` ".DB_TYPE_ID.";"
			);
		if (!$ok) break; $TABLE_VERSION++;
	case 2:
		$ok = table_Update( $table,
			"RENAME TABLE ".SH_TABLE_PREFIX.constant($table)." TO ".SH_TABLE_PREFIX.constant($new_table).";"
			);
		if (!$ok) break; $TABLE_VERSION++;
	};
	// IMPORTANT! DO NOT ADD ANY MORE STEPS HERE! THE TABLE WAS RENAMED! ADD THEM BELOW!
	table_Exit($table);
}
$table = 'SH_TABLE_COMMENT_TREE';
if ( in_array($table, $TABLE_LIST) && (global_GetInt('SH_TABLE_NOTE_TREE') == 2+1) ) {
	$ok = null;

	table_Init($table);
	switch ( $TABLE_VERSION ) {
	case 0:
		$ok = table_Query( $table,
			"SELECT * from ".SH_TABLE_PREFIX.constant($table)." LIMIT 1;");
		if (!$ok) break; $TABLE_VERSION++;
	case 1:
		$ok = table_Update( $table,
			"ALTER TABLE ".SH_TABLE_PREFIX.constant($table)."
				CHANGE COLUMN `node` `_node` ".DB_TYPE_ID.";"
			);
		if (!$ok) break; $TABLE_VERSION++;
	};
	table_Exit($table);
}


$table = 'SH_TABLE_NOTE';
$new_table = 'SH_TABLE_COMMENT';
if ( in_array($table, $TABLE_LIST) && in_array($new_table, $TABLE_LIST) ) {
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
	case 5:
		$ok = table_Update( $table,
			"RENAME TABLE ".SH_TABLE_PREFIX.constant($table)." TO ".SH_TABLE_PREFIX.constant($new_table).";"
			);
		if (!$ok) break; $TABLE_VERSION++;
	};
	// IMPORTANT! DO NOT ADD ANY MORE STEPS HERE! THE TABLE WAS RENAMED! ADD THEM BELOW!
	table_Exit($table);
}
$table = 'SH_TABLE_COMMENT';
if ( in_array($table, $TABLE_LIST) && (global_GetInt('SH_TABLE_NOTE') == 5+1) ) {
	$ok = null;

	table_Init($table);
	switch ( $TABLE_VERSION ) {
	case 0:
		$ok = table_Query( $table,
			"SELECT * from ".SH_TABLE_PREFIX.constant($table)." LIMIT 1;");
		if (!$ok) break; $TABLE_VERSION++;
	case 1:
		$ok = table_Update( $table,
			"ALTER TABLE ".SH_TABLE_PREFIX.constant($table)."
				CHANGE COLUMN `supernode` `_supernode` ".DB_TYPE_ID.";"
			);
		if (!$ok) break; $TABLE_VERSION++;
	};
	table_Exit($table);
}


$table = 'SH_TABLE_NOTE_LOVE';
$new_table = 'SH_TABLE_COMMENT_LOVE';
if ( in_array($table, $TABLE_LIST) && in_array($new_table, $TABLE_LIST) ) {
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
	case 7:
		$ok = table_Update( $table,
			"ALTER TABLE ".SH_TABLE_PREFIX.constant($table)."
				CHANGE COLUMN note comment ".DB_TYPE_ID.";"
			);
		if (!$ok) break; $TABLE_VERSION++;
	case 8:
		$ok = table_Update( $table,
			"RENAME TABLE ".SH_TABLE_PREFIX.constant($table)." TO ".SH_TABLE_PREFIX.constant($new_table).";"
			);
		if (!$ok) break; $TABLE_VERSION++;
	};
	// IMPORTANT! DO NOT ADD ANY MORE STEPS HERE! THE TABLE WAS RENAMED! ADD THEM BELOW!
	table_Exit($table);
}
$table = 'SH_TABLE_COMMENT_LOVE';
if ( in_array($table, $TABLE_LIST) && (global_GetInt('SH_TABLE_NOTE_LOVE') == 8+1) ) {
	$ok = null;

	table_Init($table);
	switch ( $TABLE_VERSION ) {
	case 0:
		$ok = table_Query( $table,
			"SELECT * from ".SH_TABLE_PREFIX.constant($table)." LIMIT 1;");
		if (!$ok) break; $TABLE_VERSION++;
	case 1:
		// supernode is redundant (stored only for performance), hence the underscore
		$ok = table_Update( $table,
			"ALTER TABLE ".SH_TABLE_PREFIX.constant($table)."
				CHANGE COLUMN `supernode` `_supernode` ".DB_TYPE_ID.";"
			);
		if (!$ok) break; $TABLE_VERSION++;
	case 2:
		// node is redundant data (hence the underscore)
		$ok = table_Update( $table,
			"ALTER TABLE ".SH_TABLE_PREFIX.constant($table)."
				CHANGE COLUMN `authornode` `_authorcomment` ".DB_TYPE_ID.";"
			);
		if (!$ok) break; $TABLE_VERSION++;
	case 3:
		// node is redundant data (hence the underscore)
		$ok = table_Update( $table,
			"ALTER TABLE ".SH_TABLE_PREFIX.constant($table)."
				CHANGE COLUMN `node` `_node` ".DB_TYPE_ID.";"
			);
		if (!$ok) break; $TABLE_VERSION++;
	};
	table_Exit($table);
}
