<?php
include_once __DIR__ . "/../../config.php";

// Support library for web APIs (emitting JSON) //

// http://stackoverflow.com/questions/3128062/is-this-safe-for-providing-jsonp
function api_IsValidJSONPCallback($subject) {
     $identifier_syntax
       = '/^[$_\p{L}][$_\p{L}\p{Mn}\p{Mc}\p{Nd}\p{Pc}\x{200C}\x{200D}]*+$/u';

     $reserved_words = array('break', 'do', 'instanceof', 'typeof', 'case',
       'else', 'new', 'var', 'catch', 'finally', 'return', 'void', 'continue', 
       'for', 'switch', 'while', 'debugger', 'function', 'this', 'with', 
       'default', 'if', 'throw', 'delete', 'in', 'try', 'class', 'enum', 
       'extends', 'super', 'const', 'export', 'import', 'implements', 'let', 
       'private', 'public', 'yield', 'interface', 'package', 'protected', 
       'static', 'null', 'true', 'false');

     return preg_match($identifier_syntax, $subject)
         && ! in_array(mb_strtolower($subject, 'UTF-8'), $reserved_words);
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
		return array();
	}
}

// At the top of an API program, use newResponse to create an array //
function api_NewResponse( $msg = 'OK' ) {
	return array('status' => $msg);
}

// On error, overwrite your response with an error //
function api_NewError( $code = 400, $msg = 'ERROR' ) {
	http_response_code($code);
	return array( 'status' => $msg );
}


// Finally, at the bottom of your API program, emit the 
function api_EmitJSON( $out ) {
	// By default, PHP will make '/' slashes in to '\/'. These flags fix that //
	$out_format = JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES;
	
	// If 'pretty' mode (i.e. readable) //
	if ( isset($_GET['pretty']) ) {
		$out_format |= JSON_PRETTY_PRINT;
	}
	
	// JSONP //
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
		
	// Debug Info //
	if ( (!isset($cfg_no_debug) || !$cfg_no_debug) && isset($_GET['debug']) ) {
		$out['debug'] = array();
		
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
	echo $prefix . str_replace('</', '<\/', json_encode($out,$out_format)) . $suffix;
}

// All-In-One failure function for APIs //
function api_EmitErrorAndExit( $code = 400, $msg = 'ERROR' ) {
	api_emitJSON(api_newError($code,$msg));
	exit;
}

?>
