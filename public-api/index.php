<?php
require "../lib/api.php";

// Default API (for catching errors). Never fails. //
$out = api_newResponse();

// Output the Page //
api_emitJSON( $out );

?>
