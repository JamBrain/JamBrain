<?php
require "../../lib/api.php";

// CMW API //

$out = array(
		'game' => 1
		);

$out['args'] = $_GET;

api_emitJSON( $out );

?>
