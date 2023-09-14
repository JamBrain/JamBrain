<?php
require_once __DIR__."/file.php";

$table = 'SH_TABLE_FILE';
if ( in_array($table, $TABLE_LIST) ) {
	$ok = null;

	table_Init($table);
	switch ( $TABLE_VERSION ) {
	case 0:
		$ok = table_Create( $table,
			"CREATE TABLE ".SH_TABLE_PREFIX.constant($table)." (
				id ".DB_TYPE_UID.",
				author ".DB_TYPE_ID.",
                node ".DB_TYPE_ID.",
					INDEX(node),
                tag ".DB_TYPE_ID.",
				name ".DB_TYPE_ASCII(128).",
				size ".DB_TYPE_ID.",
				timestamp ".DB_TYPE_TIMESTAMP.",
                status ".DB_TYPE_UINT8."
			)".DB_CREATE_SUFFIX);
		$created = true;
		if (!$ok) break; $TABLE_VERSION++;
	case 1:
		$ok = table_Update( $table,
			"ALTER TABLE ".SH_TABLE_PREFIX.constant($table)."
				ADD COLUMN token ".DB_TYPE_ASCII(16)."
					AFTER status;"
			);
		if (!$ok) break; $TABLE_VERSION++;
	};

    // TODO: Store SHA-512 hash

    // files.jam.host/uploads/$47912/blah.zip

	table_Exit($table);
}
