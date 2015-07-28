<?php
//include_once __DIR__ . "/../../config.php";

$db = null;				// ** Global Database Variable **** //

$DB_QUERY_COUNT = 0;
function db_GetQueryCount() {
	global $DB_QUERY_COUNT;
	return $DB_QUERY_COUNT;
}

// Logging function specific to database operations //
function db_Log( $msg ) {
	error_log( "CMW DB ERROR: " . $msg );
	echo "<strong>CMW DB ERROR:</strong> " . $msg . "<br />";
}

// Check database config //
if ( !defined('CMW_DB_HOST') ) {
	db_Log( "No database host name set." );
}
if ( !defined('CMW_DB_NAME') ) {
	db_Log( "No database name set." );
}
if ( !defined('CMW_DB_LOGIN') ) {
	db_Log( "No database login set." );
}
if ( !defined('CMW_DB_PASSWORD') ) {
	db_Log( "No database password set." );
}

// Are we connected and ready to use the Database? //
function db_IsConnected() {
	global $db;
	return isset($db);
}
// Connect to the Database - Pass true if you don't want to log an error if already connected //
function db_Connect() {
	// Safely call this multiple times, only the first time has any effect //
	if ( !db_IsConnected() ) {
		global $db;

		// Connect to the database //
		$db = new mysqli(CMW_DB_HOST,CMW_DB_LOGIN,CMW_DB_PASSWORD,CMW_DB_NAME);
		
		// http://php.net/manual/en/mysqli.quickstart.connections.php
		if ($db->connect_errno) {
    		db_Log( "Failed to connect to MySQL: (" . $db->connect_errno . ") " . $db->connect_error );
    	}
    	
    	// Set character set to utf8mb4 mode (default is utf8mb3 (utf8). mb4 is required for Emoji)
    	$db->set_charset('utf8mb4');
    	// More info: http://stackoverflow.com/questions/279170/utf-8-all-the-way-through
	}
}

// Because MySQL returns everything as a string, here's a lightweight schema decoder //
function db_DoSchema( &$row, &$schema ) {
	foreach( $row as $key => $value ) {
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
	global $db;
	global $DB_QUERY_COUNT;
	$DB_QUERY_COUNT++;
	return $db->query($query) or $ignore_errors or die(mysqli_error($db)."\n");
}

// Unsafe "run any fetch query" function. Returns fields as an Associative Array. //
function db_Fetch($query,$schema=null) {
	global $db;
	global $DB_QUERY_COUNT;
	$DB_QUERY_COUNT++;

	$result = $db->query($query);
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

	$result = $db->query($query);
	$rows = [];
	if ( !empty($result) ) {
		while ( $row = $result->fetch_row() ) {
			$rows[] = $row;
		}
	}
	return $rows;
}

// Unsafe "run any fetch query" function. Returns an array of values from a single field. //
function db_FetchSingle($query,$type = null) {
	global $db;
	global $DB_QUERY_COUNT;
	$DB_QUERY_COUNT++;

	$result = $db->query($query);
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

	$result = $db->query($query);
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
	return $db->real_escape_string($in);
}

?>
