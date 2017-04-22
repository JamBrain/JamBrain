<?php
require_once __DIR__."/asset.php";

const DB_TYPE_ASSET_META = 'TEXT NOT NULL';	// TEXT: 2^16 characters

$table = 'SH_TABLE_ASSET';
if ( in_array($table, $TABLE_LIST) ) {
	$ok = null;

	table_Init($table);
	switch ( $TABLE_VERSION ) {
	case 0:
		$ok = table_Create( $table,
			"CREATE TABLE ".SH_TABLE_PREFIX.constant($table)." (
				id ".DB_TYPE_UID.",
				author ".DB_TYPE_ID.",
					INDEX(author),
				type ".DB_TYPE_ASCII(24).",
				mime ".DB_TYPE_ASCII(24).",
				size ".DB_TYPE_ID.",
				timestamp ".DB_TYPE_TIMESTAMP.",
				meta ".DB_TYPE_ASSET_META."
			)".DB_CREATE_SUFFIX);
		$created = true;
		if (!$ok) break; $TABLE_VERSION++;
	};

	table_Exit($table);
}
