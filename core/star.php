<?php
/**
 * Star
 *
 * @file
 */
require_once __DIR__ . "/../db.php";

// Returns true if the star was added (false if it already existed) //
function star_Add( &$node, &$user ) {
	db_Connect();

	db_Query( 
		"INSERT IGNORE `" . CMW_TABLE_STAR . "` (".
			"`node`,".
			"`user`".
		") ".
		"VALUES (" .
			$node . "," .
			$user .
		");");

	// TODO: do something on db_query error

	return !empty(db_AffectedRows());
}


// Returns true if the star was removed (false if there was no row to remove) //
function star_Remove( &$node, &$user ) {
	db_Connect();

	db_Query( 
		"DELETE FROM `" . CMW_TABLE_STAR . "` WHERE ".
			"`node`=" . $node . " AND " .
			"`user`=" . $user .
		";");
	
	// TODO: do something on db_query error

	return !empty(db_AffectedRows());
}


// Returns an array of NodeIDs that are Starred by UserID
function star_Fetch( &$user = 0, $offset = null, $limit = null ) {
	db_Connect();

	return db_FetchSingle( 
		"SELECT `node` FROM `" . CMW_TABLE_STAR . "` WHERE ".
			"`user`=" . $user .
		(is_null($limit) ? "" : (" LIMIT " . $limit)) . 
		(is_null($offset) ? "" : (" OFFSET " . $offset)) . 
		";");
}

?>
