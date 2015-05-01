<?php
// CMW API //

$out = array(
		'bort' => 17,
		'court' => 'westby',
		'zome' => array(
			'themby' => true,
			'chebble' => 'scorn'
			)
		);

$out['url'] = $_GET['u']

$out_format = 0;
if ( isset($_GET['pretty']) ) {
	$out_format |= JSON_PRETTY_PRINT;
} 

header('Content-Type: application/json');
echo json_encode($out,$out_format);

?>
