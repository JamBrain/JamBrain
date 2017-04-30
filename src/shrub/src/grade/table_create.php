<?php
require_once __DIR__."/grade.php";

const DB_TYPE_GRADE_VALUE = 'INT NOT NULL';

$table = 'SH_TABLE_GRADE';
if ( in_array($table, $TABLE_LIST) ) {
	$ok = null;

	table_Init($table);
	switch ( $TABLE_VERSION ) {
	case 0:
		// Data here is 64bit aligned, with 32bit aligned data at the end
		$ok = table_Create( $table,
			"CREATE TABLE ".SH_TABLE_PREFIX.constant($table)." (
				id ".DB_TYPE_UID.",
				node ".DB_TYPE_ID.",
					INDEX(node),
				author ".DB_TYPE_ID.",
					INDEX(author),
				timestamp ".DB_TYPE_TIMESTAMP.",
				name ".DB_TYPE_ASCII(24).",
					INDEX(name),
					UNIQUE `node_author_name` (node, author, name),
				value ".DB_TYPE_GRADE_VALUE."
			)".DB_CREATE_SUFFIX);
		$created = true;
		if (!$ok) break; $TABLE_VERSION++;
	};

	table_Exit($table);
}
