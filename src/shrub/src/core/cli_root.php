<?php
/// If you're a CLI script that requires root access to run, include this.

if ( php_sapi_name() !== 'cli' ) {
	error_log("ERROR: CLI Only");
    exit(-2);
}

if (posix_getuid() != 0) {
    error_log("ERROR: Requires root");
    exit(-3);
}
