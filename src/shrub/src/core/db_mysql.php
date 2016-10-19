<?php
// Be sure to include the configuration file before including this one.
// Configuration is not auto-included, in case you want to customize it

/// @defgroup DB
/// The Database Library (wraps MySQLi)
/// @ingroup Core


/// @name Debugging/Optimization
/// @addtogroup DB
/// @{

/// @retval Integer The number of queries that have been run
function db_GetQueryCount() {
	global $DB_QUERY_COUNT;
	return $DB_QUERY_COUNT;
}
/// @}


/// @cond INTERNAL

/// @name Internal
/// @{
$db = null;				///< The global database object
$DB_QUERY_COUNT = 0;	///< How many queries have been run
/// @}

/// @name Internal: Logging
/// Used internally for logging database errors.
/// @{
function _db_Log( $msg, $echo_too = false ) {
	error_log( "SHRUB DB ERROR: " . $msg );
	if ( $echo_too === true ) {
		echo "<strong>SHRUB DB ERROR:</strong> " . $msg . "<br />";
	}
}
function _db_LogError( $echo_too = false ) {
	global $db;
	if ( isset($db) ) {
		_db_Log( mysqli_error($db), $echo_too );
	}
}
/// @}

/// @endcond


///@cond
// Check database config //
if ( !defined('SH_DB_HOST') ) {
	die(_db_Log("SH_DB_HOST not set"));
}
if ( !defined('SH_DB_NAME') ) {
	die(_db_Log("SH_DB_NAME not set."));
}
if ( !defined('SH_DB_LOGIN') ) {
	die(_db_Log("SH_DB_LOGIN not set."));
}
if ( !defined('SH_DB_PASSWORD') ) {
	die(_db_Log("SH_DB_PASSWORD not set."));
}

define('_INI_MYSQLI_DEFAULT_PORT',ini_get("mysqli.default_port"));
define('_INI_MYSQLI_DEFAULT_SOCKET',ini_get("mysqli.default_socket"));
///@endcond



/// @cond INTERNAL

/// @name Internal: Database Connect
/// Database connections are handled automatically, so you **should not** need to call these
/// @{

/// Are we connected and ready to use the Database?
function _db_IsConnected() {
	global $db;
	return isset($db);
}

/// Connect to the Database
function _db_Connect(
	$host=SH_DB_HOST,
	$login=SH_DB_LOGIN,
	$password=SH_DB_PASSWORD,
	$name=SH_DB_NAME,
	$port=_INI_MYSQLI_DEFAULT_PORT,
	$socket=_INI_MYSQLI_DEFAULT_SOCKET
)
{
	// Safely call this multiple times, only the first time has any effect //
	if ( !_db_IsConnected() ) {
		global $db;
		$db = mysqli_init();
		
		//mysqli_options($db, ...);

		if ( defined('SH_DB_PORT') )
			$port = SH_DB_PORT;

		if ( defined('SH_DB_SOCKET') )
			$socket = SH_DB_SOCKET;
		
		$flags = null;

		// Connect to the database //
		mysqli_real_connect($db,$host,$login,$password,$name,$port,$socket,$flags);
		
		// http://php.net/manual/en/mysqli.quickstart.connections.php
		if ($db->connect_errno) {
    		_db_Log( "Failed to connect: (" . $db->connect_errno . ") " . $db->connect_error );
    	}
    	
    	// Set character set to utf8mb4 mode (default is utf8mb3 (utf8). mb4 is required for Emoji)
    	mysqli_set_charset($db,'utf8mb4');
    	// More info: http://stackoverflow.com/questions/279170/utf-8-all-the-way-through
	}
}

/// Connect to the MySQL Server only
function _db_ConnectOnly(
	$host=SH_DB_HOST,
	$login=SH_DB_LOGIN,
	$password=SH_DB_PASSWORD,
	$port=_INI_MYSQLI_DEFAULT_PORT,
	$socket=_INI_MYSQLI_DEFAULT_SOCKET
)
{
	return _db_Connect($host,$login,$password,"",$port,$socket);
}

