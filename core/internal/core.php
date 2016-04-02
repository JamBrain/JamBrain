<?php
/** @file core.php 
	@brief Starship Helpers
*/

include_once __DIR__ . "/../../config.php";	// Configuration and Settings //

// Pads 1-digit numbers with a 0 //
function PADNUM( $number ) {
	if ( $number >= 0 && $number < 10 ) {
		return "0".$number;
	}
	return "".$number;
}

// Convert MySQL date strings to ISO format //
function MYSQL_ISO_FORMAT($field) {
	return "DATE_FORMAT(".$field.",'%Y-%m-%dT%TZ') AS ".$field;
}

// Shorthand that does a print_r on data, removes newlines, and returns the result //
function return_r( $data ) {
	return trim(preg_replace('/\s+/',' ',print_r( $data, true)));
}

// Trim Spaces, Unicode Spaces, and Non-printables //
function mb_trim($str) {
	// http://www.utf8-chartable.de/
	// https://www.cs.tut.fi/~jkorpela/chars/spaces.html
	// U+2800 - Braille blank \u2800
	return preg_replace('/^[\pZ\pC]+|[\pZ\pC]+$/u','',$str);
}

// Shorthand function for checking a configuration whitelist //
function core_OnWhitelist( $ip, $list ) {
	if ( is_string($list) ) {
		$list = [$list];
	}
	
	foreach ( $list as $item ) {
		if ( $item == $ip )
			return true;
	}
	
	return false;
}

function core_MicrotimeToString($time) {
	$timediff = microtime(true) - $time;
	
	if ( $timediff < 1.0 )
		return number_format( $timediff * 1000.0, 2 ) . ' ms';
	else if ( $timediff === 1.0 )
		return "1 second";
	return number_format( $timediff, 4 ) . ' seconds';
}

function core_GetExecutionTime() {
	global $_CORE_SCRIPT_TIMER;
	
	$timediff = microtime(true) - $_CORE_SCRIPT_TIMER;
	
	if ( $timediff < 1.0 )
		return number_format( $timediff * 1000.0, 2 ) . ' ms';
	else if ( $timediff === 1.0 )
		return "1 second";
	return number_format( $timediff, 4 ) . ' seconds';
}

// Handles "/./" and "/../" paths
function core_RemovePathDotsFromArray($arr) {
	// http://stackoverflow.com/a/14883803/5678759
	$parents = [];
	foreach( $arr as $dir ) {
		switch( $dir ) {
			case '.':
				// Don't need to do anything here
			break;
			case '..':
				array_pop( $parents );
			break;
			default:
				$parents[] = $dir;
			break;
		}
	}
	return $parents;
}

// Parse the API Action URL (array of strings) //
function _core_ParseActionURL() {
	// If PATH_INFO is set, then Apache figured out our parts for us //
	if ( isset($_SERVER['PATH_INFO']) ) {
		$ret = ltrim(rtrim(filter_var($_SERVER['PATH_INFO'],FILTER_SANITIZE_URL),'/'),'/');
		if ( empty($ret) )
			return [];
		else
			return array_values(array_filter(explode('/',$ret),function ($val) {
				return !(empty($val) || ($val[0] === '.'));
			}));
	}

	// If not, we have to extract them from the REQUEST_URI //
	// Logic borrowed from here: https://coderwall.com/p/gdam2w/get-request-path-in-php-for-routing
	$request_uri = explode('/', trim(filter_var($_SERVER['REQUEST_URI'],FILTER_SANITIZE_URL), '/'));
    $script_name = explode('/', trim(filter_var($_SERVER['SCRIPT_NAME'],FILTER_SANITIZE_URL), '/'));
    $parts = array_diff_assoc($request_uri, $script_name);
    if (empty($parts)) {
        return [];
    }
	$path = implode('/', $parts);
	if (($position = strpos($path, '?')) !== FALSE) {
	    $path = substr($path, 0, $position);
	}
	$ret = ltrim(rtrim($path,'/'),'/');
	if ( empty($ret) ) {
		return [];
	}
	else {
		return array_values(array_filter(explode('/',$ret),function ($val) {
			return !(empty($val) || ($val[0] === '.'));
		}));
	}
}
// Wrapping this so we can sanitize further //
function core_ParseActionURL() {
	return core_RemovePathDotsFromArray(_core_ParseActionURL());
}

