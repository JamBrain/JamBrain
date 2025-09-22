<?php
require_once __DIR__."/node.php";

// TEXT: 2^16 characters (65535)
// TINYINT UNSIGNED: 0-255

const DB_TYPE_NODE_BODY = 'MEDIUMTEXT NOT NULL';	// MEDIUMTEXT: 2^24 characters
const DB_TYPE_NODE_SCOPE = 'TINYINT NOT NULL';
const DB_TYPE_NODE_META_VALUE = 'TEXT NOT NULL';
const DB_TYPE_NODE_LINK_VALUE = 'TEXT DEFAULT NULL';
const DB_TYPE_NODE_SCORE = 'DOUBLE NOT NULL';

// Simliar to the regular NODE, but just a snapshot
// IMPORTANT: This has to come first, as with the node table, we need to make nodes
// TODO: author here should be who made the change, irregardless of who it is credited to
$table = 'SH_TABLE_NODE_VERSION';
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
				type ".DB_TYPE_ASCII(24).",
				subtype ".DB_TYPE_ASCII(24).",
				subsubtype ".DB_TYPE_ASCII(24).",
				timestamp ".DB_TYPE_TIMESTAMP.",
				slug ".DB_TYPE_ASCII(96).",
					INDEX(slug),
				name ".DB_TYPE_UNICODE(96).",
				body ".DB_TYPE_NODE_BODY.",
				tag ".DB_TYPE_ASCII(32)."
			)".DB_CREATE_SUFFIX);
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

$table = 'SH_TABLE_NODE';
if ( in_array($table, $TABLE_LIST) ) {
	$ok = null;

	table_Init($table);
	switch ( $TABLE_VERSION ) {
	case 0:
		$ok = table_Create( $table,
			"CREATE TABLE ".SH_TABLE_PREFIX.constant($table)." (
				id ".DB_TYPE_UID.",
				parent ".DB_TYPE_ID.",
					INDEX(parent),
				author ".DB_TYPE_ID.",
				type ".DB_TYPE_ASCII(24).",
					INDEX(type),
				subtype ".DB_TYPE_ASCII(24).",
					INDEX(subtype),
				subsubtype ".DB_TYPE_ASCII(24).",
					INDEX(subsubtype),
				published ".DB_TYPE_TIMESTAMP.",
					INDEX(published),
				created ".DB_TYPE_TIMESTAMP.",
				modified ".DB_TYPE_TIMESTAMP.",
				version ".DB_TYPE_ID.",
				slug ".DB_TYPE_ASCII(96).",
					INDEX(slug),
					UNIQUE parent_slug (parent,slug),
				name ".DB_TYPE_UNICODE(96).",
				body ".DB_TYPE_NODE_BODY."
			)".DB_CREATE_SUFFIX);
		$created = true;
		if (!$ok) break; $TABLE_VERSION++;
	case 1:
		$ok = table_Update( $table,
			"ALTER TABLE ".SH_TABLE_PREFIX.constant($table)."
				ADD COLUMN superparent ".DB_TYPE_ID."
					AFTER parent;"
			);
		if (!$ok) break; $TABLE_VERSION++;
	case 2:
		$ok = table_Update( $table,
			"ALTER TABLE ".SH_TABLE_PREFIX.constant($table)."
				ADD INDEX superparent (superparent);"
			);
		if (!$ok) break; $TABLE_VERSION++;
	case 3:
		// Rename superparent to _superparent. NOTE: had to use CHANGE because old MariaDB version
		$ok = table_Update( $table,
			"ALTER TABLE ".SH_TABLE_PREFIX.constant($table)."
				CHANGE COLUMN `superparent` `_superparent` ".DB_TYPE_ID.";"
			);
				//RENAME COLUMN `superparent` TO `_superparent`;"
		if (!$ok) break; $TABLE_VERSION++;
	case 4:
		$ok = table_Update( $table,
			"ALTER TABLE ".SH_TABLE_PREFIX.constant($table)."
				ADD COLUMN _trust ".DB_TYPE_TRUST."
					AFTER modified;"
			);
		if (!$ok) break; $TABLE_VERSION++;
	case 5:
		$ok = table_Update( $table,
			"ALTER TABLE ".SH_TABLE_PREFIX.constant($table)."
				ADD INDEX stable_published (published, id);
			ALTER TABLE ".SH_TABLE_PREFIX.constant($table)."
				ADD INDEX stable_modified (modified, id);"
			);
		if (!$ok) break; $TABLE_VERSION++;
	};

	// NOTE: Store "extra" in body for symlinks
	// MK: What does this actually mean? What's an extra?

	// Generate Nodes
	if ( isset($created) ) {
		// Create necessary nodes
		$root = MakeKeyNode('SH_NODE_ID_ROOT', 0, SH_NODE_TYPE_ROOT, '', '', 'root', '' );
		$users = MakeKeyNode('SH_NODE_ID_USERS', $root, SH_NODE_TYPE_USERS, '', '', 'users', 'Users' );
	}
	table_Exit($table);
}


