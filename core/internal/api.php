<?php
// Support library for web APIs (emitting JSON) //

include_once __DIR__ . "/../../config.php";

/**
 *	Confirms if a string is a valid name for a JSON-P callback.
 *
 *	http://stackoverflow.com/questions/3128062/is-this-safe-for-providing-jsonp
 *
 *	@param {String} $name Desired callback name
 *  @returns {Boolean} 
**/
function api_IsValidJSONPCallback($name) {
     $identifier_syntax
       = '/^[$_\p{L}][$_\p{L}\p{Mn}\p{Mc}\p{Nd}\p{Pc}\x{200C}\x{200D}]*+$/u';

     $reserved_words = ['break', 'do', 'instanceof', 'typeof', 'case',
       'else', 'new', 'var', 'catch', 'finally', 'return', 'void', 'continue', 
       'for', 'switch', 'while', 'debugger', 'function', 'this', 'with', 
       'default', 'if', 'throw', 'delete', 'in', 'try', 'class', 'enum', 
       'extends', 'super', 'const', 'export', 'import', 'implements', 'let', 
       'private', 'public', 'yield', 'interface', 'package', 'protected', 
       'static', 'null', 'true', 'false'];

     return preg_match($identifier_syntax, $name)
         && ! in_array(mb_strtolower($name, 'UTF-8'), $reserved_words);
}

// Get the API Action URL (single string with slashes) //
function api_GetActionURL() {
	if ( isset($_SERVER['PATH_INFO']) ) {
		return $_SERVER['PATH_INFO'];
	}
	else {
		return '/';
	}
}

// Parse the API Action URL (array of strings) //
function api_ParseActionURL() {
	if ( isset($_SERVER['PATH_INFO']) ) {
		return explode('/',ltrim(rtrim($_SERVER['PATH_INFO'],'/'),'/'));
	}
	else {
		return [];
	}
}

$HTTP_RESPONSE_TEXT = [
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

// At the top of an API program, use newResponse to create an array //
function api_NewResponse() {
	return [];
}

// On error, overwrite your response with an error //
function api_NewError( $code = 400, $msg = null ) {
	global $HTTP_RESPONSE_TEXT;
	
	http_response_code($code);
	if ( is_string($msg) ) {
		return [
			'status' => $code,
			'response' => $HTTP_RESPONSE_TEXT[$code],
			'message' => $msg
		];
	}
	else {
		return [
			'status' => $code,
			'response' => $HTTP_RESPONSE_TEXT[$code]
		];
	}
}


// Finally, at the bottom of your API program, emit the 
function api_EmitJSON( $out, $allow_jsonp = true ) {
	// By default, PHP will make '/' slashes in to '\/'. These flags fix that //
	$out_format = JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES;
	
	// If 'pretty' mode (i.e. readable) //
	if ( isset($_GET['pretty']) ) {
		$out_format |= JSON_PRETTY_PRINT;
	}
	
	// JSON-P //
	if ( $allow_jsonp ) {
		$prefix = "";
		$suffix = "";
		if ( isset($_GET['callback']) ) {
			$callback = $_GET['callback'];
			if ( api_IsValidJSONPCallback($callback) ) {
				$prefix = $callback . "(";
				$suffix = ");";
			}
			else {
				$out = api_NewError(400);
			}
		}
	}
		
	// Debug Info //
	if ( defined('CMW_PHP_DEBUG') && isset($_GET['debug']) ) {
		$out['debug'] = [];
		
		if ( isset($_SERVER['PATH_INFO']) ) {
			$out['debug']['url'] = $_SERVER['PATH_INFO'];
		}
		if ( getenv('REDIRECT_URL') ) {
			$out['debug']['redirect_url'] = getenv('REDIRECT_URL');
		}
		if ( getenv('REDIRECT_QUERY_STRING') ) {
			$out['debug']['redirect_query'] = getenv('REDIRECT_QUERY_STRING');
		}
	}
	
	// Output the Page //
	header('Content-Type: application/json');
	echo $prefix,str_replace('</', '<\/', json_encode($out,$out_format)),$suffix;
}

// All-In-One failure function for APIs //
function api_EmitErrorAndExit( $code = 400, $msg = null ) {
	api_EmitJSON(api_newError($code,$msg));
	exit;
}

function api_EmitServerError( $msg = null ) {
	api_EmitJSON(api_newError(500,$msg));
	exit;
}

?>
