<?php
/// IMPORTANT: Don't include this file directly (include db.php instead)
/// Also be sure to include the configuration file before including this one.
/// Configuration is not auto-included, in case you want to customize it

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


/// @name Query Transformations
/// @{

/// Wraps MySQL datetime fields in SELECT queries so they are returned in ISO/W3C format
function DB_FIELD_DATE($field) {
	return "DATE_FORMAT(".$field.",'%Y-%m-%dT%TZ') AS ".$field;
}

function DB_FIELD_IP_TO_STRING($field) {
	return "INET6_NTOA(".$field.") AS ".$field;
}
function DB_FIELD_IP_FROM_STRING($field) {
	return "INET6_ATON(".$field.") AS ".$field;
}

// http://dev.mysql.com/doc/refman/5.6/en/func-op-summary-ref.html

const DB_TYPE_UID = "BIGINT UNSIGNED NOT NULL AUTO_INCREMENT UNIQUE"; 				///< Use *ONLY ONCE*, as the unique ID
const DB_TYPE_ID = "BIGINT UNSIGNED NOT NULL";										///< Use for all other IDs
const DB_TYPE_IP = "VARBINARY(16) NOT NULL";										///< IP Addresses (IPv6 and IPv4)
const DB_TYPE_TIMESTAMP = "DATETIME NOT NULL";										///< Timestamps
//const DB_TYPE_ASCII = "CHARSET latin1 NOT NULL";									///< Use with VarChar(x)
//const DB_TYPE_UNICODE = "NOT NULL"; /*CHARSET utf8mb4 COLLATE utf8mb4_unicode_ci*/	///< Use with VarChar(x)

function DB_TYPE_ASCII($chars) {
	return ($chars ? "VARCHAR($chars)" : "")." CHARSET latin1 NOT NULL";
}
function DB_TYPE_UNICODE($chars) {
	return ($chars ? "VARCHAR($chars)" : "")." NOT NULL";
}
function DB_TYPE_UNICODE3($chars) {
	return (chars ? "VARCHAR($chars)" : "")." CHARSET utf8 NOT NULL";
}
/// @}


/// @defgroup DBParseRowFields db_ParseRow Fields
/// Constants used to tell db_ParseRow how to reinterpret fields
/// @ingroup DB
/// @{
const SH_FIELD_TYPE_IGNORE = 0;			///< This means field will be unset. You shouldn't use this. Prefer a custom query w/o the field instead.
const SH_FIELD_TYPE_STRING = 1;			///< Has no effect (values are strings by default)
const SH_FIELD_TYPE_INT = 2;
const SH_FIELD_TYPE_FLOAT = 3;
const SH_FIELD_TYPE_DATETIME = 4;		///< W3C date formatted strings (i.e. 2016-03-01T05:23:49.049Z)
const SH_FIELD_TYPE_JSON = 5;			///< JSON encoded strings
/// @}



/// @cond INTERNAL

/// @name Internal
/// @{
$db = null;				///< The global database object
$DB_QUERY_COUNT = 0;	///< How many queries have been run
/// @}

/// @name Internal: Error Logging
/// Used internally for logging database errors.
/// @{
function _db_Error( $msg, $public = false ) {
	$unique = uniqid();
	$error = "shrub/src/core/db_mysql.php [$unique]: ".$msg;
	
	// Log the error to system log
	error_log($error);
	
	if ( php_sapi_name() === 'cli' ) {
		// CLI, we assume is private
		echo($error."\n");
	}
	else {
		require_once __DIR__."/json.php";
		json_EmitError(500, $public ? $error : "See Log [$unique]");
	}
}
function _db_FatalError( $msg, $public = false ) {
	_db_Error($msg, $public);
	exit;
}

function _db_DBError( $public = false ) {
	global $db;
	
	_db_Error(isset($db) ? mysqli_error($db) : "NO $db", $public);
}
function _db_FatalDBError( $public = false ) {
	_db_DBError($public);
	exit;
}
/// @}

/// @endcond