/// Close the Connection
function _db_Close() {
	// Safely call this multiple times, only the first time has any effect //
	if ( !_db_IsConnected() ) {
		global $db;
		mysqli_close($db);
	}
}
/// @}

/// @endcond



/// @name MySQL Workarounds
/// @{

/// Since MySQL returns all fields as strings, this can be used to change the type of each field.
/// @param [in,out] Array $row a single row result from a db_Fetch function. **WILL BE MODIFIED**
/// @param [in] Array $map a key=>value array of field names and SH_FIELD_TYPE constants
///
/// Maps should look something like this:
///
/// 	$SCHEDULE_MAP = [
/// 		'id' => SH_FIELD_TYPE_INT,
/// 		'parent' => SH_FIELD_TYPE_INT,
/// 		'start' => SH_FIELD_TYPE_DATETIME,
/// 		'end' => SH_FIELD_TYPE_DATETIME,
/// 		'extra' => SH_FIELD_TYPE_JSON,
/// 	];
///
/// You don't need to include every field in a map, just the ones you want to change from Strings.
///
/// See @ref DBParseRowFields for a list of types. 
function db_ParseRow( &$row, &$map ) {
	foreach( $row as $key => &$value ) {
		if ( isset($map[$key]) ) {
			switch( $map[$key] ) {
				//case SH_FIELD_TYPE_STRING: {
				//	// Do nothing for Strings (they're already strings) //
				//	break;
				//}
				case SH_FIELD_TYPE_INT: {
					$row[$key] = intval($value);
					break;
				}
				case SH_FIELD_TYPE_FLOAT: {
					$row[$key] = floatval($value);
					break;
				}
				case SH_FIELD_TYPE_DATETIME: {
					$row[$key] = strtotime($value);
					break;
				}
				case SH_FIELD_TYPE_JSON: {
					$row[$key] = json_decode($value,true);
					break;
				}
				case SH_FIELD_TYPE_IGNORE: {
					// NOTE: This is not ideal. You should instead use a modified query. //
					unset($row[$key]);
					break;
				}
			};
		}
	}
}
///@}

/* *********************************************************************************************** */

/// @cond INTERNAL

// NOTE: Prepare statements are only faster in places you DON'T use the "in" keyword.
// Prepared statements as an optimization are only applicible when the query itself is identical.

/// @name Internal: Internal Query Code
/// @{
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
				_db_Log("Unable to parse ".gettype($arg));
			}
		}
		
		$st->bind_param($arg_types_string,...$args);
	}

	$GLOBALS['DB_QUERY_COUNT']++;
	$ret = $st->execute();
	
	if ( !$ret || $st->errno ) {
		_db_LogError();
		$st->close();
		return false;
	}

	return true;
}

/* *********************************************************************************************** */

/// This, the underscore version doesn't close $st; It returns it instead
function _db_Query( $query, $args ) {
	_db_Connect();

	$st = _db_Prepare($query);
	if ( $st && _db_BindExecute($st,$args) ) {
		return $st;
	}
	_db_LogError();
	return false;
}
///@}

/* *********************************************************************************************** */

