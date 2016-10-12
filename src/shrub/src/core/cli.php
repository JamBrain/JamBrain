<?php
// If you're a CLI script, include this.

if ( php_sapi_name() !== 'cli' ) {
	error_log("ERROR: CLI Only");
    exit(-2);
}
