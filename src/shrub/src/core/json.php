<?php
require_once __DIR__."/core.php";

/// @defgroup JSON
/// @brief JSON emitting module (typically for making APIs)
/// @ingroup Core

/// @addtogroup JSON
/// @{

/// Returns a response. It is empty. You should fill it with things.
///
/// 	$MyResponse = json_NewResponse();
/// 	$MyResponse['thing'] = "This is defifinitely a thing";
/// 	$MyResponse['other-thing'] = "Also a thing";
///
/// @param Integer $code (optional) Set an HTTP response code. See json_SetResponseCode.
/// @retval Array (empty)
function json_NewResponse( $code = null ) {
	json_SetResponseCode($code);
	return [];
}

/// Used to set the HTTP response code; Returns nothing
/// @param Integer $code (optional) Set an HTTP response code
/// All codes are supported, but the following are recommended:
/// * `200` (OK)
/// * `201` (Created) - If a resource was created
/// * `202` (Accepted) - Similar to 201, but processing hasn't finished (or started)
/// * `304` (Not Modified) - Action had no effect
/// * `500` (Internal Server Error) - When the server is unable to do the thing requested
/// http://stackoverflow.com/a/34324179/5678759
function json_SetResponseCode( $code = null ) {
	if ( is_numeric($code) ) {
		http_response_code($code);
	}
}

/// @}

/// @name HTTP Responses
/// @{

/// `200` (OK)
function json_RespondOK() {
	json_SetResponseCode(200);
}
/// `201` (Created) - If a resource was created
function json_RespondCreated() {
	json_SetResponseCode(201);
}
/// `202` (Accepted) - Similar to 201, but processing hasn't finished (or started)
function json_RespondAccepted() {
	json_SetResponseCode(202);
}
/// `304` (Not Modified) - Action had no effect
function json_RespondNotModified() {
	json_SetResponseCode(304);
}
/// `500` (Internal Server Error) - When the server is unable to do the thing requested
function json_RespondError() {
	json_SetResponseCode(500);
}
/// @}


/// @{

/// Returns an error response.
///
/// **NOTE:** This function creates responses.
/// If you are looking to emit errors, see #json_EmitError and #json_EmitServerError
///
/// @param Integer $code HTTP response code (default: 400 Bad Request)
/// @param String $msg (optional) Message
/// @param Multi $data (optional) Any data you wish to attach to the response
/// @retval Array
function json_NewErrorResponse( $code = 400, $msg = null, $data = null ) {
	// NOTE: $RESPONSE is not used here

	// Set the error code in the response header //
	$response = json_NewResponse($code);
	$response['response'] = core_GetHTTPResponseText($code);

	// Return the response //
	if ( is_string($msg) ) {
		$response['message'] = $msg;
	}
	if ( $data ) {
		$response['data'] = $data;
	}

	return $response;
}


/// Confirms that a string is a valid name for a JSON-P callback.
///
/// http://stackoverflow.com/questions/3128062/is-this-safe-for-providing-jsonp
///
/// @param String $name Callback name
/// @retval Boolean
function json_IsValidJSONPCallback($name) {
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
         && !in_array(mb_strtolower($name, 'UTF-8'), $reserved_words);
}

/// Emit an error document and **Exit**. Use this when the user makes a mistake.
///
/// @param Integer $code HTTP response code (default: 400).
/// All codes are supported, but the following are recommended:
/// * `400` (Bad Request)
/// * `401` (Unauthorized)
/// * `404` (Not Found)
/// @param String $msg (optional) Message
function json_EmitError( $code = 400, $msg = null, $data = null ) {
	json_Emit(json_newErrorResponse($code, $msg, $data));
}
function json_EmitFatalError( $code = 400, $msg = null, $data = null ) {
	json_Emit(json_newErrorResponse($code, $msg, $data));
	exit;
}


/// @}

/// @name Fatal Errors
/// @{

