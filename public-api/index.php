<?php
require "../lib/api.php";

// Default API (for catching errors). Never fails. //
$out = array(
	'status' => 'OK'
);

// Output the Page //
api_emitJSON( $out, true );

?>
