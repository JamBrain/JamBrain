<?php
// Be sure to include your configuration before including this file.
// Configuration is not auto-included, in case you want to customize

$db = null;				// ** Global Database Variable **** //

$DB_QUERY_COUNT = 0;
function db_GetQueryCount() {
	global $DB_QUERY_COUNT;
	return $DB_QUERY_COUNT;
}

// Logging function specific to database operations //
function db_Log( $msg, $echo_too = false ) {
	error_log( "CMW DB ERROR: " . $msg );
	if ( isset($echo_too) && $echo_too == true ) {
		echo "<strong>CMW DB ERROR:</strong> " . $msg . "<br />";
	}
}
function db_LogError( $echo_too = false ) {
	global $db;
	if ( isset($db) )
		db_Log( mysqli_error($db), $echo_too );
}

// Check database config //
if ( !defined('CMW_DB_HOST') ) {
	die(db_Log("CMW_DB_HOST not set"));
}
if ( !defined('CMW_DB_NAME') ) {
	die(db_Log("CMW_DB_NAME not set."));
}
if ( !defined('CMW_DB_LOGIN') ) {
	die(db_Log("CMW_DB_LOGIN not set."));
}
if ( !defined('CMW_DB_PASSWORD') ) {
	die(db_Log("CMW_DB_PASSWORD not set."));
}

// Are we connected and ready to use the Database? //
function db_IsConnected() {
	global $db;
	return isset($db);
}

define('_INI_MYSQLI_DEFAULT_PORT',ini_get("mysqli.default_port"));
define('_INI_MYSQLI_DEFAULT_SOCKET',ini_get("mysqli.default_socket"));

// Connect to the Database //
function db_Connect(
	$host=CMW_DB_HOST,$login=CMW_DB_LOGIN,$password=CMW_DB_PASSWORD,$name=CMW_DB_NAME,
	$port=_INI_MYSQLI_DEFAULT_PORT,$socket=_INI_MYSQLI_DEFAULT_SOCKET
) {
	// Safely call this multiple times, only the first time has any effect //
	if ( !db_IsConnected() ) {
		global $db;
		$db = mysqli_init();
		
		//mysqli_options($db, ...);

		if ( defined('CMW_DB_PORT') )
			$port = CMW_DB_PORT;

		if ( defined('CMW_DB_SOCKET') )
			$socket = CMW_DB_SOCKET;
		
		$flags = null;

		// Connect to the database //
		mysqli_real_connect($db,$host,$login,$password,$name,$port,$socket,$flags);
		
		// http://php.net/manual/en/mysqli.quickstart.connections.php
		if ($db->connect_errno) {
    		db_Log( "Failed to connect: (" . $db->connect_errno . ") " . $db->connect_error );
    	}
    	
    	// Set character set to utf8mb4 mode (default is utf8mb3 (utf8). mb4 is required for Emoji)
    	mysqli_set_charset($db,'utf8mb4');
    	// More info: http://stackoverflow.com/questions/279170/utf-8-all-the-way-through
	}
}
// Connect to MySQL Server only //
function db_ConnectOnly(
	$host=CMW_DB_HOST,$login=CMW_DB_LOGIN,$password=CMW_DB_PASSWORD,
	$port=_INI_MYSQLI_DEFAULT_PORT,$socket=_INI_MYSQLI_DEFAULT_SOCKET
) {
	return db_Connect($host,$login,$password,"",$port,$socket);
}

// Close Database Connection //
function db_Close() {
	// Safely call this multiple times, only the first time has any effect //
	if ( !db_IsConnected() ) {
		global $db;
		mysqli_close($db);
	}
}


