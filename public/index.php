<?php
require_once __DIR__ . "/../db.php";
require_once __DIR__ . "/../lib.php";
?>
So. It has come to this...<br />
<br />
<?php

$berg = apcu_fetch( "Hamburg" );

if ( $berg === false ) {
	$berg = 1;
}
else {
	$berg++;
}

apcu_store( "Hamburg", $berg );

echo "Mr Berg: " . $berg . "<br />";

db_connect();
var_dump( db_isConnected() );

?>