/// For most errors
function json_EmitFatalError_BadRequest( $msg = null, $data = null ) {
	json_EmitFatalError(400, $msg, $data);
}
/// For when something requires authorization
function json_EmitFatalError_Permission( $msg = null, $data = null ) {
	json_EmitFatalError(401, $msg, $data);
}
/// For when the server will never resolve a request (not even with authentication)
function json_EmitFatalError_Forbidden( $msg = null, $data = null ) {
	json_EmitFatalError(403, $msg, $data);
}
/// For when something was expected to be found, but wasn't
function json_EmitFatalError_NotFound( $msg = null, $data = null ) {
	json_EmitFatalError(404, $msg, $data);
}
/// For when the wrong method is used (POST vs GET, etc)
function json_EmitFatalError_BadMethod( $msg = null, $data = null ) {
	json_EmitFatalError(405, $msg, $data);
}
/// Like 404, but for when a previously known resource was found, but is now gone
function json_EmitFatalError_Gone( $msg = null, $data = null ) {
	json_EmitFatalError(410, $msg, $data);
}
/// When the server errors when it shouldn't
function json_EmitFatalError_Server( $msg = null, $data = null ) {
	json_EmitFatalError(500, $msg, $data);
}
/// When an action isn't yet implemented, and it's worth sharing this
function json_EmitFatalError_NotImplemented( $msg = null, $data = null ) {
	json_EmitFatalError(501, $msg, $data);
}
/// When the server is unavailable due to maintenence
function json_EmitFatalError_Unavailable( $msg = null, $data = null ) {
	json_EmitFatalError(503, $msg, $data);
}

/// @}

/// @{

/// Emit a JSON document.
///
/// Typically this is the last command in your document, but it doesn't have to be.
///
/// @param Array $out Response to output
/// @param Boolean $allow_jsonp Should JSON-P Callbacks be allowed? (Default: true)
function json_Emit( $out, $allow_jsonp = true ) {
	// For JSONP //
	$prefix = "";
	$suffix = "";

	// By default, PHP will make '/' slashes in to '\/'. These flags fix that //
	$out_format = JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES;

	// If 'pretty' mode (i.e. readable) //
	if ( isset($_GET['pretty']) ) {
		$out_format |= JSON_PRETTY_PRINT;
	}

	// JSON-P //
	if ( isset($_GET['callback']) ) {
		if ( $allow_jsonp ) {
			$callback = $_GET['callback'];
			if ( json_IsValidJSONPCallback($callback) ) {
				$prefix = $callback . "(";
				$suffix = ");";
			}
			else {
				$out = json_NewErrorResponse(400, "Invalid JSON-P Callback");
			}
		}
		else {
			$out = json_NewErrorResponse(401, "JSON-P Unavailable");
		}
	}

	// Prepend the status code //
	$out = ['status' => http_response_code()]+$out;

	// Debug Info //
	if ( defined('SH_PHP_DEBUG') && isset($_GET['debug']) ) {
		global $DEBUG;
		$out['debug'] = $DEBUG;

		if ( isset($GLOBALS['_CORE_SCRIPT_TIMER']) ) {
			$out['debug']['execute_time'] = core_MicrotimeToString($GLOBALS['_CORE_SCRIPT_TIMER']);
		}
		if (function_exists('db_GetQueryCount')) {
			$out['debug']['db_queries'] = db_GetQueryCount();
		}
		if (function_exists('cache_GetReads')) {
			$out['debug']['cache_reads'] = cache_GetReads();
			$out['debug']['cache_writes'] = cache_GetWrites();
		}
		if (function_exists('opcache_is_script_cached')) {
			// Technically, this is checking if "json.php" isn't cached //
			if (!opcache_is_script_cached(__FILE__)) {
				$out['debug']['opcache'] = "disabled";
			}
		}
		else {
			$out['debug']['opcache'] = "unavailable";
		}

		if ( isset($_SERVER['PATH_INFO']) ) {
			$out['debug']['url'] = $_SERVER['PATH_INFO'];
		}
		if ( getenv('REDIRECT_URL') ) {
			$out['debug']['redirect_url'] = getenv('REDIRECT_URL');
		}
		if ( getenv('REDIRECT_QUERY_STRING') ) {
			$out['debug']['redirect_query'] = getenv('REDIRECT_QUERY_STRING');
		}

		global $json_starttime;
		$json_endtime = microtime(true);
		$totaltime = $json_endtime - $json_starttime;

		$out['debug']['request_time'] = $totaltime;

		global $DB_DEBUG_DATA;
		$out['debug']['db_details'] = $DB_DEBUG_DATA;
	}

	// Output the Page
	header('Content-Type: application/json');
	header('Cache-Control: no-cache, no-store, must-revalidate'); // HTTP 1.1.
	//header("Pragma: no-cache"); // HTTP 1.0.
	//header("Expires: 0"); // Proxies.

	if ( isset($_SERVER['HTTP_ORIGIN']) ) {
		header('Access-Control-Allow-Origin: '.$_SERVER['HTTP_ORIGIN']);	// CORS: For 'fetch' with credentials, this can't be '*'
		header('Access-Control-Allow-Credentials: true');					// CORS: Allow cookies
	}
	else {
		header('Access-Control-Allow-Origin: *');
	}
	header('Access-Control-Allow-Headers: content-type');					// CORS: Allow requests that specify content-type

	echo $prefix, str_replace('</', '<\/', json_encode($out, $out_format)), $suffix;
}

