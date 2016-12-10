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
/// NOTE: This is an old function. I don't know if I sourced this, or wrote it myself. Not entirely sure I trust it.
/// mb_trim may not be needed, as trim will correctly remove standard whitespace. It's just the weird whitespace it wont.
//function mb_trim($str) {
//	// http://www.utf8-chartable.de/
//	// https://www.cs.tut.fi/~jkorpela/chars/spaces.html
//	// U+2800 - Braille blank \u2800
//	return preg_replace('/^[\pZ\pC]+|[\pZ\pC]+$/u','',$str);
//}


/// @name Sanitization, Validation, Slugification
// NOTE: Setting a default locale in the global scope!
setlocale(LC_ALL, "en_US.UTF-8");


function coreSanitize_String( $str ) {
	$str = mb_convert_encoding($str, 'UTF-8', 'UTF-8');				// Remove invalid UTF-8 characters

	// I'm not entirely sure which is best. this:
	//$str = filter_var($str, FILTER_SANITIZE_STRING);

	// Or this:
	$str = strip_tags($str);										// Remove any XML/HTML tags

//	$str = trim($str);												// Trim whitespace
	
	return $str;
}
function coreSanitize_Integer( $str ) {
	return intval(trim($str));
}
function coreSanitize_Float( $str ) {
	return floatval(trim($str));
}


function coreEncode_String( $str ) {
	// https://paragonie.com/blog/2015/06/preventing-xss-vulnerabilities-in-php-everything-you-need-know
	return htmlentities($str, ENT_QUOTES | ENT_HTML5, 'UTF-8');
}
// These were suggested by a comment in the PHP documentation, but I'm not entirely convinced
//	return htmlspecialchars($str);		// '<input value="'.htmlspecialchars($data).'" />'
//	return htmlentities($str);			// '<p>'.htmlentities($data).'</p>'


/// NOTE: Passwords should never be displayed, so this is a cleanup before hashing
function coreSanitize_Password( $str ) {
	$str = mb_convert_encoding($str, 'UTF-8', 'UTF-8');				// Remove invalid UTF-8 characters
	
	return $str;
}
function coreSanitize_Mail( $str ) {
	return filter_var(trim($str), FILTER_SANITIZE_EMAIL);
}
//function coreSanitize_URL( $str ) {
//}


function coreValidate_Mail( $str ) {
	return filter_var($str, FILTER_VALIDATE_EMAIL);
}
//function coreValidate_URL( $str ) {
//}


function coreSanitize_Title( $str ) {
	$str = mb_convert_encoding($str, 'UTF-8', 'UTF-8');				// Remove invalid UTF-8 characters
	$str = strip_tags($str);										// Remove any XML/HTML tags
	$str = trim($str);												// Trim whitespace
	
	return $str;
}
function coreSlugify_Title( $str ) {
	$symbols = ' \!-\&\(-\/\:-\@\[-\`\{-\~';						// Should be every ASCII symbol, except '
	
	$str = mb_convert_encoding($str, 'UTF-8', 'UTF-8');				// Remove invalid UTF-8 characters
	$str = iconv('UTF-8', 'ASCII//TRANSLIT//IGNORE', $str);			// Remove accents
	$str = strip_tags($str);										// Remove any XML/HTML tags
	$str = strtolower($str);										// To lower case
	$str = preg_replace('/[^a-z0-9'.$symbols.']/', '', $str);		// Keep only these
	$str = preg_replace('/['.$symbols.']+/', '-', $str);			// Replace symbols with a single dash
	$str = trim($str, '- ');										// Trim all dashes and spaces from the start and end
	
	return $str;
}


function coreSanitize_Name( $str ) {
	$str = mb_convert_encoding($str, 'UTF-8', 'UTF-8');				// Remove invalid UTF-8 characters
	$str = strip_tags($str);										// Remove any XML/HTML tags
	$str = preg_replace('/[^\p{Latin}0-9_.\- ]/u', '', $str);		// Latin, underscore, dot, dash, and space
	//$str = str_replace(' ', '_', $str);							// Spaces to underscores
	//$str = trim($str, '_.- ');									// Trim start and end
	$str = trim($str);												// Trim start and end
	
	return $str;
}
function coreSlugify_Name( $str ) {
	$str = mb_convert_encoding($str, 'UTF-8', 'UTF-8');				// Remove invalid UTF-8 characters
	$str = iconv('UTF-8', 'ASCII//TRANSLIT//IGNORE', $str);			// Remove accents, non-ascii characters
	$str = strip_tags($str);										// Remove any XML/HTML tags
	$str = strtolower($str);										// To lower case
	$str = preg_replace("/[^a-z0-9_.\- ]/", '', $str);				// Keep only these
	$str = preg_replace("/[_.\- ]+/", '-', $str);					// Replace symbols with a single dash
	$str = trim($str, '- ');										// Trim all dashes and spaces from the start and end
	
	return $str;
}

function coreSlugify_PathName( $str ) {
	// Node slugs must be > 0
	if ( !empty($str) && $str[0] == '$' ) {
		$id = intval(substr($str, 1));
		return ($id > 0 ? '$'.$id : '');
	}

	return coreSlugify_Name($str);
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
		$ret = ltrim(rtrim(filter_var($_SERVER['PATH_INFO'], FILTER_SANITIZE_URL), '/'), '/');
		if ( empty($ret) && $val !== '0' ) {
			return [''];
		}
		else {
			return array_values(array_filter(explode('/',$ret), function ($val) {
				return !((empty($val) && $val !== '0') || ($val[0] === '.'));
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
