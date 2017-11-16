<?php
require_once __DIR__."/db_common.php";

$SearchDB = null;
$SEARCHDB_QUERY_COUNT = 0;

if ( !defined('SH_SEARCHDB_HOST') ) {
	_db_FatalError("SH_SEARCHDB_HOST not set");
}
if ( !defined('SH_SEARCHDB_NAME') ) {
	_db_FatalError("SH_SEARCHDB_NAME not set.");
}
if ( !defined('SH_SEARCHDB_LOGIN') ) {
	_db_FatalError("SH_SEARCHDB_LOGIN not set.");
}
if ( !defined('SH_SEARCHDB_PASSWORD') ) {
	_db_FatalError("SH_SEARCHDB_PASSWORD not set.");
}


function _searchDB_DBError( $public = false ) {
	global $SearchDB;
	_db_Error(isset($SearchDB) ? mysqli_error($SearchDB) : "NO $SearchDB", $public);
}
function _searchDB_FatalDBError( $public = false ) {
	_db_DBError($public);
	exit;
}



function _searchDB_IsConnected() {
	global $SearchDB;
	return isset($SearchDB);
}

function _searchDB_Connect(
	$host = SH_SEARCHDB_HOST,
	$login = SH_SEARCHDB_LOGIN,
	$password = SH_SEARCHDB_PASSWORD,
	$name = SH_SEARCHDB_NAME,
	$port = SH_SEARCHDB_PORT
)
{
	// Safely call this multiple times, only the first time has any effect //
	if ( !_searchDB_IsConnected() ) {
		if ( $GLOBALS['DB_ENABLE_DEBUG'] ) {
			$start = microtime(true);
		}
		
		global $SearchDB;
		$SearchDB = mysqli_init();
		
		//mysqli_options($db, ...);

		if ( defined('SH_SEARCHDB_PORT') )
			$port = SH_SEARCHDB_PORT;
		
		$flags = null;

		// Connect to the database //
		mysqli_real_connect($SearchDB, $host, $login, $password, $name, $port, null, $flags);
		
		// http://php.net/manual/en/mysqli.quickstart.connections.php
		if ($SearchDB->connect_errno) {
    		_db_Error("Failed to connect: (".$SearchDB->connect_errno.") ".$SearchDB->connect_error);
    	}
    	
    	// Set character set to utf8mb4 mode (default is utf8mb3 (utf8). mb4 is required for Emoji)
    	mysqli_set_charset($SearchDB, 'utf8mb4');
    	// More info: http://stackoverflow.com/questions/279170/utf-8-all-the-way-through
		
		if ( $GLOBALS['DB_ENABLE_DEBUG'] ) {
			$end = microtime(true);
			global $DB_DEBUG_DATA;
			$DB_DEBUG_DATA[] = ['db'=>'search', 'action'=>'connect', 'time'=>($end-$start)];
		}
	}
}

/// Close the Connection
function _searchDB_Close() {
	// Safely call this multiple times, only the first time has any effect //
	if ( !_searchDB_IsConnected() ) {
		global $SearchDB;
		mysqli_close($SearchDB);
	}
}



function _searchDB_Prepare( $query ) {
	global $SearchDB;
	return mysqli_prepare($SearchDB, $query);
}

function _searchDB_BindExecute( &$st, $args ) {
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
			else if ( is_null($arg) ) {
				$arg_types_string .= 's';
			}
			// date+time?
			else {
				_db_FatalError("Unable to parse ".gettype($arg));
			}
		}
		
		$st->bind_param($arg_types_string, ...$args);
	}

	$GLOBALS['SEARCHDB_QUERY_COUNT']++;
	$ret = $st->execute();
	
	if ( !$ret || $st->errno ) {
		_searchDB_FatalDBError();
		$st->close();
		return false;
	}

	return true;
}


function _searchDB_Query( $query, $args ) {
	_searchDB_Connect();
	
	global $SearchDB;
	$st = mysqli_query($SearchDB, $query);
	if ( $st )
		return $st;

	//_db_DebugStartQuery($query);
		
//	$st = _searchDB_Prepare($query);
//	if ( $st && _searchDB_BindExecute($st, $args) ) {
//		return $st;
//	}
	_searchDB_DBError();
	return false;
}

function searchDB_Query( $query, ...$args ) {
	$st = _searchDB_Query($query, $args);
	if ( $st ) {
//		_db_DebugEndQuery($st, $null);		
		return $st->close();
	}
	return false;
}
