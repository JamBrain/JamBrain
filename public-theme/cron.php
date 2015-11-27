<?php

if ( PHP_SAPI !== "cli" ) {
	header("HTTP/1.1 500 Internal Server Error");
	die;
}

echo "Stub\n";
