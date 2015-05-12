<?php
require_once __DIR__ . "/../../lib.php";
require_once __DIR__ . "/../../db.php";

// Check for arguments, and exit immediately if none //

// retrieve session
user_start();

// if logged in, grab id, otherwise zero.

db_connect();

// if action == add
//    add/overwrite the like for id,user,ip
//    return success/failure

// if action == remove
//    remove like for id,user,ip
//    return success/failure

?>
