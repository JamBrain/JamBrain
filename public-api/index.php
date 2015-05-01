<?php
// Default API (for catching errors). Never fails. //
$out = array(
	'status' => 'OK'
);

// TODO: Disable the redirect info on the real server //

$url = getenv('REDIRECT_URL');
if ( $url )
	$out['url'] = $url;

$query = getenv('REDIRECT_QUERY_STRING');
if ( $query )
	$out['query'] = $query;


// By default, PHP will make '/' slashes in to '\/'. These flags fix that //
$out_format = JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES;
// If 'pretty' mode (i.e. readable) //
if ( isset($_GET['pretty']) ) {
	$out_format |= JSON_PRETTY_PRINT;
} 


// Output the Page //
header('Content-Type: application/json');
echo str_replace('</', '<\/', json_encode($out,$out_format));

?>
