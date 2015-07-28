<?php
/**
 * Schedule
 *
 * @file
 */
 
require_once __DIR__ . "/../db.php";

// NOTE: None of these functions sanitize. Make sure you sanitize your input! //

$SCHEDULE_SCHEMA = [
	'id' => CMW_FIELD_TYPE_INT,
	'parent' => CMW_FIELD_TYPE_INT,

	'start' => CMW_FIELD_TYPE_DATETIME,
	'end' => CMW_FIELD_TYPE_DATETIME,
	
	'extra' => CMW_FIELD_TYPE_JSON,
];


function schedule_AddSubscription( $user, $timespan ) {
	db_Connect();

	db_Query(
		"INSERT `" . CMW_TABLE_SCHEDULE_SUBSCRIPTION . "` (".
			"`user`,".
			"`timespan`".
		") ".
		"VALUES (" .
			intval($user) . "," .
			intval($timespan) . "" .
		");");
		
	// TODO: do something on db_query error

	return db_GetId();
}

function schedule_Add( $start, $end, $name, $extra = null, $type = "", $subtype = "", $parent = 0, $priority = 0.0, $author = 0 ) {
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
		"INSERT `" . CMW_TABLE_SCHEDULE_TIMESPAN . "` (".
			"`parent`,".
			"`priority`,".
			"`author`,".
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
			intval($author) . "," .
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

function schedule_SetExtra( $id, $extra = null ) {
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
		"UPDATE `" . CMW_TABLE_SCHEDULE_TIMESPAN . "`" .
		" SET " .
			"`extra`=\"".db_EscapeString($json)."\"" .
		" WHERE " .
		"`id`=".intval($id).";");
		
	// TODO: do something on db_query error

	return db_GetId();
}

// Optionally specify how many seconds to fuzz the result. Useful for caching.
// Positive values mean push the range. A fuzz of 60 means events that 
//	start in a minute, or ended a minute ago will be included.
// Negative values to to pull the range. A fuzz of -60 means events that
//  started less than a minute ago will be ignored, more than a minute
//  ago will be included, end in less than a minute will be ignored, etc.
function schedule_GetActiveIds( $fuzz = 0 ) {
	db_Connect();

	$fuzz = intval($fuzz);
//	$args = [ time()+$fuzz, time()-$fuzz ];
//
//	$items = db_FetchSingle(
//		"SELECT `id` FROM `" . CMW_TABLE_SCHEDULE_TIMESPAN . "` WHERE ".
//			"`start` <= DATE_ADD(NOW(),INTERVAL ".$fuzz." SECOND) AND " .
//			"`end` >= DATE_SUB(NOW(),INTERVAL ".$fuzz." SECOND) " .
//		";", CMW_FIELD_TYPE_INT);

	$items = db_FetchSingle(
		"SELECT `id` FROM `" . CMW_TABLE_SCHEDULE_TIMESPAN . "` WHERE ".
			"`start` <= DATE_ADD(NOW(),INTERVAL ".$fuzz." SECOND) AND " .
			"`end` >= DATE_SUB(NOW(),INTERVAL ".$fuzz." SECOND) " .
		";", CMW_FIELD_TYPE_INT);
	
	return $items;		
}

function schedule_GetActiveParentsByIds( $fuzz = 0 ) {
	global $SCHEDULE_SCHEMA;

	db_Connect();

	$fuzz = intval($fuzz);

	$items = db_Fetch(
		"SELECT `id`,`parent` FROM `" . CMW_TABLE_SCHEDULE_TIMESPAN . "` WHERE ".
			"`start` <= DATE_ADD(NOW(),INTERVAL ".$fuzz." SECOND) AND " .
			"`end` >= DATE_SUB(NOW(),INTERVAL ".$fuzz." SECOND) " .
		";", $SCHEDULE_SCHEMA);
	
	$ret = [];

	foreach( $items as &$item ) {
		$ret[$item['id']] = $item['parent'];
	}
	
	return $ret;		
}

function schedule_GetByIds( $ids ) {
	global $SCHEDULE_SCHEMA;
	$ret = [];

	db_Connect();

	$id_count = count($ids);

	if ( $id_count === 1 ) {
		$items = db_Fetch(
			"SELECT * FROM `" . CMW_TABLE_SCHEDULE_TIMESPAN . "` WHERE ".
				"`id`=" . array_pop($ids) .
				" LIMIT 1" .
			";", $SCHEDULE_SCHEMA);
	}
	else {
		$items = db_Fetch(
			"SELECT * FROM `" . CMW_TABLE_SCHEDULE_TIMESPAN . "` WHERE ".
				"`id` in (" . implode(',',$ids) . ")" .
			";", $SCHEDULE_SCHEMA);
	}

	
	// Resort using the Id as the key //
	foreach( $items as &$item ) {
		$id = &$item['id'];
		$ret[$id] = &$item;
	}

	return $ret;
}


function schedule_GetFamilyByIds( $ids ) {
	global $SCHEDULE_SCHEMA;
	$ret = [];

	db_Connect();

	$id_count = count($ids);

	if ( $id_count === 1 ) {
		if ( is_array($ids) )
			$id = array_pop($ids);
		else
			$id = $ids;
		
		$items = db_Fetch(
			"SELECT * FROM `" . CMW_TABLE_SCHEDULE_TIMESPAN . "` WHERE ".
				"`id`=" . $id .
				" OR `parent`=" . $id .
			";", $SCHEDULE_SCHEMA);
	}
	else {
		$id_string = implode(',',$ids);
		$items = db_Fetch(
			"SELECT * FROM `" . CMW_TABLE_SCHEDULE_TIMESPAN . "` WHERE ".
				"`id` in (" . $id_string . ")" .
				" OR `parent` in (" . $id_string . ")" .
			";", $SCHEDULE_SCHEMA);
	}

	// Resort using the Id as the key //
	foreach( $items as &$item ) {
		$id = &$item['id'];
		$ret[$id] = &$item;
	}

	return $ret;
}


function schedule_GetSubscriptionsByUserIds( $ids ) {
	if ( is_array($ids) ) {
		$id_string = implode(',',$ids);
	}
	else {
		$id_string = "".$ids;
	}
	
	$items = db_FetchSingle(
		"SELECT `timespan` FROM `" . CMW_TABLE_SCHEDULE_SUBSCRIPTION . "` WHERE ".
			"`user` in (" . $id_string . ")" .
		";", CMW_FIELD_TYPE_INT);

	return $items;
}


?>