/// @name Internal: Post-query extraction functions
/// @{
function _db_GetAssoc(&$st) {
	$result = $st->get_result();
	$ret = [];
	while ($row = $result->fetch_array(MYSQLI_ASSOC /*MYSQLI_NUM*/)) {
		$ret[] = $row;
	}
	return $ret;
}
/// Given a key (field name), populate an array using the value of the key as the index
function _db_GetAssocStringKey($key,&$st) {
	$result = $st->get_result();
	$ret = [];
	while ($row = $result->fetch_array(MYSQLI_ASSOC /*MYSQLI_NUM*/)) {
		$ret[$row[$key]] = $row;
	}
	return $ret;
}
/// Same as _db_GetAssocStringKey, but assume the key is an integer, not a string
function _db_GetAssocIntKey($key,&$st) {
	$result = $st->get_result();
	$ret = [];
	while ($row = $result->fetch_array(MYSQLI_ASSOC /*MYSQLI_NUM*/)) {
		$ret[intval($row[$key])] = $row;
	}
	return $ret;
}
/// Same as _db_GetAssocStringKey, but assume the key is a float, not a string
function _db_GetAssocFloatKey($key,&$st) {
	$result = $st->get_result();
	$ret = [];
	while ($row = $result->fetch_array(MYSQLI_ASSOC /*MYSQLI_NUM*/)) {
		$ret[floatval($row[$key])] = $row;
	}
	return $ret;
}
/// Get an array of just the first element
function _db_GetFirst(&$st) {
	$result = $st->get_result();
	$ret = [];
	while ($row = $result->fetch_array(MYSQLI_NUM)) {
		$ret[] = $row[0];
	}
	return $ret;
}
/// Make a key=value pair array, where 0 is the key, and 1 is the value 
function _db_GetPair(&$st) {
	$result = $st->get_result();
	$ret = [];
	while ($row = $result->fetch_array(MYSQLI_NUM)) {
		$ret[$row[0]] = $row[1];
	}
	return $ret;
}
/// Same as _db_GetPair, but make sure the key is an integer
function _db_GetIntPair(&$st) {
	$result = $st->get_result();
	$ret = [];
	while ($row = $result->fetch_array(MYSQLI_NUM)) {
		$ret[intval($row[0])] = $row[1];
	}
	return $ret;
}
/// @}

/// @endcond

/* *********************************************************************************************** */

/// @name Basic Query Functions
/// Takes a query string. Optionally replaces all ?'s with the additional arguments.
///
/// **NOTE:** Doxygen doesn't correctly understand PHP's `...$args` as a variadic argument. 
/// When you see `$args`, assume it's variadic (i.e. like printf, any number of optional arguments)
/// @{

/// Basic Query, for when the results don't matter.
/// @param [in] String $query MySQL query string
/// @param [in] ... (optional) String arguments
function db_Query( $query, ...$args ) {
	$st = _db_Query($query,$args);
	if ( $st ) {
		return $st->close();
	}
	return false;
}

/// Primarily for **INSERT** queries; Returns the Id
/// @param [in] String $query MySQL query string
/// @param [in] ... (optional) String arguments
/// @retval Integer the Id of the item inserted (0 on failure)
function db_QueryInsert( $query, ...$args ) {
	$st = _db_Query($query,$args);
	if ( $st ) {
		$index = $st->insert_id;
		$st->close();
		return $index;
	}
	return false;
}

/// Primarily for **DELETE** queries; Returns the number of rows changed
/// @param [in] String $query MySQL query string
/// @param [in] ... (optional) String arguments
/// @retval Integer the number of rows that changed
function db_QueryDelete( $query, ...$args ) {
	$st = _db_Query($query,$args);
	if ( $st ) {
		$index = $st->affected_rows;
		$st->close();
		return $index;
	}
	return false;
}

/// For **true/false** queries; Returns the number of rows that match a query
/// @param [in] String $query MySQL query string
/// @param [in] ... (optional) String arguments
/// @retval Integer the number of rows that match
function db_QueryNumRows( $query, ...$args ) {
	$st = _db_Query($query,$args);
	if ( $st ) {
		$ret = $st->num_rows;
		$st->close();
		return $ret;
	}
	return null;
}
/// @}

/// @name Fetch Query Functions
/// Like db_Query, but returns the query result
/// @{

