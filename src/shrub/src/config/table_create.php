<?php
// Create/Upgrade Table //
$table = SH_TABLE_CONFIG;
if ( !isset($table_list) || isset($table_list[$table]) ) {
	DoInit($table);
	switch ($version) {
	case 0:
		$ok = DoCreate( $table,
			"CREATE TABLE ".$table." (
				id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT 
					UNIQUE,
				`key` VARCHAR(64) CHARSET latin1 NOT NULL DEFAULT '',
					INDEX(`key`),
				`value` VARCHAR(128) NOT NULL DEFAULT '',
				`timestamp` DATETIME NOT NULL
			)".DEFAULT_CS_ENGINE.";");
		if (!$ok) break; $version++; if (isset($max_version) && $version == $max_version) break;
	case 1:
		// Oops! I forgot to remove this test that bumped the version number.
		// Therefor, config actually starts at version 2
		if (!$ok) break; $version++; if (isset($max_version) && $version == $max_version) break;
	};
	DoExit($table);
	
	$DIFF_CONFIG = array_diff_key(DEFAULT_CONFIG,$CONFIG);
	$DIFF_CONFIG_COUNT = count($DIFF_CONFIG);
	if ( $DIFF_CONFIG_COUNT > 0 ) {
		print "Adding ".$DIFF_CONFIG_COUNT." missing element(s) to ".$table."\n";
		
		foreach ( $DIFF_CONFIG as $key => $value ) {
			print "  * ".$key." = ".(is_string($value)?("\"".$value."\"\n"):($value."\n"));
			config_Set($key,$value);
		}
	}
	
	$DIFF_CONFIG = array_diff_key($CONFIG,DEFAULT_CONFIG);
	$DIFF_CONFIG_COUNT = count($DIFF_CONFIG);
	if ( $DIFF_CONFIG_COUNT > 0 ) {
		print "NOTE: There are ".$DIFF_CONFIG_COUNT." element(s) not found in DEFAULT_CONFIG\n";
		
		foreach ( $DIFF_CONFIG as $key => $value ) {
			print "  * ".$key." = ".(is_string($value)?("\"".$value."\"\n"):($value."\n"));
		}
	}
}