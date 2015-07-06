<?php
/** core/internal/util.php - Utilities Library.
@file
*/

// Get the API Action URL (single string with slashes) //
//function util_GetActionURL() {
//	if ( isset($_SERVER['PATH_INFO']) ) {
//		return $_SERVER['PATH_INFO'];
//	}
//	else {
//		return '/';
//	}
//}

// Parse the API Action URL (array of strings) //
function util_ParseActionURL() {
	// If PATH_INFO is set, then Apache figured out our parts for us //
	if ( isset($_SERVER['PATH_INFO']) ) {
		$ret = ltrim(rtrim($_SERVER['PATH_INFO'],'/'),'/');
		if ( empty($ret) )
			return [];
		else
			return explode('/',$ret);
	}

	// If not, we have to extract them from the REQUEST_URI //
	// Logic borrowed from here: https://coderwall.com/p/gdam2w/get-request-path-in-php-for-routing
	$request_uri = explode('/', trim($_SERVER['REQUEST_URI'], '/'));
    $script_name = explode('/', trim($_SERVER['SCRIPT_NAME'], '/'));
    $parts = array_diff_assoc($request_uri, $script_name);
    if (empty($parts)) {
        return [];
    }
	$path = implode('/', $parts);
	if (($position = strpos($path, '?')) !== FALSE) {
	    $path = substr($path, 0, $position);
	}
	$ret = ltrim(rtrim($path,'/'),'/');
	if ( empty($ret) )
		return [];
	else
		return explode('/',$ret);
}


function util_GetHTTPResponseText($code){
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

?>
