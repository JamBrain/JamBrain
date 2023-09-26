<?php

// *** //

const DB_TYPE_THEME_PAGE = 'INT UNSIGNED NOT NULL';
const DB_TYPE_THEME_SCORE = 'DOUBLE NOT NULL';
const DB_TYPE_THEME_VOTE = 'INT NOT NULL';


// TODO: Fixme. user should be author
// TODO: Fixme. value should be vote

$table = 'SH_TABLE_THEME_IDEA';
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
				user ".DB_TYPE_ID.",
					INDEX(user),
				theme ".DB_TYPE_UNICODE(64).",
				timestamp ".DB_TYPE_TIMESTAMP.",
				score ".DB_TYPE_THEME_SCORE.",
					INDEX(score)
			)".DB_CREATE_SUFFIX);
		if (!$ok) break; $TABLE_VERSION++;
	case 1:
		$ok = table_Update( $table,
			"ALTER TABLE ".SH_TABLE_PREFIX.constant($table)."
				ALTER COLUMN parent SET DEFAULT 0
			;");
		if (!$ok) break; $TABLE_VERSION++;
	case 2:
		$ok = table_Update( $table,
			"ALTER TABLE ".SH_TABLE_PREFIX.constant($table)."
				ALTER COLUMN score SET DEFAULT 0
			;");
		if (!$ok) break; $TABLE_VERSION++;
	};
	table_Exit($table);
}

$table = 'SH_TABLE_THEME_IDEA_VOTE';
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
				idea ".DB_TYPE_ID.",
					INDEX(idea),
				author ".DB_TYPE_ID.",
					INDEX(author),
					UNIQUE `author_idea` (author, idea),
				value ".DB_TYPE_THEME_VOTE.",
					INDEX(value),
				timestamp ".DB_TYPE_TIMESTAMP."
			)".DB_CREATE_SUFFIX);
		if (!$ok) break; $TABLE_VERSION++;
//	case 1:
//		$ok = table_Update( $table,
//			"ALTER TABLE ".SH_TABLE_PREFIX.constant($table)."
//				ADD INDEX (value)
//			;");
//		if (!$ok) break; $TABLE_VERSION++;
	};
	table_Exit($table);
}

//$table = 'SH_TABLE_THEME_IDEA_COMPARE';
//if ( in_array($table, $TABLE_LIST) ) {
//	$ok = null;
//
//	table_Init($table);
//	switch ( $TABLE_VERSION ) {
//	case 0:
//		$ok = table_Create( $table,
//			"CREATE TABLE ".SH_TABLE_PREFIX.constant($table)." (
//				id ".DB_TYPE_UID.",
//				node ".DB_TYPE_ID.",
//					INDEX(node),
//				a ".DB_TYPE_ID.",
//					INDEX(a),
//				b ".DB_TYPE_ID.",
//					INDEX(b),
//				author ".DB_TYPE_ID.",
//					INDEX(author),
//					UNIQUE `author_a_b` (author, a, b),
//				value INT NOT NULL,
//					INDEX(value),
//				timestamp ".DB_TYPE_TIMESTAMP."
//			)".DB_CREATE_SUFFIX);
//		if (!$ok) break; $TABLE_VERSION++;
//	};
//	table_Exit($table);
//}

//$table = 'SH_TABLE_THEME_STAR';
//if ( in_array($table, $TABLE_LIST) ) {
//	$ok = null;
//
//	table_Init($table);
//	switch ( $TABLE_VERSION ) {
//	case 0:
//		$ok = table_Create( $table,
//			"CREATE TABLE ".SH_TABLE_PREFIX.constant($table)." (
//				id BIGINT UNSIGNED NOT NULL
//					UNIQUE,
//				node BIGINT UNSIGNED NOT NULL,
//					INDEX(node),
//				theme VARCHAR(64) NOT NULL,
//				score DOUBLE NOT NULL,
//					INDEX (score)
//			)".DB_CREATE_SUFFIX);
//		if (!$ok) break; $TABLE_VERSION++;
//	};
//	table_Exit($table);
//}

// *** //


$table = 'SH_TABLE_THEME_LIST';
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
				idea ".DB_TYPE_ID.",
				theme ".DB_TYPE_UNICODE(64).",
				page ".DB_TYPE_THEME_PAGE.",
				score ".DB_TYPE_THEME_SCORE.",
					INDEX (score),
				timestamp ".DB_TYPE_TIMESTAMP."
			)".DB_CREATE_SUFFIX);
		if (!$ok) break; $TABLE_VERSION++;
	};
	table_Exit($table);
}

$table = 'SH_TABLE_THEME_LIST_VOTE';
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
					INDEX(author),
				theme ".DB_TYPE_ID.",
					INDEX(theme),
					UNIQUE `author_theme` (author, theme),
				vote ".DB_TYPE_THEME_VOTE.",
					INDEX (vote),
				timestamp ".DB_TYPE_TIMESTAMP."
			)".DB_CREATE_SUFFIX);
		if (!$ok) break; $TABLE_VERSION++;
	};
	table_Exit($table);
}

// *** //

//$table = 'SH_TABLE_THEME_FINAL';
//if ( in_array($table, $TABLE_LIST) ) {
//	$ok = null;
//
//	table_Init($table);
//	switch ( $TABLE_VERSION ) {
//	case 0:
//		$ok = table_Create( $table,
//			"CREATE TABLE ".SH_TABLE_PREFIX.constant($table)." (
//				id ".DB_TYPE_UID.",
//				node ".DB_TYPE_ID.",
//					INDEX(node),
//				idea ".DB_TYPE_ID.",
//				theme ".DB_TYPE_UNICODE(64).",
//				score ".DB_TYPE_THEME_SCORE.",
//					INDEX (score)
//			)".DB_CREATE_SUFFIX);
//		if (!$ok) break; $TABLE_VERSION++;
//	};
//	table_Exit($table);
//}

//$table = 'SH_TABLE_THEME_FINAL_VOTE';
//if ( in_array($table, $TABLE_LIST) ) {
//	$ok = null;
//
//	table_Init($table);
//	switch ( $TABLE_VERSION ) {
//	case 0:
//		$ok = table_Create( $table,
//			"CREATE TABLE ".SH_TABLE_PREFIX.constant($table)." (
//				id ".DB_TYPE_UID.",
//				node ".DB_TYPE_ID.",
//					INDEX(node),
//				author ".DB_TYPE_ID.",
//					INDEX(author),
//					UNIQUE `author_node` (author, node),
//				value INT NOT NULL,
//					INDEX (value),
//				timestamp ".DB_TYPE_TIMESTAMP."
//			)".DB_CREATE_SUFFIX);
//		if (!$ok) break; $TABLE_VERSION++;
//	};
//	table_Exit($table);
//}

// *** //

$table = 'SH_TABLE_THEME_HISTORY';
if ( in_array($table, $TABLE_LIST) ) {
	$ok = null;

	table_Init($table);
	switch ( $TABLE_VERSION ) {
	case 0:
		$ok = table_Create( $table,
			"CREATE TABLE ".SH_TABLE_PREFIX.constant($table)." (
				id ".DB_TYPE_UID.",
				node ".DB_TYPE_ID.",
				shorthand ".DB_TYPE_ASCII(20).",
				name ".DB_TYPE_UNICODE(64).",
				theme ".DB_TYPE_UNICODE(64)."
			)".DB_CREATE_SUFFIX);
		if (!$ok) break; $TABLE_VERSION++;
	};
	table_Exit($table);
}
