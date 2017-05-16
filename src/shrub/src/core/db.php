<?php
include __DIR__."/db_mysql.php";
include __DIR__."/db_query.php";

function db_Echo($QUERY, ...$ARGS) {
	echo $QUERY."\n";
	print_r($ARGS);
}
