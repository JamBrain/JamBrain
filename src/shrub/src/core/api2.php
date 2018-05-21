<?php
require_once __DIR__."/core.php";
require_once __DIR__."/json.php";
//require_once __DIR__."/ratelimit.php";

/// @defgroup API2
/// @brief API Framework - Accept a data structure describing API calls and dispatch the call appropriately.
/// @ingroup Core

/// @addtogroup API2
/// @{

const API_GET = 				0x00000001; // Require API call to use GET (or HEAD) method
const API_POST = 				0x00000002; // Require API call to use POST method
const API_PUT = 				0x00000004; // Require API call to use PUT method
const API_PATCH = 				0x00000008; // Require API call to use PATCH method
const API_DELETE = 				0x00000010; // Require API call to use DELETE method
//const API_CONNECT = 			0x00000020; // Require API call to use CONNECT method
//const API_TRACE = 			0x00000040; // Require API call to use TRACE method
//const API_HEAD = 				0x00000100; // Require API call to use HEAD method (NOTE: implied by GET)
//const API_OPTIONS = 			0x00000200; // Require API call to use OPTIONS method (NOTE: Handled automatically)

const API_AUTH = 				0x00001000; // Require calling user to be authenticated.

const API_COST_NONE =			0x00000000;
const API_COST_NORMAL =			0x00100000;
const API_COST_SEARCH =			0x00200000;


function api_DecodeHTTPBitmask( $mask ) {
	$ret = [];

	if ( $mask & API_GET ) {
		$ret[] = "GET";
		$ret[] = "HEAD";
	}
	if ( $mask & API_POST )
		$ret[] = "POST";
	if ( $mask & API_PUT )
		$ret[] = "PUT";
	if ( $mask & API_PATCH )
		$ret[] = "PATCH";
	if ( $mask & API_DELETE )
		$ret[] = "DELETE";

	return $ret;
}


/// WARNING: Implementing `feed` and `feed/me` will only work if they are in reverse order (`feed` is last).

function api_Exec( $api_descriptor ) {
	json_Begin();
	global $REQUEST, $RESPONSE, $DEBUG;

	// Determine API file name from script filename (.../somefile.php)
	// This should be reliable in all cases.
	$pathparts = explode("/", $_SERVER['SCRIPT_NAME']);
	$filename = "";
	$file = $pathparts[count($pathparts)-1];
	if ( substr($file, -4) != ".php") {
		json_EmitFatalError("Unable to determine filename for API.", $RESPONSE);
	}
	$filename = substr($file, 0, strlen($file) - 4);

	// Reconstruct the full request path (from sanitized request array) to match against the API prefixes.
	$fullpath = $filename . "/" . implode("/", $REQUEST);
	$fullpath_length = strlen($fullpath);

	// Find first matching API record
	$api_used = null;
	$api_found = null;
	$api_allowed = [];
	foreach ( $api_descriptor as $api ) {
		$api_base = $api[0];
		$api_flags = $api[1];
		$api_function = $api[2];

		$api_length = strlen($api_base);

		// If the prefix matches, confirm that the path is the entire string or followed by a /
		if ( (strncmp($fullpath, $api_base, $api_length) == 0) && (($fullpath_length == $api_length) || (substr($fullpath, $api_length, 1) == "/")) ) {
			// In the unlikely case that we found a name match, from here on only consider name matches to be valid
			if ( $api_found && ($api_found[0] != $api[0]) )
				continue;

			// Note that the API was found (not necessarily that it was used
			$api_found = $api;

			// Decode the HTTP method bitflags as an array of strings, and store it for later (in case of an OPTIONS request)
			$api_methods = api_DecodeHTTPBitmask($api_flags);
			$api_allowed = array_merge($api_allowed, $api_methods);

			// Next, confirm that HTTP method being requested matches the method we handle here
			if ( !json_IsValidHTTPMethod(...$api_methods) )
				continue;

			$DEBUG['api_base'] = $api_base;

			// Yes, this API request is the one we will handle
			$api_used = $api;
			$GLOBALS["API_NAME"] = $api_base; // Used later for accumulating statistics per API.

			// Pull arguments off the request stack based on the number of elements in the request.
			// Skip one though, as we added an artificial element for the filename.
			$segments = explode("/", $api_base);
			for ( $i = 1; $i < count($segments); $i++ )	{
				json_ArgShift();
			}

			// Require user to be authenticated.
			if ( ($api_flags & API_AUTH) && !userAuth_GetID() ) {
				json_EmitFatalError_Permission("You must be authenticated in to access this resource", $RESPONSE);
			}

			// Charge the user's pool based on the rate limiting settings
//			$ratelimit = $api[2];
//			if ( $ratelimit ) {
//				if ( !rateLimit_Charge($ratelimit) ) {
//					json_EmitFatalError_Permission("Rate limit exceeded. Please try again later.", $RESPONSE);
//				}
//				$RESPONSE['rate_limit'] = ['cost' => $ratelimit, 'remaining' => rateLimit_RemainingCharge()];
//			}


			// Call the API function
			$api_function($RESPONSE, json_IsHTTPHeadMethod());

			break;
		}
	}

	if ( $api_used == null ) {
		if ( $api_found ) {
			if ( json_IsHTTPOptionsMethod() ) {
				// If it's an OPTIONS request, emit an OPTIONS response
				json_EmitOptionsHeaders($api_allowed);
				exit;
			}
			else {
				// API was found, but not used
				json_EmitFatalError_BadMethod($_SERVER['REQUEST_METHOD'], $RESPONSE);
			}
		}
		else {
			// API was not found
			json_EmitFatalError_Forbidden(null, $RESPONSE);
		}
	}

	// Finished
	json_End();
}

/// @}