// Because MySQL returns everything as a string, here's a lightweight schema decoder //
function db_DoSchema( &$row, &$schema ) {
	foreach( $row as $key => &$value ) {
		if ( isset($schema[$key]) ) {
			switch( $schema[$key] ) {
				//case CMW_FIELD_TYPE_STRING: {
				//	// Do nothing for Strings (they're already strings) //
				//	break;
				//}
				case CMW_FIELD_TYPE_INT: {
					$row[$key] = intval($value);
					break;
				}
				case CMW_FIELD_TYPE_FLOAT: {
					$row[$key] = floatval($value);
					break;
				}
				case CMW_FIELD_TYPE_DATETIME: {
					$row[$key] = strtotime($value);
					break;
				}
				case CMW_FIELD_TYPE_JSON: {
					$row[$key] = json_decode($value,true);
					break;
				}
				case CMW_FIELD_TYPE_IGNORE: {
					// NOTE: This is not ideal. You should instead use a modified query. //
					unset($row[$key]);
					break;
				}
			};
		}
	}
}


/* *********************************************************************************************** */

// NOTE: Prepare statements are only faster in places you DON'T use the "in" keyword.
//	Prepared statements are an optimization when the query itself is identical.

function _db_Prepare( $query ) {
	return mysqli_prepare($GLOBALS['db'],$query);
}

function _db_BindExecute( &$st, $args ) {
	if ( count($args) > 0 ) {
		// Build the type string //
		$arg_types_string = "";
		foreach ( $args as &$arg ) {
			if ( is_integer($arg) ) {
				$arg_types_string .= 'i';
			}
			else if ( is_float($arg) ) {
				$arg_types_string .= 'd';
			}
			else if ( is_string($arg) ) {
				$arg_types_string .= 's';
			}
			else if ( is_bool($arg) ) {
				$arg_types_string .= 'i';
				$arg = $arg ? 1 : 0;
			}
			else if ( is_array($arg) ) {
				$arg_types_string .= 's';
				$arg = json_encode($arg,true);
			}
			// date+time?
			else {
				db_Log("Unable to parse ".gettype($arg));
			}
		}
		
		$st->bind_param($arg_types_string,...$args);
	}

	$GLOBALS['DB_QUERY_COUNT']++;
	$ret = $st->execute();
	
	if ( !$ret || $st->errno ) {
		db_LogError();
		$st->close();
		return false;
	}

	return true;
}

/* *********************************************************************************************** */

// Underscore version doesn't close //
function _db_Query( $query, $args ) {
	db_Connect();

	$st = _db_Prepare($query);
	if ( $st && _db_BindExecute($st,$args) ) {
		return $st;
	}
	db_LogError();
	return false;
}

/* *********************************************************************************************** */

function _db_GetAssoc(&$st) {
	$result = $st->get_result();
	$ret = [];
	while ($row = $result->fetch_array(MYSQLI_ASSOC /*MYSQLI_NUM*/)) {
		$ret[] = $row;
	}
	return $ret;
}
// Given a key (field name), populate an array using the value of the key as the index
function _db_GetAssocStringKey($key,&$st) {
	$result = $st->get_result();
	$ret = [];
	while ($row = $result->fetch_array(MYSQLI_ASSOC /*MYSQLI_NUM*/)) {
		$ret[$row[$key]] = $row;
	}
	return $ret;
}
// Same, but assume the key is an integer, not a string //
function _db_GetAssocIntKey($key,&$st) {
	$result = $st->get_result();
	$ret = [];
	while ($row = $result->fetch_array(MYSQLI_ASSOC /*MYSQLI_NUM*/)) {
		$ret[intval($row[$key])] = $row;
	}
	return $ret;
}
// Same, but assume the key is a float, not a string //
function _db_GetAssocFloatKey($key,&$st) {
	$result = $st->get_result();
	$ret = [];
	while ($row = $result->fetch_array(MYSQLI_ASSOC /*MYSQLI_NUM*/)) {
		$ret[floatval($row[$key])] = $row;
	}
	return $ret;
}
// Get an array of just the first element //
function _db_GetFirst(&$st) {
	$result = $st->get_result();
	$ret = [];
	while ($row = $result->fetch_array(MYSQLI_NUM)) {
		$ret[] = $row[0];
	}
	return $ret;
}
// Make a key=value pair array, where 0 is the key, and 1 is the value 
function _db_GetPair(&$st) {
	$result = $st->get_result();
	$ret = [];
	while ($row = $result->fetch_array(MYSQLI_NUM)) {
		$ret[$row[0]] = $row[1];
	}
	return $ret;
}
// Same as above, but make sure the key is an integer
function _db_GetIntPair(&$st) {
	$result = $st->get_result();
	$ret = [];
	while ($row = $result->fetch_array(MYSQLI_NUM)) {
		$ret[intval($row[0])] = $row[1];
	}
	return $ret;
}