$table = 'SH_TABLE_NODE_META_VERSION';
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
				scope ".DB_TYPE_NODE_SCOPE.",
				`key` ".DB_TYPE_ASCII(32).",
				`value` ".DB_TYPE_NODE_META_VALUE.",
				timestamp ".DB_TYPE_TIMESTAMP."
			)".DB_CREATE_SUFFIX);
		if (!$ok) break; $TABLE_VERSION++;
	case 1:
		$ok = table_Update( $table,
			"ALTER TABLE ".SH_TABLE_PREFIX.constant($table)."
				ADD INDEX scope (scope);"
			);
		if (!$ok) break; $TABLE_VERSION++;
	case 2:
		$ok = table_Update( $table,
			"ALTER TABLE ".SH_TABLE_PREFIX.constant($table)."
				ADD INDEX `key` (`key`);"
			);
		if (!$ok) break; $TABLE_VERSION++;
		
	// *** This was formerly SH_TABLE_NODE_META. As of now it's SH_TABLE_NODE_META_VERSION *** //
	
	case 3:
		// NOTE: RENAME isn't supported in older MariaDB. You need to use CHANGE instead.
		$ok = table_Update( $table,
			"ALTER TABLE ".SH_TABLE_PREFIX.constant($table)."
				CHANGE `node` `a` ".DB_TYPE_ID.";"
			);
			// Rename 'node' to 'a'
		if (!$ok) break; $TABLE_VERSION++;
	case 4:
		$ok = table_Update( $table,
			"ALTER TABLE ".SH_TABLE_PREFIX.constant($table)."
				ADD COLUMN b ".DB_TYPE_ID."
					AFTER a;"
			);
			// Add the 'b' column 
		if (!$ok) break; $TABLE_VERSION++;
	case 5:
		$ok = table_Update( $table,
			"ALTER TABLE ".SH_TABLE_PREFIX.constant($table)."
				DROP INDEX node;"
			);
			// remove the old 'node' index (MariaDB can't rename indexes)
		if (!$ok) break; $TABLE_VERSION++;
	case 6:
		$ok = table_Update( $table,
			"ALTER TABLE ".SH_TABLE_PREFIX.constant($table)."
				ADD INDEX a (a);"
			);
			// Add a new index for `a` (MariaDB can't rename indexes)
		if (!$ok) break; $TABLE_VERSION++;
	case 7:
		$ok = table_Update( $table,
			"ALTER TABLE ".SH_TABLE_PREFIX.constant($table)."
				ADD INDEX b (b);"
			);
			// Index the new 'b' column
		if (!$ok) break; $TABLE_VERSION++;
	case 8:
		$ok = table_Update( $table,
			"ALTER TABLE ".SH_TABLE_PREFIX.constant($table)."
				MODIFY COLUMN timestamp ".DB_TYPE_TIMESTAMP."
					AFTER b;"
			);
			// Move timestamp after b
		if (!$ok) break; $TABLE_VERSION++;
	case 9:
		$ok = table_Update( $table,
			"ALTER TABLE ".SH_TABLE_PREFIX.constant($table)."
				MODIFY COLUMN `key` ".DB_TYPE_ASCII(31).";"
			);
			// Make `key` 31 characters instead of 32 (scope+key = 1+31 bytes)
		if (!$ok) break; $TABLE_VERSION++;
	case 10:
		$ok = table_Update( $table,
			"ALTER TABLE ".SH_TABLE_PREFIX.constant($table)."
				MODIFY COLUMN `value` ".DB_TYPE_NODE_LINK_VALUE.";"
			);
			// Allow null `value`
		if (!$ok) break; $TABLE_VERSION++;
	case 11:
		// LDJAM specific change. Rather than a separate migration script, just do it here.
		$ok = table_Update( $table,
			"UPDATE ".SH_TABLE_PREFIX.constant($table)."
				SET `key`='event-mode' WHERE `key`='theme-mode';"
			);
		if (!$ok) break; $TABLE_VERSION++;
	case 12:
		// Add an author column to track who what user to credit for making a change
		$ok = table_Update( $table,
			"ALTER TABLE ".SH_TABLE_PREFIX.constant($table)."
				ADD COLUMN author ".DB_TYPE_ID."
					AFTER id;"
			);
		if (!$ok) break; $TABLE_VERSION++;
	};
	table_Exit($table);
}


