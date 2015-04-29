So. It has come to this...<br />
<br />
<?php

require "../db.php";
require "../lib.php";


$berg = apcu_fetch( "Hamburg" );

if ( $berg === false ) {
	$berg = 1;
}
else {
	$berg++;
}

apcu_store( "Hamburg", $berg );

echo "Mr Berg: " . $berg . "<br /";

db_connect();

var_dump( db_isConnected() );

echo "nemo";
?>