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
	

header('Content-Type: application/json');
echo json_encode($out,JSON_PRETTY_PRINT);

?>
