<?php

$table = 'SH_TABLE_GLOBAL';
if ( in_array(constant($table), $TABLE_LIST) ) {
	$ok = null;

	table_Init($table);
	switch ( $TABLE_VERSION ) {
	case 0:
		echo "Creating Table...\n";
		$ok = table_Create( $table,
			"CREATE TABLE ".SH_TABLE_PREFIX.constant($table)." (
				id ".DB_TYPE_UID.",
				`key` VARCHAR(64) ".DB_TYPE_ASCII." DEFAULT '',
					INDEX(`key`),
				`value` VARCHAR(128) ".DB_TYPE_UNICODE." DEFAULT '',
				`timestamp` ".DB_TYPE_TIMESTAMP."
			)".DB_CREATE_SUFFIX);
		if (!$ok) break; $TABLE_VERSION++;
	case 1:
		$ok = table_Nop( $table );
		if (!$ok) break; $TABLE_VERSION++;
	};
	
	// Because this is Global, we do a few more things //
	$global_default = array_merge($SH_GLOBAL_DEFAULT, array_fill_keys(global_GetTableConstants(), '0'));
	
	// Add elements found in the defaults that don't exist yet //
	$global_diff = array_diff_key($global_default,$SH);
	$global_diff_count = count($global_diff);
	if ( $global_diff_count > 0 ) {
		print "Adding ".$global_diff_count." missing element(s) to ".$table."\n";
		
		foreach ( $global_diff as $key => $value ) {
			print "  * ".$key." = ".(is_string($value)?("\"".$value."\"\n"):($value."\n"));
			global_Set($key, $value);
		}
	}
	
	// Report what elements exist but aren't found in the defaults
	$global_diff = array_diff_key($SH,$global_default);
	$global_diff_count = count($global_diff);
	if ( $global_diff_count > 0 ) {
		print "NOTE: There are ".$global_diff_count." extra element(s) found. These may require manual removal\n";
		
		foreach ( $global_diff as $key => $value ) {
			print "  * ".$key." = ".(is_string($value)?("\"".$value."\"\n"):($value."\n"));
		}
	}

	// Set the version now (AFTER the initial value stored in globals is set) //
	table_Exit($table);
}
