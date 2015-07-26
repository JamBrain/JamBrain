<?php
/**
 * Schedule
 *
 * @file
 */
 
require_once __DIR__ . "/../db.php";

// NOTE: None of these functions sanitize. Make sure you sanitize your input! //

function schedule_Add( $start, $end, $name, $extra = [], $type = "", $parent = 0, $priority = 0.0 ) {
	db_Connect();
	
	// Turn EXTRA in to a JSON string //
	if ($extra === null) {
		$json = "{}";
	}
	else {
		$json = json_encode($extra);
		if ( empty($json) )
			return null;
	}
	
	$json = db_EscapeString($json);

	db_Query(
		"INSERT IGNORE `" . CMW_TABLE_SCHEDULE . "` (".
			"`parent`,".
			"`priority`,".
			"`type`,".
			"`start`,".
			"`end`,".
			"`name`,".
			"`extra`".
		") ".
		"VALUES (" .
			intval($parent) . "," .
			floatval($priority) . "," .
			"\"".$type . "\"," .
			"\"".$start . "\"," .
			"\"".$end . "\"," .
			"\"".$name . "\"," .
			"\"".$json . "\"" .
		");");
		
	// TODO: do something on db_query error

	return !empty(db_AffectedRows());
}


?>