$table = 'SH_TABLE_NODE_META';
if ( in_array($table, $TABLE_LIST) ) {
	$ok = null;
	
	table_Init($table);
	switch ( $TABLE_VERSION ) {
	case 0:
		$ok = table_Create( $table,
			"CREATE TABLE ".SH_TABLE_PREFIX.constant($table)." (
				id ".DB_TYPE_UID.",
				a ".DB_TYPE_ID.",
					INDEX(a),
				b ".DB_TYPE_ID.",
					INDEX(b),
				timestamp ".DB_TYPE_TIMESTAMP.",
				version ".DB_TYPE_ID.",
				scope ".DB_TYPE_NODE_SCOPE.",
					INDEX(scope),
				`key` ".DB_TYPE_ASCII(31).",
					INDEX(`key`),
				`value` ".DB_TYPE_NODE_LINK_VALUE."
			)".DB_CREATE_SUFFIX);
		if (!$ok) break; $TABLE_VERSION++;
	case 1:
		// NOTE: `value` cannot be indexed, since it is not a VARCHAR
		// NOTE: `scope` needs to be indexed, so we can do >= 0 check
		$ok = table_Update( $table,
			"ALTER TABLE ".SH_TABLE_PREFIX.constant($table)."
				ADD UNIQUE `a_b_key` (`a`, `b`, `key`);"
			);
		if (!$ok) break; $TABLE_VERSION++;
	case 2:
		// LDJAM specific change. Rather than a separate migration script, just do it here.
		$ok = table_Update( $table,
			"UPDATE ".SH_TABLE_PREFIX.constant($table)."
				SET `key`='event-mode' WHERE `key`='theme-mode';"
			);
		if (!$ok) break; $TABLE_VERSION++;
	};
	table_Exit($table);
}


$table = 'SH_TABLE_NODE_LINK';
if ( in_array($table, $TABLE_LIST) ) {
	$ok = null;

	table_Init($table);
	switch ( $TABLE_VERSION ) {
	case 0:
		$ok = table_Create( $table,
			"CREATE TABLE ".SH_TABLE_PREFIX.constant($table)." (
				id ".DB_TYPE_UID.",
				a ".DB_TYPE_ID.",
					INDEX(a),
				b ".DB_TYPE_ID.",
					INDEX(b),
				scope ".DB_TYPE_NODE_SCOPE.",
				`key` ".DB_TYPE_ASCII(32).",
					INDEX(`key`),
				`value` ".DB_TYPE_NODE_LINK_VALUE.",
				timestamp ".DB_TYPE_TIMESTAMP."
			)".DB_CREATE_SUFFIX);
		if (!$ok) break; $TABLE_VERSION++;
	case 1:
		$ok = table_Update( $table,
			"ALTER TABLE ".SH_TABLE_PREFIX.constant($table)."
				ADD INDEX scope (scope);"
			);
		if (!$ok) break; $TABLE_VERSION++;

		// NOTE: `value` cannot be indexed, since it is not a VARCHAR
	case 2:
		// This table is obsolete, as the data was merged into META
		$ok = table_Update( $table,
			"DROP TABLE ".SH_TABLE_PREFIX.constant($table).";");
		if (!$ok) break; $TABLE_VERSION++;
	};
	table_Exit($table);
}


/*
$table = 'SH_TABLE_NODE_SEARCH';
if ( in_array($table, $TABLE_LIST) ) {
	$ok = null;
	
	// Use ID only, but manually mirror what's in NODE (unique)?

	table_Init($table);
	switch ( $TABLE_VERSION ) {
	case 0:
		$ok = table_Create( $table,
			"CREATE TABLE ".SH_TABLE_PREFIX.constant($table)." (
				id ".DB_TYPE_UID.",
				node ".DB_TYPE_ID.",
				body MEDIUMTEXT NOT NULL,
					FULLTEXT KEY(node, body)
			)".DB_CREATE_SUFFIX);
		if (!$ok) break; $TABLE_VERSION++;
	};
	table_Exit($table);
}
*/

