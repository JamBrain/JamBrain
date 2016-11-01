<?php
/**
 * Love
 *
 * @file
 */
 
require_once __DIR__ . "/../db.php";

// NOTE: None of these functions sanitize. Make sure you sanitize your input! //

// Returns true if the love was added (false if it already existed) //
function love_Add( &$node, &$user = 0, &$ip = '0.0.0.0' ) {
	db_Connect();

	db_Query(
		"INSERT IGNORE `" . CMW_TABLE_NODE_LOVE . "` (".
			"`node`,".
			"`user`,".
			"`ip`".
		") ".
		"VALUES (" .
			$node . "," .
			$user . "," .
			"INET_ATON('" . $ip . "')" .
		");");
		
	// TODO: do something on db_query error

	return !empty(db_AffectedRows());
}


// Returns true if the love was removed (false if there was no row to remove) //
function love_Remove( &$node, &$user = 0, &$ip = '0.0.0.0' ) {
	db_Connect();

	db_Query( 
		"DELETE FROM `" . CMW_TABLE_NODE_LOVE . "` WHERE ".
			"`node`=" . $node . " AND " .
			"`user`=" . $user . " AND " .
			"`ip`=INET_ATON('" . $ip . "')" .
		";");
		
	// TODO: do something on db_query error

	return !empty(db_AffectedRows());
}


// Returns an array of NodeIDs that are Loved by UserID or IP.
function love_Fetch( &$user = 0, &$ip = '0.0.0.0', $offset = null, $limit = null ) {
	db_Connect();

	return db_FetchSingle( 
		"SELECT `node` FROM `" . CMW_TABLE_NODE_LOVE . "` WHERE ".
			"`user`=" . $user . " AND " .
			"`ip`=INET_ATON('" . $ip . "')" .
		(is_null($limit) ? "" : (" LIMIT " . $limit)) . 
		(is_null($offset) ? "" : (" OFFSET " . $offset)) . 
		";");
}

?>
