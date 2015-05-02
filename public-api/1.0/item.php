<?php
require "../../lib/api.php";

// CMW API //

$out = array(
		'game' => 1
		);

$out['args'] = $_GET;
//$out['server'] = $_SERVER;

api_emitJSON( $out, true );

?>
