<?php
require_once __DIR__."/db_common.php";

$SearchDB = null;
$SEARCHDB_QUERY_COUNT = 0;

if ( !defined('SH_SEARCHDB_HOST') ) {
	_db_FatalError("SH_SEARCHDB_HOST not set");
}
if ( !defined('SH_SEARCHDB_PORT') ) {
	_db_FatalError("SH_SEARCHDB_PORT not set.");
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
		
		$flags = null;

		// Connect to the database //
		mysqli_real_connect($SearchDB, $host, '', '', '', $port, '', $flags);
		
		// http://php.net/manual/en/mysqli.quickstart.connections.php
		if ( $SearchDB->connect_errno ) {
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


function _searchDB_GetAssoc() {
	global $SearchDB;
	$result = mysqli_use_result($SearchDB);

//	_db_DebugEndQuery($st, $result);
	$ret = [];
	while ($row = $result->fetch_array(MYSQLI_ASSOC)) {
		$ret[] = $row;
	}
	return $ret;
}


// See below. This is a modified version of DoubleEscape
function searchDB_Escape( $string ) {
	return strtr($string, [
		'(' =>  '\\(',
		')' =>  '\\)',
		'|' =>  '\\|',
		'-' =>  '\\-',
		'@' =>  '\\@',
		'~' =>  '\\~',
		'&' =>  '\\&',
		'\'' => '\'',
		'<' =>  '\\<',
		'!' =>  '\\!',
		'"' =>  '\\"',
		'/' =>  '\\/',
		'*' =>  '\\*',
		'$' =>  '\\$',
		'^' =>  '\\^',
		'\\' => '\\\\'
	]);
}
function searchDB_String( $string ) {
   return "'".searchDB_Escape($string)."'";
}


// https://github.com/WhatCD/Gazelle/blob/master/classes/sphinxql.class.php
// NOTE: I don't know why \' has only 3 \'s. This could be a bug, except it's working
function searchDB_DoubleEscape( $string ) {
//	return strtr(strtolower($string), [
	return strtr($string, [
		'(' =>  '\\\\(',
		')' =>  '\\\\)',
		'|' =>  '\\\\|',
		'-' =>  '\\\\-',
		'@' =>  '\\\\@',
		'~' =>  '\\\\~',
		'&' =>  '\\\\&',
		'\'' => '\\\'',
		'<' =>  '\\\\<',
		'!' =>  '\\\\!',
		'"' =>  '\\\\"',
		'/' =>  '\\\\/',
		'*' =>  '\\\\*',
		'$' =>  '\\\\$',
		'^' =>  '\\\\^',
		'\\' => '\\\\\\\\'
	]);
}
function searchDB_Field( $string ) {
   return "'".searchDB_DoubleEscape($string)."'";
}

function searchDB_TimeStamp( $timestamp ) {
   return $timestamp ? $timestamp : 0;
}


function _searchDB_Query( $query /*, $args*/ ) {
	_searchDB_Connect();

	//_db_DebugStartQuery($query);
	
	global $SearchDB;
	$ret = mysqli_real_query($SearchDB, $query);

	if ( $ret ) {
		return $ret;
	}
	_searchDB_DBError();
	return false;
}

function searchDB_Query( $query /*, ...$args*/ ) {
	if ( $ret = _searchDB_Query($query /*, $args*/) ) {
//		_db_DebugEndQuery($ret, $null);
		return $ret;
	}
	return false;
}

function searchDB_QueryFetch( $query /*, ...$args*/ ) {
	if ( _searchDB_Query($query /*, $args*/) ) {
//		_db_DebugEndQuery($ret, $null);
		return _searchDB_GetAssoc();
	}
	return false;
}
