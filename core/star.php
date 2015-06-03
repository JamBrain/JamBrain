<?php
require_once __DIR__ . "/../db.php";

$__star_table = "cmw_star";

// Returns true if the star was added (false if it already existed) //
function star_add( &$node, &$user ) {
	global $__star_table;
	
	db_connect();

	db_query( 
		"INSERT IGNORE `" . $__star_table . "` (".
			"`node`,".
			"`user`".
		") ".
		"VALUES (" .
			$node . "," .
			$user .
		");");

	// TODO: do something on db_query error

	return !empty(db_affectedRows());
}


// Returns true if the star was removed (false if there was no row to remove) //
function star_remove( &$node, &$user ) {
	global $__star_table;
	
	db_connect();

	db_query( 
		"DELETE FROM `" . $__star_table . "` WHERE ".
			"`node`=" . $node . " AND " .
			"`user`=" . $user .
		";");
	
	// TODO: do something on db_query error

	return !empty(db_affectedRows());
}


// Returns an array of NodeIDs that are Starred by UserID
function star_fetch( &$user = 0, $offset = null, $limit = null ) {
	global $__star_table;
	
	db_connect();

	return db_fetchSingle( 
		"SELECT `node` FROM `" . $__star_table . "` WHERE ".
			"`user`=" . $user .
		(is_null($limit) ? "" : (" LIMIT " . $limit)) . 
		(is_null($offset) ? "" : (" OFFSET " . $offset)) . 
		";");
}

?>
