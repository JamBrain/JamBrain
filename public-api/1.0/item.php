<?php
require "../../lib/api.php";

// CMW API //

$out = array(
		'game' => 1
		);

$out['args'] = $_GET;
//$out['server'] = $_SERVER;
$out['parsed'] = api_parseURL();

api_emitJSON( $out, true );

?>