/// @}

/// @name Simplified API calls
/// @{

/// Doesn't actually emit JSON, but emits a HEAD-only document
function json_EmitHeadAndExit() {
	header("Content-Length: 0");
	exit;
}
function json_EmitOptionsAndExit( $options ) {
	header("Access-Control-Allow-Methods: ".implode(", ", $options));
	header("Access-Control-Max-Age: ".(60*30));		// 30 minutes
	header("Content-Length: 0");
	exit;
}


/// After authenticating and loading globals, confirm that we're not in maintenence mode
function json_CheckForMaintenence() {
	global $SH, $RESPONSE;
	if ( !userAuth_IsAdmin() && !global_IsActive() ) {
		json_EmitFatalError_Unavailable( isset($SH['alert']) && strlen($SH['alert']) ? $SH['alert'] : null, $RESPONSE );
	}
}

function json_IsHTTPOptionsMethod() {
	return $_SERVER['REQUEST_METHOD'] == "OPTIONS";
}
function json_IsHTTPHeadMethod() {
	return $_SERVER['REQUEST_METHOD'] == "HEAD";
}
function json_IsValidHTTPMethod( ...$args ) {
	return in_array($_SERVER['REQUEST_METHOD'], $args);
}
function json_ValidateHTTPMethod( ...$args ) {
//	// If an OPTIONS request (CORS Preflight Request)
//	if ($_SERVER['REQUEST_METHOD'] === "OPTIONS" ) {
//		die;
//	}

	// Verify the method
	if ( !json_IsValidHTTPMethod(...$args) ) {
		json_EmitFatalError_BadMethod($_SERVER['REQUEST_METHOD']);
	}
}

function json_ArgGet($index = null) {
	global $REQUEST;
	if ( isset($index) ) {
		if ( isset($REQUEST[$index]) ) {
			return $REQUEST[$index];
		}
	}
	else {
		return $REQUEST;
	}
	return '';
}
function json_ArgShift() {
	global $REQUEST;
	return array_shift($REQUEST);
}
function json_ArgCount() {
	global $REQUEST;
	return count($REQUEST);
}

function json_Begin() {
	global $RESPONSE, $REQUEST;

	// Track starting time
	global $json_starttime;
	$json_starttime = microtime(true);

	if ( defined('SH_PHP_DEBUG') && isset($_GET['debug']) ) {
		// If debugging enabled, tell the system to track additional data.
		global $DB_ENABLE_DEBUG, $DEBUG;
		$DB_ENABLE_DEBUG = true;

		$DEBUG = [];
		$DEBUG['request_method'] = $_SERVER['REQUEST_METHOD'];
	}

	// Begin
	$RESPONSE = json_NewResponse();

	// Authenticate
	userAuth_Start();
	$RESPONSE['caller_id'] = userAuth_GetId();

//	if ( isset($_GET['auth']) || isset($_GET['debug']) ) {
//		// Need to limit what keys get copied. No need to send a full user (or accidentilaly send private info)
//		$keys = ['id'];//,'admin','permission'];
//		$RESPONSE['auth'] = array_intersect_key($_SESSION, array_flip($keys));
//	}

	// Load Globals
	global_Load();

	json_CheckForMaintenence();

	// Parse Arguments
	$REQUEST = core_GetAPIRequest();
//	if ( isset($_GET['request']) || isset($_GET['debug']) ) {
//		$RESPONSE['request'] = $REQUEST;
//	}
}

function json_End() {
	global $RESPONSE;

	// Emit Response
	json_Emit( $RESPONSE );
}

/// @}
