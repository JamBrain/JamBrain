<?php
// CMW API //

$out = array(
		'game' => 1
		);

$out['args'] = $_GET;

$out_format = 0;
if ( isset($_GET['pretty']) ) {
	$out_format |= JSON_PRETTY_PRINT;
} 

header('Content-Type: application/json');
echo json_encode($out,$out_format);

?>
