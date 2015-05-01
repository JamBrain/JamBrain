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

$out['url'] = $_GET['u'];
$out['args'] = $_GET;
$out['phil'] = $_ENV('REDIRECT_QUERY_STRING');

$out_format = 0;
if ( isset($_GET['pretty']) ) {
	$out_format |= JSON_PRETTY_PRINT;
} 

header('Content-Type: application/json');
echo json_encode($out,$out_format);

?>
