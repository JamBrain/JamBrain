<?php
/**
 * Schedule
 *
 * @file
 */
 
require_once __DIR__ . "/../db.php";

// NOTE: None of these functions sanitize. Make sure you sanitize your input! //

function schedule_Add( $start, $end, $name, $extra = null, $type = "", $subtype = "", $parent = 0, $priority = 0.0 ) {
	db_Connect();
	
	// Turn EXTRA in to a JSON string //
	if ( empty($extra) ) {
		$json = "";
	}
	else {
		$json = json_encode($extra);
		if ( empty($json) )
			$json = "";
	}

	db_Query(
		"INSERT IGNORE `" . CMW_TABLE_SCHEDULE . "` (".
			"`parent`,".
			"`priority`,".
			"`type`,".
			"`subtype`,".
			"`start`,".
			"`end`,".
			"`name`,".
			"`extra`".
		") ".
		"VALUES (" .
			intval($parent) . "," .
			floatval($priority) . "," .
			"\"".db_EscapeString($type)."\"," .
			"\"".db_EscapeString($subtype)."\"," .
			"\"".db_EscapeString($start)."\"," .
			"\"".db_EscapeString($end)."\"," .
			"\"".db_EscapeString($name)."\"," .
			"\"".db_EscapeString($json)."\"" .
		");");
		
	// TODO: do something on db_query error

	return db_GetId();
}


?>
