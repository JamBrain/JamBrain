<?php
require_once __DIR__ . "/../../api.php";

// CMW API //

$out = api_NewResponse();
$out['item'] = 1;

//$out['args'] = $_GET;
//$out['server'] = $_SERVER;
$out['parsed'] = api_ParseActionURL();

api_EmitJSON( $out );
?>
