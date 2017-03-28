<?php

// http://stackoverflow.com/a/9535967/5678759
function make_slug( $string, $separator = '-' ) {
//	$accents_regex = '~&([a-z]{1,2})(?:acute|cedil|circ|grave|lig|orn|ring|slash|th|tilde|uml);~i';
//	$special_cases = array( '&' => 'and', "'" => '');
	$string = mb_strtolower( trim( $string ), 'UTF-8' );
//	$string = str_replace( array_keys($special_cases), array_values( $special_cases), $string );
//	$string = preg_replace( $accents_regex, '$1', htmlentities( $string, ENT_QUOTES, 'UTF-8' ) );
	$string = preg_replace("/%[a-f0-9]{2}/u", "$separator", $string);
	$string = preg_replace("/[^a-z0-9]/u", "$separator", $string);
	$string = preg_replace("/[$separator]+/u", "$separator", $string);
	$string = trim($string, "$separator");
	return $string;
}

$URL = strtok( isset($_SERVER['PATH_INFO']) ? $_SERVER['PATH_INFO'] : $_SERVER['REQUEST_URI'], '?' );

$URL_PARTS = explode('/',ltrim($URL,'/'));
foreach ( $URL_PARTS as &$PART ) {
	$PART = make_slug($PART);
}
