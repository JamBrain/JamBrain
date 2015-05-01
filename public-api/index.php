<?php
// CMW API //

if ( isset($_GET['e']) ) {
	
}

$out = array(
	'bort' => 17,
	'court' => 'westby',
	'zome' => array(
		'themby' => true,
		'chebble' => 'scorn'
		)
	);

$out['args'] = $_GET;

if ( isset($_GET['u']) ) {
	$out['url'] = $_GET['u'];
}

$out['env'] = getenv('REDIRECT_QUERY_STRING');

$out_format = 0;
if ( isset($_GET['pretty']) ) {
	$out_format |= JSON_PRETTY_PRINT;
} 

header('Content-Type: application/json');
echo json_encode($out,$out_format);

?>
