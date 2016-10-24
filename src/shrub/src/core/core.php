<?php
/// @addtomodule Core
/// @{
/// @name Language
/// Functions with names that match either core PHP APIs or the PHP language

/// Shorthand that does a print_r on data, removes newlines, and returns the result
function return_r( $data ) {
	return trim( preg_replace('/\s+/',' ',print_r($data, true)) );
}

/// Trim Spaces, Unicode Spaces, and Non-printables
function mb_trim($str) {
	// http://www.utf8-chartable.de/
	// https://www.cs.tut.fi/~jkorpela/chars/spaces.html
	// U+2800 - Braille blank \u2800
	return preg_replace('/^[\pZ\pC]+|[\pZ\pC]+$/u','',$str);
}

/// @name Whitelisting/Blacklisting
/// Shorthand function for checking against a list (whitelist, blacklist)
function core_OnList( $ip, $list ) {
	if ( is_string($list) ) {
		$list = [$list];
	}
	
	foreach ( $list as $item ) {
		if ( $item == $ip )
			return true;
	}
	
	return false;
}

/// @name Time
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

/// @name Paths
/// Handles "/./" and "/../" paths
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

/// @cond INTERNAL

/// Internal parser for the API request
function _core_GetAPIRequest() {
	// If PATH_INFO is set, then Apache figured out our parts for us //
	if ( isset($_SERVER['PATH_INFO']) ) {
		$ret = ltrim(rtrim(filter_var($_SERVER['PATH_INFO'],FILTER_SANITIZE_URL),'/'),'/');
		if ( empty($ret) ) {
			return [''];
		}
		else {
			return array_values(array_filter(explode('/',$ret),function ($val) {
				return !(empty($val) || ($val[0] === '.'));
			}));
		}
	}

	// If PATH_INFO isn't set, assume it's the same as '/'
	return [''];
}
/// @endcond

/// Parse the URL for the API request
/// @retval Array[String] Each element of the request path, or [""] if no path specified
function core_GetAPIRequest() {
	return core_RemovePathDotsFromArray(_core_GetAPIRequest());
}


/// @name HTTP
/// Convert response codes in to text
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
		405=>"Method Not Allowed",		// Invalid use of GET, POST, etc
		409=>"Conflict",				// **
		410=>"Gone",					//
		418=>"I'm a teapot (RFC 2324)",	//
		422=>"Unprocessable Entity",	// WebDAV; RFC 4918
		423=>"Locked",					// WebDAV; RFC 4918
		424=>"Failed Dependency",		// WebDAV; RFC 4918
		429=>"Too Many Requests",		// Rate Limiting
		// Server Error Responses
		500=>"Internal Server Error",	// Something is wrong on our end.
		501=>"Not Implemented",			// In Development
		503=>"Service Unavailable",		// Maintenence.
	];
	
	return $HTTP_RESPONSE_TEXT[$code];
}

//// - ----------------------------------------------------------------------------------------- - //
//// http://programanddesign.com/php/base62-encode/
//// MK: Removed 'cfituCFITU' to make it harder to generate F-bombs, S-bombs, and C-bombs //
//// "0123456789abcdefghjklmnopqrstvwxyzABCDEFGHJKLMNOPQRSTVWXYZ" 58
//// "0123456789abdeghjklmnopqrsvwxyzABDEGHJKLMNOPQRSVWXYZ" 52
//// "0123456789abdeghjkmnopqrsvwxyzABDEHJKLMNPQRVWXYZ" 48 (lGSO - Similar-to numbers removed: 1650)
//// - ----------------------------------------------------------------------------------------- - //
///**
// * Converts a base 10 number to any other base.
// * 
// * @param int $val   Decimal number
// * @param int $base  Base to convert to. If null, will use strlen($chars) as base.
// * @param string $chars Characters used in base, arranged lowest to highest. Must be at least $base characters long.
// * 
// * @return string    Number converted to specified base
// */
//function base48_Encode($val, $base=48, $chars='0123456789abdeghjkmnopqrsvwxyzABDEHJKLMNPQRVWXYZ') {
//    if(!isset($base)) $base = strlen($chars);
//    $str = '';
//    do {
//        $m = bcmod($val, $base);
//        $str = $chars[$m] . $str;
//        $val = bcdiv(bcsub($val, $m), $base);
//    } while(bccomp($val,0)>0);
//    return $str;
//}
//// - ----------------------------------------------------------------------------------------- - //
///**
// * Convert a number from any base to base 10
// * 
// * @param string $str   Number
// * @param int $base  Base of number. If null, will use strlen($chars) as base.
// * @param string $chars Characters use in base, arranged lowest to highest. Must be at least $base characters long.
// * 
// * @return int    Number converted to base 10
// */
//function base48_Decode($str, $base=48, $chars='0123456789abdeghjkmnopqrsvwxyzABDEHJKLMNPQRVWXYZ') {
//    if(!isset($base)) $base = strlen($chars);
//    $len = strlen($str);
//    $val = 0;
//    $arr = array_flip(str_split($chars));
//    for($i = 0; $i < $len; ++$i) {
//        $val = bcadd($val, bcmul($arr[$str[$i]], bcpow($base, $len-$i-1)));
//    }
//    return $val;
//}
//// - ----------------------------------------------------------------------------------------- - //
//function base48_Fix( $str, $chars='0123456789abdeghjkmnopqrsvwxyzABDEHJKLMNPQRVWXYZ' ) {
//	return preg_replace("/[^".$chars."]/", '', $str );
//}
//// - ----------------------------------------------------------------------------------------- - //

/// @}
