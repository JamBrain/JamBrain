So. It has come to this...<br />
<br />
<?php

include "../db.php";
include "../lib.php";


$berg = apcu_fetch( "Hamburg" );

if ( $berg === false ) {
	$berg = 1;
}
else {
	$berg++;
}

apcu_store( "Hamburg", $berg );

echo "Mr Berg: " . $berg;

echo "<br />";

db_connect();
echo "<br/>DB Active: " . db_isConnected();

?>