///@cond
// Check database config //
if ( !defined('SH_DB_HOST') ) {
	_db_FatalError("SH_DB_HOST not set");
}
if ( !defined('SH_DB_NAME') ) {
	_db_FatalError("SH_DB_NAME not set.");
}
if ( !defined('SH_DB_LOGIN') ) {
	_db_FatalError("SH_DB_LOGIN not set.");
}
if ( !defined('SH_DB_PASSWORD') ) {
	_db_FatalError("SH_DB_PASSWORD not set.");
}

define('_INI_MYSQLI_DEFAULT_PORT', ini_get("mysqli.default_port"));
define('_INI_MYSQLI_DEFAULT_SOCKET', ini_get("mysqli.default_socket"));
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
	$host = SH_DB_HOST,
	$login = SH_DB_LOGIN,
	$password = SH_DB_PASSWORD,
	$name = SH_DB_NAME,
	$port = _INI_MYSQLI_DEFAULT_PORT,
	$socket = _INI_MYSQLI_DEFAULT_SOCKET
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
		mysqli_real_connect($db, $host, $login, $password, $name, $port, $socket, $flags);
		
		// http://php.net/manual/en/mysqli.quickstart.connections.php
		if ($db->connect_errno) {
    		_db_Error("Failed to connect: (".$db->connect_errno.") ".$db->connect_error);
    	}
    	
    	// Set character set to utf8mb4 mode (default is utf8mb3 (utf8). mb4 is required for Emoji)
    	mysqli_set_charset($db, 'utf8mb4');
    	// More info: http://stackoverflow.com/questions/279170/utf-8-all-the-way-through
	}
}

/// Connect to the MySQL Server only
function _db_ConnectOnly(
	$host = SH_DB_HOST,
	$login = SH_DB_LOGIN,
	$password = SH_DB_PASSWORD,
	$port = _INI_MYSQLI_DEFAULT_PORT,
	$socket = _INI_MYSQLI_DEFAULT_SOCKET
)
{
	return _db_Connect($host, $login, $password, "", $port, $socket);
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
function & db_ParseRow( &$row, $map ) {
	if ( is_array($row) ) {
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
	return $row;
}

function & db_ParseRows( &$rows, $map ) {
	foreach( $rows as &$row ) {
		db_ParseRow($row, $map);
	}
	return $rows;
}
///@}

/* *********************************************************************************************** */

/// @cond INTERNAL

// NOTE: Prepare statements are only faster in places you DON'T use the "in" keyword.
// Prepared statements as an optimization are only applicible when the query itself is identical.

/// @name Internal: Internal Query Code
/// @{
function _db_Prepare( $query ) {
	return mysqli_prepare($GLOBALS['db'], $query);
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
				_db_FatalError("Unable to parse ".gettype($arg));
			}
		}
		
		$st->bind_param($arg_types_string, ...$args);
	}

	$GLOBALS['DB_QUERY_COUNT']++;
	$ret = $st->execute();
	
	if ( !$ret || $st->errno ) {
		_db_FatalDBError();
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
	if ( $st && _db_BindExecute($st, $args) ) {
		return $st;
	}
	_db_DBError();
	return false;
}
///@}

/* *********************************************************************************************** */

