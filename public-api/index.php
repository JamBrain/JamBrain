<?php
require "../lib/api.php";

// Default API (for catching errors). Never fails. //
$out = array(
	'status' => 'OK'
);


// TODO: Disable this on the real server //
$url = getenv('REDIRECT_URL');
if ( $url ) {
	$out['debug'] = array();
	$out['debug']['url'] = $url;
}
$query = getenv('REDIRECT_QUERY_STRING');
if ( $query ) {
	$out['debug']['query'] = $query;
}


// Output the Page //
api_emitJSON( $out );

?>
