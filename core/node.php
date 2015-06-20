<?php
/**
 * Node
 *
 * @file
 */
 
require_once __DIR__ . "/../db.php";

// NOTE: None of these functions sanitize. Make sure you sanitize first! //

function node_Add( $type, $slug, $name, $body, $author = 0, $parent = 0, $root = 0, $publish = false ) {
	db_Connect();

	db_Query(
		"INSERT `" . CMW_TABLE_NODE . "` (".
			"`type`,".
			"`slug`,".
			"`name`,".
			"`body`,".
			"`author`,".
			"`parent`,".
			"`root`,".
			"`time_created`,".
			"`time_modified`,".
			"`time_published`".
		") ".
		"VALUES (" .
			"\"".$type."\"," .
			"\"".$slug."\"," .
			"\"".$name."\"," .
			"\"".$body."\"," .
			$author."," .
			$parent."," .
			$root."," .
			"NOW()," .
			"NOW()," .
			($publish ? "NOW()" : "\"0000-00-00 00:00:00\"") .
		");");
		
	// TODO: do something on db_query error

	return db_GetId();
}

?>
