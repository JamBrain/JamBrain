<?php

$table = 'SH_TABLE_CONFIG';
if ( in_array(constant($table), $TABLE_LIST) ) {
	$ok = true;

	table_Init($table);
	switch ( $TABLE_VERSION ) {
	case 0:
		echo "Creating Table...\n";
		$ok = table_Create( $table,
			"CREATE TABLE ".SH_TABLE_PREFIX.constant($table)." (
				id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT 
					UNIQUE,
				`key` VARCHAR(64) CHARSET latin1 NOT NULL DEFAULT '',
					INDEX(`key`),
				`value` VARCHAR(128) NOT NULL DEFAULT '',
				`timestamp` DATETIME NOT NULL
			)".DB_CREATE_SUFFIX);
		if (!$ok) break; $TABLE_VERSION++;
	case 1:
		$ok = table_Nop( $table );
		if (!$ok) break; $TABLE_VERSION++;
	};
	
	// Because this is Config, we do a few more things //
	$config_default = array_merge($SH_CONFIG_DEFAULT, array_fill_keys(config_GetTableConstants(), '0'));
	
	// Add elements found in the defaults that don't exist yet //
	$config_diff = array_diff_key($config_default,$SH_CONFIG);
	$config_diff_count = count($config_diff);
	if ( $config_diff_count > 0 ) {
		print "Adding ".$config_diff_count." missing element(s) to ".$table."\n";
		
		foreach ( $config_diff as $key => $value ) {
			print "  * ".$key." = ".(is_string($value)?("\"".$value."\"\n"):($value."\n"));
			config_Set($key,$value);
		}
	}
	
	// Report what elements exist but aren't found in the defaults
	$config_diff = array_diff_key($SH_CONFIG,$config_default);
	$config_diff_count = count($config_diff);
	if ( $config_diff_count > 0 ) {
		print "NOTE: There are ".$config_diff_count." extra element(s) found. These may require manual removal\n";
		
		foreach ( $config_diff as $key => $value ) {
			print "  * ".$key." = ".(is_string($value)?("\"".$value."\"\n"):($value."\n"));
		}
	}

	// Set the version now (AFTER the initial value stored in config is set) //
	table_Exit($table);
}
