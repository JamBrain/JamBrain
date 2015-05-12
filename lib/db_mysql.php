<?php

// **** GLOBAL DATABASE VARIABLE **** //
$db = null;

// Logging function specific to database operations //
function db_log( $msg ) {
	error_log( "CMW DB ERROR: " . $msg );
	echo "<strong>CMW DB ERROR:</strong> " . $msg . "<br />";
}

// Check database config //
if ( !isset($cfg_db_host) ) {
	db_log( "No database host name set." );
}
if ( !isset($cfg_db_name) ) {
	db_log( "No database name set." );
}
if ( !isset($cfg_db_login) ) {
	db_log( "No database login set." );
}
if ( !isset($cfg_db_password) ) {
	db_log( "No database password set." );
}

// Are we connected and ready to use the Database? //
function db_isConnected() {
	global $db;
	return isset($db);
}
// Connect to the Database - Pass true if you don't want to log an error if already connected //
function db_connect(/*$no_log=false*/) {
	if ( !db_isConnected() ) {
		global $db;

		global $cfg_db_host;
		global $cfg_db_name;
		global $cfg_db_login;
		global $cfg_db_password;

		$db = new mysqli($cfg_db_host,$cfg_db_login,$cfg_db_password,$cfg_db_name);
		
		// http://php.net/manual/en/mysqli.quickstart.connections.php
		if ($db->connect_errno) {
    		db_log( "Failed to connect to MySQL: (" . $db->connect_errno . ") " . $db->connect_error );
    	}
	}
//	else {
//		if ( !$no_log ) {
//			db_log( "Database already connected" );
//		}
//	}
}

// Unsafe "run any query" function. Queries don't return results. Use db_fetch instead. //
function db_query($query,$ignore_errors=false) {
	global $db;
	return $db->query($query) or $ignore_errors or die(mysqli_error($db)."\n");
}

// Unsafe "run any fetch query" function. Returns an Associative Array. //
function db_fetch($query) {
	global $db;
	$result = $db->query($query);
	return $result->fetch_array(MYSQLI_ASSOC);
}

// Unsafe "run any fetch query" function. Returns a Numeric Array. //
function db_fetchArray($query) {
	global $db;
	$result = $db->query($query);
	return $result->fetch_array(MYSQLI_NUM);
}




?>