// Convert response codes in to text //
function core_GetHTTPResponseText($code){
	static $HTTP_RESPONSE_TEXT = [
		// Success Responses
		200=>"OK",
		201=>"Created",					// Successfully created.
		202=>"Accepted",				// Request accepted, will be fullfilled later.
		// Redirect Respones
		301=>"Moved Permanently",		// Redirections.
		304=>"Not Modified",			// ** 
		// User Error Responeses
		400=>"Bad Request",				// Syntax Error.
		401=>"Unauthorized",			// Insufficent permission to do something
		403=>"Forbidden",				// ** Resource is protected.
		404=>"Not Found",				// Resource not found.
		409=>"Conflict",				// **
		412=>"Precondition Failed",		// **
		// Server Error Responses
		500=>"Internal Server Error",	// Something is wrong on our end.
		503=>"Service Unavailable",		// Maintenence.
	];
	
	return $HTTP_RESPONSE_TEXT[$code];
}

// - ----------------------------------------------------------------------------------------- - //
// http://programanddesign.com/php/base62-encode/
// MK: Removed 'cfituCFITU' to make it harder to generate F-bombs, S-bombs, and C-bombs //
// "0123456789abcdefghjklmnopqrstvwxyzABCDEFGHJKLMNOPQRSTVWXYZ" 58
// "0123456789abdeghjklmnopqrsvwxyzABDEGHJKLMNOPQRSVWXYZ" 52
// "0123456789abdeghjkmnopqrsvwxyzABDEHJKLMNPQRVWXYZ" 48 (lGSO - Similar-to numbers removed: 1650)
// - ----------------------------------------------------------------------------------------- - //
/**
 * Converts a base 10 number to any other base.
 * 
 * @param int $val   Decimal number
 * @param int $base  Base to convert to. If null, will use strlen($chars) as base.
 * @param string $chars Characters used in base, arranged lowest to highest. Must be at least $base characters long.
 * 
 * @return string    Number converted to specified base
 */
function base48_Encode($val, $base=48, $chars='0123456789abdeghjkmnopqrsvwxyzABDEHJKLMNPQRVWXYZ') {
    if(!isset($base)) $base = strlen($chars);
    $str = '';
    do {
        $m = bcmod($val, $base);
        $str = $chars[$m] . $str;
        $val = bcdiv(bcsub($val, $m), $base);
    } while(bccomp($val,0)>0);
    return $str;
}
// - ----------------------------------------------------------------------------------------- - //
/**
 * Convert a number from any base to base 10
 * 
 * @param string $str   Number
 * @param int $base  Base of number. If null, will use strlen($chars) as base.
 * @param string $chars Characters use in base, arranged lowest to highest. Must be at least $base characters long.
 * 
 * @return int    Number converted to base 10
 */
function base48_Decode($str, $base=48, $chars='0123456789abdeghjkmnopqrsvwxyzABDEHJKLMNPQRVWXYZ') {
    if(!isset($base)) $base = strlen($chars);
    $len = strlen($str);
    $val = 0;
    $arr = array_flip(str_split($chars));
    for($i = 0; $i < $len; ++$i) {
        $val = bcadd($val, bcmul($arr[$str[$i]], bcpow($base, $len-$i-1)));
    }
    return $val;
}
// - ----------------------------------------------------------------------------------------- - //
function base48_Fix( $str, $chars='0123456789abdeghjkmnopqrsvwxyzABDEHJKLMNPQRVWXYZ' ) {
	return preg_replace("/[^".$chars."]/", '', $str );
}
// - ----------------------------------------------------------------------------------------- - //
