<?php
require "../../lib/api.php";

// CMW API //

$out = api_newResponse();
$out['item'] = 1;

//$out['args'] = $_GET;
//$out['server'] = $_SERVER;
$out['parsed'] = api_parseActionURL();

api_emitJSON( $out );

?>
