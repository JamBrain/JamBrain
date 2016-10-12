<?php
// If the CLI script should require root access to run, include this.

if (posix_getuid() != 0) {
    error_log("ERROR: Requires root");
    exit(-3);
}
