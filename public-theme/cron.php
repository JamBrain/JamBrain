<?php

if ( PHP_SAPI !== "cli" ) {
	header("HTTP/1.1 500 Internal Server Error");
	die;
}

echo "Stub\n";

// TODO: Set an event-node specific flag once the auto-associate process has completed
// (i.e. remember the process has been done)
