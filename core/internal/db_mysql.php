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

// Unsafe "run any query" function. Queries don't return results. Use db_fetch instead. //
function db_Query($query,$ignore_errors=false) {
	global $DB_QUERY_COUNT;
	$DB_QUERY_COUNT++;
	return mysqli_query($GLOBALS['db'],$query) or $ignore_errors or die(mysqli_error($GLOBALS['db'])."\n");
}

// Unsafe "run any fetch query" function. Returns fields as an Associative Array. //
function db_Fetch($query,$schema=null) {
	global $db;
	global $DB_QUERY_COUNT;
	$DB_QUERY_COUNT++;

	$result = mysqli_query($db,$query);
	$rows = [];
	if ( !empty($result) ) {
		if ( is_array($schema) ) {
			while ( $row = $result->fetch_assoc() ) {
				db_DoSchema( $row, $schema );
				$rows[] = $row;
			};
		}
		else {
			while ( $row = $result->fetch_assoc() ) {
				$rows[] = $row;
			};
		}
	}
	return $rows;
}

// Unsafe "run any fetch query" function. Returns fields as a Numeric Array. //
function db_FetchArray($query) {
	global $db;
	global $DB_QUERY_COUNT;
	$DB_QUERY_COUNT++;

	$result = mysqli_query($db,$query);
	$rows = [];
	if ( !empty($result) ) {
		while ( $row = $result->fetch_row() ) {
			$rows[] = $row;
		}
	}
	return $rows;
}

// Unsafe "run any fetch query" function. Returns fields as a Numeric Array. //
function db_FetchArrayPair($query) {
	global $db;
	global $DB_QUERY_COUNT;
	$DB_QUERY_COUNT++;

	$result = mysqli_query($db,$query);
	$rows = [];
	if ( !empty($result) ) {
		while ( $row = $result->fetch_row() ) {
			$rows[$row[0]] = $row[1];
		}
	}
	return $rows;
}


// Unsafe "run any fetch query" function. Returns an array of values from a single field. //
function db_FetchSingle($query,$type = null) {
	global $db;
	global $DB_QUERY_COUNT;
	$DB_QUERY_COUNT++;

	$result = mysqli_query($db,$query);
	$rows = [];
	if ( !empty($type) ) {
		while ( $row = $result->fetch_row() ) {
			if ( $type === CMW_FIELD_TYPE_INT )
				$rows[] = intval($row[0]);
			else if ( $type === CMW_FIELD_TYPE_FLOAT )
				$rows[] = floatval($row[0]);
			else if ( $type === CMW_FIELD_TYPE_DATETIME )
				$rows[] = strtotime($row[0]);
			else if ( $type === CMW_FIELD_TYPE_JSON )
				$rows[] = json_decode($row[0],true);
			else if ( $type === CMW_FIELD_TYPE_IGNORE ) {
			}
			else {
				$rows[] = $row[0];
			}
		}
	}
	else {
		while ( $row = $result->fetch_row() ) {
			$rows[] = $row[0];
		}
	}

	return $rows;
}


// Unsafe "run any fetch query" function. Returns an array of values from a single field. //
function db_FetchPair( $query, $typeA = null, $typeB = null ) {
	global $db;
	global $DB_QUERY_COUNT;
	$DB_QUERY_COUNT++;

	$result = mysqli_query($db,$query);
	$rows = [];
	while ( $row = $result->fetch_row() ) {
		// Key //
		switch( $typeA ) {
			case CMW_FIELD_TYPE_INT:
				$a = intval($row[0]);
				break;
			case CMW_FIELD_TYPE_FLOAT:
				$a = floatval($row[0]);
				break;
			case CMW_FIELD_TYPE_DATETIME:
				$a = strtotime($row[0]);
				break;
			case CMW_FIELD_TYPE_JSON:
				$a = json_decode($row[0],true);
				break;
			case CMW_FIELD_TYPE_IGNORE:
				continue;
				break;
			default:
				$a = $row[0];
				break;
		}
		// Value //
		switch( $typeB ) {
			case CMW_FIELD_TYPE_INT:
				$b = intval($row[0]);
				break;
			case CMW_FIELD_TYPE_FLOAT:
				$b = floatval($row[0]);
				break;
			case CMW_FIELD_TYPE_DATETIME:
				$b = strtotime($row[0]);
				break;
			case CMW_FIELD_TYPE_JSON:
				$b = json_decode($row[0],true);
				break;
			case CMW_FIELD_TYPE_IGNORE:
				continue;
				break;
			default:
				$b = $row[0];
				break;
		}
		
		$rows[$a] = $b;
	}

	return $rows;
}

