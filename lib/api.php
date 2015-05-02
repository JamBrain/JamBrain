<?php

// http://stackoverflow.com/questions/3128062/is-this-safe-for-providing-jsonp
function api_isValidJSONPCallback($subject) {
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
function api_getActionURL() {
	if ( isset($_SERVER['PATH_INFO']) ) {
		return $_SERVER['PATH_INFO'];
	}
	else {
		return '/';
	}
}

// Parse the API Action URL (array of strings) //
function api_parseActionURL() {
	if ( isset($_SERVER['PATH_INFO']) ) {
		return explode('/',ltrim(rtrim($_SERVER['PATH_INFO'],'/'),'/'));
	}
	else {
		return array();
	}
}

function api_emitJSON( $out, $debug=false ) {
	// By default, PHP will make '/' slashes in to '\/'. These flags fix that //
	$out_format = JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES;
	
	// If 'pretty' mode (i.e. readable) //
	if ( isset($_GET['pretty']) ) {
		$out_format |= JSON_PRETTY_PRINT;
	}
	
	// Debug Info //
	if ( $debug ) {
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
	
	// JSONp //
	$prefix = "";
	$suffix = "";
	if ( isset($_GET['callback']) ) {
		$callback = $_GET['callback'];
		if ( api_isValidJSONPCallback($callback) ) {
			$prefix = $callback . "(";
			$suffix = ");";
		}
		else {
			http_response_code(400);
			$out = array( 'status' => 'ERROR' );
			//exit(1);
		}
	}
	
	// Output the Page //
	header('Content-Type: application/json');
	echo $prefix . str_replace('</', '<\/', json_encode($out,$out_format)) . $suffix;
}

?>
