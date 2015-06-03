<?php
require_once __DIR__ . "/../db.php";

$__love_table = "cmw_love";

// Returns true if the love was added (false if it already existed) //
function love_add( &$node, &$user = 0, &$ip = '0.0.0.0' ) {
	global $__love_table;
	
	db_connect();

	db_query(
		"INSERT IGNORE `" . $__love_table . "` (".
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

	return !empty(db_affectedRows());
}


// Returns true if the love was removed (false if there was no row to remove) //
function love_remove( &$node, &$user = 0, &$ip = '0.0.0.0' ) {
	global $__love_table;
	
	db_connect();

	db_query( 
		"DELETE FROM `" . $__love_table . "` WHERE ".
			"`node`=" . $node . " AND " .
			"`user`=" . $user . " AND " .
			"`ip`=INET_ATON('" . $ip . "')" .
		";");
		
	// TODO: do something on db_query error

	return !empty(db_affectedRows());
}


// Returns an array of NodeIDs that are Loved by UserID or IP.
function love_fetch( &$user = 0, &$ip = '0.0.0.0', $offset = null, $limit = null ) {
	global $__love_table;

	db_connect();

	return db_fetchSingle( 
		"SELECT `node` FROM `" . $__love_table . "` WHERE ".
			"`user`=" . $user . " AND " .
			"`ip`=INET_ATON('" . $ip . "')" .
		(is_null($limit) ? "" : (" LIMIT " . $limit)) . 
		(is_null($offset) ? "" : (" OFFSET " . $offset)) . 
		";");
}

?>