function db_AffectedRows() {
	global $db;

	if (!isset($db->affected_rows))
		return null;

	return $db->affected_rows;
}

function db_NumRows() {
	global $db;

	if (!isset($db->num_rows))
		return null;

	return $db->num_rows;
}

function db_GetId() {
	global $db;
	
	if (!isset($db->insert_id))
		return null;
	
	return $db->insert_id;
}

function db_EscapeString( $in ) {
	global $db;
	return mysqli_real_escape_string($db,$in);
}


function _db_BuildMySQLParamString( $field, $schema = null ) {
	$paramstr = "";
	
	// CHEAT: Make it an array to simplify the following code //
	if ( !is_array($field) )
		$field = [$field];

	// With a schema, decode the fields //
	if ( isset($schema) ) {
		foreach( $field as $key => &$value ) {
			if ( isset($schema[$key]) ) {
				switch( $schema[$key] ) {
					case CMW_FIELD_TYPE_IGNORE:
						// TODO: Error
						break;
					case CMW_FIELD_TYPE_INT:
					case CMW_FIELD_TYPE_DATETIME:
						$paramstr .= 'i';
						break;
					case CMW_FIELD_TYPE_FLOAT:
						$paramstr .= 'd';
						break;
					case CMW_FIELD_TYPE_JSON:
					case CMW_FIELD_TYPE_STRING:
					default:
						$paramstr .= 's';
						break;
				};
			}
			else {
				$paramstr .= 's';
			}
		}
	}
	// If no Schema, assume everything is a string
	else {
		foreach( $field as &$value ) {
			$paramstr .= 's';
		}
	}

	return $paramstr;
}

// NOTE: ...$var requires PHP 5.6

//// Given 1 or more fields, build the query string //
//// - Use the % sign for the field placement identifier in your query.
//// - Use a number to insert that many comma delimited '?' symbols 
//function _db_BuildQueryString( $query, ...$fields ) {
//	foreach ( $fields as &$field ) {
//		if ( is_array($field) ) {
//			$field_str[] = implode(',',array_map(
//					function( $el ) {
//						return '`'.$el.'`';
//					},
//					$field
//				));
//		}
//		else if ( is_integer($field) ) {
//			if ( $field > 0 ) {
//				$str = '?';
//				for ( $idx = 1; $idx < $field; ++$idx ) {
//					$str .= ',?';
//				}
//				$field_str[] = $str;
//			}
//			else {
//				// TODO: ERROR
//				$field_str[] = "";
//			} 
//		}
//		else {
//			if ( $field == '*' )
//				$field_str[] = $field;
//			else
//				$field_str[] = '`'.$field.'`';
//		}
//	}
//	
//	$field_str_count = count($field_str);
//		
//	// TODO: for each %, insert a field string
//	// Fastest relpace method according to http://stackoverflow.com/a/1252710
//	while ( $pos = strpos($query,'%') ) {
//		$query = substr_replace($query,array_shift($field_str),$pos,1/*strlen('%')*/);
//	}
////	if ($pos !== false) {
////	    return substr_replace($query,$field_str,$pos,1/*strlen('%')*/);
////	}
////
////	// TODO: ERROR
////	
//	return $query;
//}

function _db_BuildArgList( $args ) {
	$out = [];
	foreach( $args as &$arg ) {
		if ( is_integer($arg) ) {
			$endval = end($out);
			for ( $idx = 1; $idx < $arg; ++$idx ) {
				$out[] = $endval;
			}
		}
		else {
			$out[] = $arg;
		}
	}
	return $out;
}