/// Return the result of the query
/// @param [in] String $query MySQL query string
/// @param [in] ... (optional) String arguments
/// @retval Array[Array[String=>String]] an array of rows, each row an associative array of fields
function db_QueryFetch( $query, ...$args ) {
	$st = _db_Query($query,$args);
	if ( $st ) {
		$ret = _db_GetAssoc($st);
		$st->close();
		return $ret;
	}
	return null;
}
/// Fetch the first row (not the first field); Don't forget to add a **LIMIT 1**!
/// @param [in] String $query MySQL query string
/// @param [in] ... (optional) String arguments
/// @retval Array[String=>String] an associative array of fields
function db_QueryFetchFirst( $query, ...$args ) {
	$ret = db_QueryFetch($query,...$args);
	if ( isset($ret[0]) )
		return $ret[0];
	return null;
}

/// Fetch the first field in each row, and return an array of values
/// @param [in] String $query MySQL query string
/// @param [in] ... (optional) String arguments
/// @retval Array[String] an array of values
function db_QueryFetchSingle( $query, ...$args ) {
	$st = _db_Query($query,$args);
	if ( $st ) {
		$ret = _db_GetFirst($st);
		$st->close();
		return $ret;
	}
	return null;
}

/// Fetch a pair of fields, using the 1st as the **key**, 2nd as **value**
/// @param [in] String $query MySQL query string
/// @param [in] ... (optional) String arguments
/// @retval Array[String=>String] an array of key=>values pairs
function db_QueryFetchPair( $query, ...$args ) {
	$st = _db_Query($query,$args);
	if ( $st ) {
		$ret = _db_GetPair($st);
		$st->close();
		return $ret;
	}
	return null;
}
/// Same as db_QueryFetchPair, but both values are integers
/// @param [in] String $query MySQL query string
/// @param [in] ... (optional) String arguments
/// @retval Array[String=>String] an array of key=>values pairs, both values are integers
function db_QueryFetchIntPair( $query, ...$args ) {
	$st = _db_Query($query,$args);
	if ( $st ) {
		$ret = _db_GetIntPair($st);
		$st->close();
		return $ret;
	}
	return null;
}

/// Fetch a single value, when there is only **one result**
/// @param [in] String $query MySQL query string
/// @param [in] ... (optional) String arguments
/// @retval String the value
function db_QueryFetchValue( $query, ...$args ) {
	$ret = db_QueryFetchSingle($query,$args);
	if ( isset($ret[0]) ) {
		return $ret[0];
	}
	return null;	
}

/// Given a specific key, populate an array using that value as an integer key
/// @param [in] Integer $key ???
/// @param [in] String $query MySQL query string
/// @param [in] ... (optional) String arguments
/// @retval ???
function db_QueryFetchWithIntKey( $key, $query, ...$args ) {
	$st = _db_Query($query,$args);
	if ( $st ) {
		$ret = _db_GetAssocIntKey($key,$st);
		$st->close();
		return $ret;
	}
	return null;
}
/// Given a specific key, populate an array using that value as a float key
/// @param [in] Float $key ???
/// @param [in] String $query MySQL query string
/// @param [in] ... (optional) String arguments
/// @retval ???
function db_QueryFetchWithFloatKey( $key, $query, ...$args ) {
	$st = _db_Query($query,$args);
	if ( $st ) {
		$ret = _db_GetAssocFloatKey($key,$st);
		$st->close();
		return $ret;
	}
	return null;
}
/// Given a specific key, populate an array using that value as a string key
/// @param [in] String $key ???
/// @param [in] String $query MySQL query string
/// @param [in] ... (optional) String arguments
/// @retval ???
function db_QueryFetchWithStringKey( $key, $query, ...$args ) {
	$st = _db_Query($query,$args);
	if ( $st ) {
		$ret = _db_GetAssocStringKey($key,$st);
		$st->close();
		return $ret;
	}
	return null;
}

///@}

/* *********************************************************************************************** */

/*
/// @name Existence Functions
/// @{

/// @todo Test this
function db_TableExists($name) {
	return db_QueryNumRows("SHOW TABLES LIKE ?;",$name) == 1;
}
/// @todo Test this
function db_DatabaseExists($name) {
	return db_QueryNumRows("SHOW DATABASES LIKE ?;",$name) == 1;
}

/// @}
*/
