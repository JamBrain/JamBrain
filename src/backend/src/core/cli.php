<?php
/// If you're a CLI script (and you don't need root), include this.

if ( php_sapi_name() !== 'cli' ) {
	error_log("ERROR: CLI Only");
    exit(-2);
}