// Build a list of schema operations //
function _db_ParseArgList( $args, $schema ) {
	$out = [];
	foreach( $args as &$arg ) {
		// If it's an Integer, repeat the previous value so there are that many copies.
		if ( is_integer($arg) ) {
			$endval = end($out);
			
			for ( $idx = 1; $idx < $arg; ++$idx ) {
				$out[] = $endval;
			}
		}
		// If it's a string, lookup the name in the schema. If not found, assume a string.
		else {
			if ( isset($schema[$arg]) )
				$out[] = $schema[$arg];
			else
				$out[] = CMW_FIELD_TYPE_STRING;
		}
	}
	return $out;
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

// Underscore version doesn't close //
function _db_DoQuery( $query, $args ) {
	$st = _db_Prepare($query);
	if ( $st && _db_BindExecute($st,$args) ) {
		return $st;
	}
	return false;
}
function db_DoQuery( $query, ...$args ) {
	if ( db_IsConnected() ) {
		$st = _db_DoQuery($query,$args);
		if ( $st ) {
			return $st->close();
		}
	}
	return false;
}

// Do an INSERT query, return the Id //
function db_DoInsertQuery( $query, ...$args ) {
	if ( db_IsConnected() ) {
		$st = _db_DoQuery($query,$args);
		if ( $st ) {
			$index = $st->insert_id;
			$st->close();
			return $index;
		}
	}
	return false;
}

// Theoretically this should work, but disabling it until I need it //
//function db_DoMultiQuery( $query,/*array*/ ...$args ) {
//	if ( db_IsConnected() ) {
//		$st = _db_Prepare($query);
//		if (!empty($st)) {
//			foreach ( $args as $arg ) {
//				if ( _db_BindExecute($st,$arg) )
//					$st->reset();		// Reset internal state for next iteration
//				else
//					return false; 		// Close called automatically //
//			}
//			$st->close();
//			return true;
//		}
//	}
//	return false;
//}

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
// Same, but assume the key is a number, not a string //
function _db_GetAssocKey($key,&$st) {
	$result = $st->get_result();
	$ret = [];
	while ($row = $result->fetch_array(MYSQLI_ASSOC /*MYSQLI_NUM*/)) {
		$ret[intval($row[$key])] = $row;
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


function db_DoFetch( $query, ...$args ) {
	if ( db_IsConnected() ) {
		$st = _db_DoQuery($query,$args);
		if ( $st ) {
			$ret = _db_GetAssoc($st);
			$st->close();
			return $ret;
		}
	}
	return null;
}
// Fetch a single row
function db_DoFetchSingle( $query, ...$args ) {
	$ret = db_DoFetch($query,...$args);
	if ( isset($ret[0]) )
		return $ret[0];
	return null;
}

// Fetch only the first element in each row, and make an array
function db_DoFetchFirst( $query, ...$args ) {
	if ( db_IsConnected() ) {
		$st = _db_DoQuery($query,$args);
		if ( $st ) {
			$ret = _db_GetFirst($st);
			$st->close();
			return $ret;
		}
	}
	return null;
}
// Fetch a pair of elements, using the 1st as the key, 2nd as value
function db_DoFetchPair( $query, ...$args ) {
	if ( db_IsConnected() ) {
		$st = _db_DoQuery($query,$args);
		if ( $st ) {
			$ret = _db_GetPair($st);
			$st->close();
			return $ret;
		}
	}
	return null;
}
function db_DoFetchIntPair( $query, ...$args ) {
	if ( db_IsConnected() ) {
		$st = _db_DoQuery($query,$args);
		if ( $st ) {
			$ret = _db_GetIntPair($st);
			$st->close();
			return $ret;
		}
	}
	return null;
}

function db_DoFetchKey( $key, $query, ...$args ) {
	if ( db_IsConnected() ) {
		$st = _db_DoQuery($query,$args);
		if ( $st ) {
			$ret = _db_GetAssocKey($key,$st);
			$st->close();
			return $ret;
		}
	}
	return null;
}
function db_DoFetchStringKey( $key, $query, ...$args ) {
	if ( db_IsConnected() ) {
		$st = _db_DoQuery($query,$args);
		if ( $st ) {
			$ret = _db_GetAssocStringKey($key,$st);
			$st->close();
			return $ret;
		}
	}
	return null;
}

// TODO: Move these to prepare statement
function db_TableExists($name) {
	if ( db_IsConnected() ) {
		return mysqli_query($GLOBALS['db'],'SHOW TABLES LIKE "'.$GLOBALS['db']->real_escape_string($name).'";')->num_rows == 1;
	}
	return false;
}
function db_DatabaseExists($name) {
	if ( db_IsConnected() ) {
		return mysqli_query($GLOBALS['db'],'SHOW DATABASES LIKE "'.$GLOBALS['db']->real_escape_string($name).'";')->num_rows == 1;
	}
	return false;
}
