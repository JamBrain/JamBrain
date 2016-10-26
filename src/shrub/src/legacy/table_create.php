<?php

$table = 'SH_TABLE_LEGACY_USER';
if ( in_array(constant($table), $TABLE_LIST) ) {
	$ok = null;

	table_Init($table);
	switch ( $TABLE_VERSION ) {
	case 0:
		$ok = table_Create( $table,
			"CREATE TABLE ".SH_TABLE_PREFIX.constant($table)." (
				id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT 
					UNIQUE,
				slug VARCHAR(64) CHARSET latin1 NOT NULL DEFAULT '',
					INDEX(slug),
				mail VARCHAR(64) NOT NULL DEFAULT '',
					INDEX(mail),
				user_id BIGINT UNSIGNED NOT NULL,
				joined DATETIME NOT NULL
			)".DB_CREATE_SUFFIX);
		if (!$ok) break; $TABLE_VERSION++;
	};
	table_Exit($table);
}
