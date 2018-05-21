<?php
require_once __DIR__."/core.php";
require_once __DIR__."/json.php";
require_once __DIR__."/ratelimit.php";

/// @defgroup API
/// @brief API Framework - Accept a data structure describing API calls and dispatch the call appropriately.
/// @ingroup Core

/// @addtogroup API
/// @{

const API_GET = 		0x0001; // Require API call to use GET method
const API_POST = 		0x0002; // Require API call to use POST method
const API_AUTH = 		0x0004; // Require calling user to be authenticated.


const API_CHARGE_0 = 	0;	// Do not interact with the rate limit system before dispatching this API call
const API_CHARGE_1 = 	1;	// Charge a single unit to the rate limit system for this call, and bail early if there is not enough credit.

/// Handles an API request by dispatching it to the appropriate handler in the passed-in table.
/// The table contains the API name, flags declaring usage requirements, the rate limiting charge, and a function that will handle the API request.
/// Available flags are API_GET, API_POST, API_AUTH
///
/// 	api_Exec([
/// 		["unread/count", API_GET | API_AUTH, API_CHARGE_1, function(&$RESPONSE) {
///				// Interact with $RESPONSE or such
///			}],
///			...
///		]);
///
/// @param List of API entries
/// @retval None
function api_Exec( $apidesc ) {
	json_Begin();
	global $REQUEST, $RESPONSE;

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
	$fullpathlen = strlen($fullpath);

	// Find first matching API record
	$apiused = null;
	foreach ( $apidesc as $api ) {
		$pathlength = strlen($api[0]);

		// If the prefix matches, further confirm that the path is the entire string, or followed by a /
		if ( (strncmp($fullpath, $api[0], $pathlength) == 0) &&
			(($fullpathlen == $pathlength) || (substr($fullpath, $pathlength, 1) == "/")) ) {

			// This API request is the one we'll handle.
			$apiused = $api;
			$GLOBALS["API_NAME"] = $api[0]; // Used later for accumulating statistics per API.

			// Pull arguments off the request stack based on the number of elements in the request.
			// Skip one though, as we added an artificial element for the filename.
			$segments = explode("/", $api[0]);
			for ( $i = 1; $i < count($segments); $i++ )	{
				json_ArgShift();
			}

			// Require a GET or POST flag
			$flags = $api[1];
			if ( $flags & API_GET ) {
				if ( $flags & API_POST ) {
					// note EmitFatalError calls exit; and don't continue executing.
					json_EmitFatalError("API record must not have both GET and POST flags.", $RESPONSE);
				}
				json_ValidateHTTPMethod('GET');
			}
			else {
				if ( $flags & API_POST ) {
					json_ValidateHTTPMethod('POST');
				}
				else {
					json_EmitFatalError("API record must have one of GET or POST flags.", $RESPONSE);
				}
			}

			if ( $flags & API_AUTH ) {
				// Require user to be authenticated.
				if ( !userAuth_GetID() ) {
					json_EmitFatalError_Permission("User must be logged in to access this resource.", $RESPONSE);
				}
			}

			// Charge the user's pool based on the rate limiting settings
			$ratelimit = $api[2];
			if ( $ratelimit ) {
				if ( !rateLimit_Charge($ratelimit) ) {
					json_EmitFatalError_Permission("Rate limit exceeded. Please try again later.", $RESPONSE);
				}
				$RESPONSE['rate_limit'] = ['cost' => $ratelimit, 'remaining' => rateLimit_RemainingCharge()];
			}


			// Pass control on to the method specified in the API definition to do the work.
			$function = $api[3];

			$function($RESPONSE);

			break;
		}
	}

	if ( $apiused == null )	{
		// No path matched.
		json_EmitFatalError_Forbidden(null, $RESPONSE);
	}

	json_End();
}

/// @}