/// @name Internal: Post-query extraction functions
/// @{
function _db_GetAssoc( &$st ) {
	$result = $st->get_result();
	$ret = [];
	while ($row = $result->fetch_array(MYSQLI_ASSOC /*MYSQLI_NUM*/)) {
		$ret[] = $row;
	}
	return $ret;
}
/// Given a key (field name), populate an array using the value of the key as the index
function _db_GetAssocStringKey( $key, &$st ) {
	$result = $st->get_result();
	$ret = [];
	while ($row = $result->fetch_array(MYSQLI_ASSOC /*MYSQLI_NUM*/)) {
		$ret[$row[$key]] = $row;
	}
	return $ret;
}
/// Same as _db_GetAssocStringKey, but assume the key is an integer, not a string
function _db_GetAssocIntKey( $key, &$st ) {
	$result = $st->get_result();
	$ret = [];
	while ($row = $result->fetch_array(MYSQLI_ASSOC /*MYSQLI_NUM*/)) {
		$ret[intval($row[$key])] = $row;
	}
	return $ret;
}
/// Same as _db_GetAssocStringKey, but assume the key is a float, not a string
function _db_GetAssocFloatKey( $key, &$st ) {
	$result = $st->get_result();
	$ret = [];
	while ($row = $result->fetch_array(MYSQLI_ASSOC /*MYSQLI_NUM*/)) {
		$ret[floatval($row[$key])] = $row;
	}
	return $ret;
}
/// Get an array of just the first element
function _db_GetFirst( &$st ) {
	$result = $st->get_result();
	$ret = [];
	while ($row = $result->fetch_array(MYSQLI_NUM)) {
		$ret[] = $row[0];
	}
	return $ret;
}
/// Make a key=value pair array, where 0 is the key, and 1 is the value 
function _db_GetPair( &$st ) {
	$result = $st->get_result();
	$ret = [];
	while ($row = $result->fetch_array(MYSQLI_NUM)) {
		$ret[$row[0]] = $row[1];
	}
	return $ret;
}
/// Same as _db_GetPair, but make sure the key is an integer
function _db_GetIntPair( &$st ) {
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
	$st = _db_Query($query, $args);
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
	$st = _db_Query($query, $args);
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
	$st = _db_Query($query, $args);
	if ( $st ) {
		$index = $st->affected_rows;
		$st->close();
		return $index;
	}
	return false;
}

function db_QueryUpdate( $query, ...$args ) {
	// NOTE: Doesn't actually delete. Just means it returns the number of rows changed
	return db_QueryDelete( $query, ...$args ); // Calling non-internal function, so ...
}

/// For **true/false** queries; Returns the number of rows that match a query
/// @param [in] String $query MySQL query string
/// @param [in] ... (optional) String arguments
/// @retval Integer the number of rows that match, null on failure
function db_QueryNumRows( $query, ...$args ) {
	$st = _db_Query($query, $args);
	if ( $st ) {
		print_r($query);
		print_r($st);
		$rows = $st->num_rows;
		$st->close();
		return $rows;
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
	$st = _db_Query($query, $args);
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
	$ret = db_QueryFetch($query, ...$args); // Calling non-internal function, so ...
	if ( isset($ret[0]) )
		return $ret[0];
	return null;
}

/// Fetch the first field in each row, and return an array of values
/// @param [in] String $query MySQL query string
/// @param [in] ... (optional) String arguments
/// @retval Array[String] an array of values
function db_QueryFetchSingle( $query, ...$args ) {
	$st = _db_Query($query, $args);
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
	$st = _db_Query($query, $args);
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
	$st = _db_Query($query, $args);
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
	$ret = db_QueryFetchSingle($query, ...$args); // Calling non-internal function, so ...
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
	$st = _db_Query($query, $args);
	if ( $st ) {
		$ret = _db_GetAssocIntKey($key, $st);
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
	$st = _db_Query($query, $args);
	if ( $st ) {
		$ret = _db_GetAssocFloatKey($key, $st);
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
	$st = _db_Query($query, $args);
	if ( $st ) {
		$ret = _db_GetAssocStringKey($key, $st);
		$st->close();
		return $ret;
	}
	return null;
}

///@}

/* *********************************************************************************************** */


/// @name Exist Functions
/// @{

function db_TableExists($name) {
	global $db;
	return mysqli_query($db,"SELECT 1 FROM information_schema.TABLES WHERE table_name='".$name."' LIMIT 1;")->num_rows == 1;
	//return mysqli_query($db,"SHOW TABLES LIKE '".$name."';");
//	return db_QueryNumRows("SHOW TABLES IN ".SH_DB_NAME." LIKE '".$name."';");
//	return db_QueryNumRows("SELECT 1 FROM information_schema.TABLES WHERE table_name=? LIMIT 1;",$name);
}
/*
//function db_DatabaseExists($name) {
//	return db_QueryNumRows("SHOW DATABASES LIKE '".$name."';");
//}
*/

/// @}