$table = 'SH_TABLE_NODE_LOVE';
if ( in_array($table, $TABLE_LIST) ) {
	$ok = null;
	
	// NODE: What is love(d), baby don't hurt me
	// AUTHOR: Who loves it
	// IP: IP address of who loves it (if anonymous)
	
	table_Init($table);
	switch ( $TABLE_VERSION ) {
	case 0:
		$ok = table_Create( $table,
			"CREATE TABLE ".SH_TABLE_PREFIX.constant($table)." (
				id ".DB_TYPE_UID.",
				node ".DB_TYPE_ID.",
					INDEX(node),
				author ".DB_TYPE_ID.",
				ip ".DB_TYPE_IP.",
					UNIQUE(author,ip),
				timestamp ".DB_TYPE_TIMESTAMP."
			)".DB_CREATE_SUFFIX);
		if (!$ok) break; $TABLE_VERSION++;
	case 1:
		$ok = table_Update( $table,
			"ALTER TABLE ".SH_TABLE_PREFIX.constant($table)."
				DROP INDEX author;"
			);
		if (!$ok) break; $TABLE_VERSION++;
	case 2:
		$ok = table_Update( $table,
			"ALTER TABLE ".SH_TABLE_PREFIX.constant($table)."
				ADD UNIQUE `node_author_ip` (`node`, `author`, `ip`);"
			);
		if (!$ok) break; $TABLE_VERSION++;
	};
	table_Exit($table);
}

//$table = 'SH_TABLE_NODE_STAR';
//if ( in_array($table, $TABLE_LIST) ) {
//	$ok = null;
//	
//	// AUTHOR: whom likes the thing
//	// NODE: what they like
//	
//	table_Init($table);
//	switch ( $TABLE_VERSION ) {
//	case 0:
//		$ok = table_Create( $table,
//			"CREATE TABLE ".SH_TABLE_PREFIX.constant($table)." (
//				id ".DB_TYPE_UID.",
//				author ".DB_TYPE_ID.",
//					INDEX(author),
//				node ".DB_TYPE_ID.",
//					INDEX(node),
//				timestamp ".DB_TYPE_TIMESTAMP."
//			)".DB_CREATE_SUFFIX);
//		if (!$ok) break; $TABLE_VERSION++;
//	};
//	table_Exit($table);
//}


$table = 'SH_TABLE_NODE_MAGIC';
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
				parent ".DB_TYPE_ID.",
					INDEX(parent),
				superparent ".DB_TYPE_ID.",
					INDEX(superparent),
				author ".DB_TYPE_ID.",
					INDEX(author),
				score ".DB_TYPE_NODE_SCORE.",
					INDEX(score),
				timestamp ".DB_TYPE_TIMESTAMP.",
					INDEX(timestamp),
				name ".DB_TYPE_ASCII(24).",
					INDEX(name),
					UNIQUE `node_name` (node, name)
			)".DB_CREATE_SUFFIX);
		if (!$ok) break; $TABLE_VERSION++;
	case 1:
		$ok = table_Update( $table,
			"ALTER TABLE ".SH_TABLE_PREFIX.constant($table)."
				CHANGE COLUMN `superparent` `_superparent` ".DB_TYPE_ID.";"
			);
				//RENAME COLUMN `superparent` TO `_superparent`;"
		if (!$ok) break; $TABLE_VERSION++;
	case 2:
		$ok = table_Update( $table,
			"ALTER TABLE ".SH_TABLE_PREFIX.constant($table)."
				CHANGE COLUMN `score` `value` ".DB_TYPE_NODE_SCORE." AFTER `name`;"
			);
		if (!$ok) break; $TABLE_VERSION++;
	case 3:
		$ok = table_Update( $table,
			"ALTER TABLE ".SH_TABLE_PREFIX.constant($table)."
				CHANGE COLUMN `parent` `_parent` ".DB_TYPE_ID.";"
			);
		if (!$ok) break; $TABLE_VERSION++;
	case 4:
		$ok = table_Update( $table,
			"ALTER TABLE ".SH_TABLE_PREFIX.constant($table)."
				CHANGE COLUMN `author` `_author` ".DB_TYPE_ID.";"
			);
		if (!$ok) break; $TABLE_VERSION++;
	};
	table_Exit($table);
}