/* *********************************************************************************************** */

// Basic Query. Don't care about the results. //
function db_Query( $query, ...$args ) {
	$st = _db_Query($query,$args);
	if ( $st ) {
		return $st->close();
	}
	return false;
}

// Do an INSERT query, return the Id //
function db_QueryInsert( $query, ...$args ) {
	$st = _db_Query($query,$args);
	if ( $st ) {
		$index = $st->insert_id;
		$st->close();
		return $index;
	}
	return false;
}

// Do a DELETE query, return the number of rows changed //
function db_QueryDelete( $query, ...$args ) {
	$st = _db_Query($query,$args);
	if ( $st ) {
		$index = $st->affected_rows;
		$st->close();
		return $index;
	}
	return false;
}

function db_QueryNumRows( $query, ...$args ) {
	$st = _db_Query($query,$args);
	if ( $st ) {
		$ret = $st->num_rows;
		$st->close();
		return $ret;
	}
	return null;
}

// Return the result of the query
function db_QueryFetch( $query, ...$args ) {
	$st = _db_Query($query,$args);
	if ( $st ) {
		$ret = _db_GetAssoc($st);
		$st->close();
		return $ret;
	}
	return null;
}
// Fetch the first row (not the first field). You should include a LIMIT 1.
function db_QueryFetchFirst( $query, ...$args ) {
	$ret = db_QueryFetch($query,...$args);
	if ( isset($ret[0]) )
		return $ret[0];
	return null;
}

// Fetch the first element in each row, and return them as an array
function db_QueryFetchSingle( $query, ...$args ) {
	$st = _db_Query($query,$args);
	if ( $st ) {
		$ret = _db_GetFirst($st);
		$st->close();
		return $ret;
	}
	return null;
}

// Fetch a pair of elements, using the 1st as the key, 2nd as value
function db_QueryFetchPair( $query, ...$args ) {
	$st = _db_Query($query,$args);
	if ( $st ) {
		$ret = _db_GetPair($st);
		$st->close();
		return $ret;
	}
	return null;
}
// Same as above, but both values are integers
function db_QueryFetchIntPair( $query, ...$args ) {
	$st = _db_Query($query,$args);
	if ( $st ) {
		$ret = _db_GetIntPair($st);
		$st->close();
		return $ret;
	}
	return null;
}

// Fetch a single value, when there is only one result //
function db_QueryFetchValue( $query, ...$args ) {
	$ret = db_QueryFetchSingle($query,$args);
	if ( isset($ret[0]) ) {
		return $ret[0];
	}
	return null;	
}

// Given a specific key, populate an array using that value as an integer key
function db_QueryFetchWithIntKey( $key, $query, ...$args ) {
	$st = _db_Query($query,$args);
	if ( $st ) {
		$ret = _db_GetAssocIntKey($key,$st);
		$st->close();
		return $ret;
	}
	return null;
}
// Given a specific key, populate an array using that value as a float key
function db_QueryFetchWithFloatKey( $key, $query, ...$args ) {
	$st = _db_Query($query,$args);
	if ( $st ) {
		$ret = _db_GetAssocFloatKey($key,$st);
		$st->close();
		return $ret;
	}
	return null;
}
// Given a specific key, populate an array using that value as a string key
function db_QueryFetchWithStringKey( $key, $query, ...$args ) {
	$st = _db_Query($query,$args);
	if ( $st ) {
		$ret = _db_GetAssocStringKey($key,$st);
		$st->close();
		return $ret;
	}
	return null;
}

/* *********************************************************************************************** */

// TODO: Test these
function db_TableExists($name) {
	return db_QueryNumRows("SHOW TABLES LIKE ?;",$name) == 1;
}
function db_DatabaseExists($name) {
	return db_QueryNumRows("SHOW DATABASES LIKE ?;",$name) == 1;
}
