<?php

// *** //

$table = 'SH_TABLE_THEME_IDEA';
if ( in_array(constant($table), $TABLE_LIST) ) {
	$ok = null;

	table_Init($table);
	switch ( $TABLE_VERSION ) {
	case 0:
		$ok = table_Create( $table,
			"CREATE TABLE ".SH_TABLE_PREFIX.constant($table)." (
				id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT 
					UNIQUE,
				node BIGINT UNSIGNED NOT NULL,
					INDEX(node),
				parent BIGINT UNSIGNED NOT NULL,
					INDEX(parent),
				user BIGINT UNSIGNED NOT NULL,
					INDEX(user),
				theme VARCHAR(64) NOT NULL,
				`timestamp` DATETIME NOT NULL,
				score DOUBLE NOT NULL,
					INDEX(score)
			)".DB_CREATE_SUFFIX);
		if (!$ok) break; $TABLE_VERSION++;
//	case 1:
//		$ok = table_Update( $table,
//			"ALTER TABLE ".SH_TABLE_PREFIX.constant($table)."
//				ADD COLUMN parent BIGINT UNSIGNED NOT NULL,
//				ADD INDEX (parent)
//			;");
//		if (!$ok) break; $TABLE_VERSION++;
//	case 2:
//		$ok = table_Update( $table,
//			"ALTER TABLE ".SH_TABLE_PREFIX.constant($table)."
//				ADD COLUMN score DOUBLE NOT NULL,
//				ADD INDEX (score)
//			;");
//		if (!$ok) break; $TABLE_VERSION++;
	};
	table_Exit($table);
}

$table = 'SH_TABLE_THEME_IDEA_VOTE';
if ( in_array(constant($table), $TABLE_LIST) ) {
	$ok = null;

	table_Init($table);
	switch ( $TABLE_VERSION ) {
	case 0:
		$ok = table_Create( $table,
			"CREATE TABLE ".SH_TABLE_PREFIX.constant($table)." (
				id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT 
					UNIQUE,
				user BIGINT UNSIGNED NOT NULL,
					INDEX(user),
				node BIGINT UNSIGNED NOT NULL,
					INDEX(node),
					UNIQUE `user_node` (user,node),
				timestamp DATETIME NOT NULL,
				value INT NOT NULL,
					INDEX(value)
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

//$table = 'SH_TABLE_THEME_STAR';
//if ( in_array(constant($table), $TABLE_LIST) ) {
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


$table = 'SH_TABLE_THEME';
if ( in_array(constant($table), $TABLE_LIST) ) {
	$ok = null;

	table_Init($table);
	switch ( $TABLE_VERSION ) {
	case 0:
		$ok = table_Create( $table,
			"CREATE TABLE ".SH_TABLE_PREFIX.constant($table)." (
				id BIGINT UNSIGNED NOT NULL
					UNIQUE,
				node BIGINT UNSIGNED NOT NULL,
					INDEX(node),
				theme VARCHAR(64) NOT NULL,
				`timestamp` DATETIME NOT NULL,
				page INT UNSIGNED NOT NULL,
				score DOUBLE NOT NULL,
					INDEX (score)
			)".DB_CREATE_SUFFIX);
		if (!$ok) break; $TABLE_VERSION++;
	};
	table_Exit($table);
}

$table = 'SH_TABLE_THEME_VOTE';
if ( in_array(constant($table), $TABLE_LIST) ) {
	$ok = null;

	table_Init($table);
	switch ( $TABLE_VERSION ) {
	case 0:
		$ok = table_Create( $table,
			"CREATE TABLE ".SH_TABLE_PREFIX.constant($table)." (
				id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT 
					UNIQUE,
				user BIGINT UNSIGNED NOT NULL,
					INDEX(user),
				node BIGINT UNSIGNED NOT NULL,
					INDEX(node),
					UNIQUE `user_node` (user,node),
				timestamp DATETIME NOT NULL,
				value INT NOT NULL,
					INDEX (value)
			)".DB_CREATE_SUFFIX);
		if (!$ok) break; $TABLE_VERSION++;
	};
	table_Exit($table);
}

// *** //

$table = 'SH_TABLE_THEME_FINAL';
if ( in_array(constant($table), $TABLE_LIST) ) {
	$ok = null;

	table_Init($table);
	switch ( $TABLE_VERSION ) {
	case 0:
		$ok = table_Create( $table,
			"CREATE TABLE ".SH_TABLE_PREFIX.constant($table)." (
				id BIGINT UNSIGNED NOT NULL
					UNIQUE,
				node BIGINT UNSIGNED NOT NULL,
					INDEX(node),
				theme VARCHAR(64) NOT NULL,
				score DOUBLE NOT NULL,
					INDEX (score)
			)".DB_CREATE_SUFFIX);
		if (!$ok) break; $TABLE_VERSION++;
	};
	table_Exit($table);
}

$table = 'SH_TABLE_THEME_FINAL_VOTE';
if ( in_array(constant($table), $TABLE_LIST) ) {
	$ok = null;

	table_Init($table);
	switch ( $TABLE_VERSION ) {
	case 0:
		$ok = table_Create( $table,
			"CREATE TABLE ".SH_TABLE_PREFIX.constant($table)." (
				id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT 
					UNIQUE,
				user BIGINT UNSIGNED NOT NULL,
					INDEX(user),
				node BIGINT UNSIGNED NOT NULL,
					INDEX(node),
					UNIQUE `user_node` (user,node),
				timestamp DATETIME NOT NULL,
				value INT NOT NULL,
					INDEX (value)
			)".DB_CREATE_SUFFIX);
		if (!$ok) break; $TABLE_VERSION++;
	};
	table_Exit($table);
}

// *** //

$table = 'SH_TABLE_THEME_HISTORY';
if ( in_array(constant($table), $TABLE_LIST) ) {
	$ok = null;

	table_Init($table);
	switch ( $TABLE_VERSION ) {
	case 0:
		$ok = table_Create( $table,
			"CREATE TABLE ".SH_TABLE_PREFIX.constant($table)." (
				id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT 
					UNIQUE,
				node BIGINT UNSIGNED NOT NULL,
				shorthand VARCHAR(20) CHARSET latin1 NOT NULL,
				name VARCHAR(64) NOT NULL,
				theme VARCHAR(64) NOT NULL
			)".DB_CREATE_SUFFIX);
		if (!$ok) break; $TABLE_VERSION++;
	};
	table_Exit($table);
}
