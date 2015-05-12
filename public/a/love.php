<?php
// Check for arguments, and exit immediately if none //

// retrieve session
session_start();

// if logged in, grab id, otherwise zero.

require_once __DIR__ . "/../../db.php";

db_connect();

// if action == add
//    add/overwrite the like for id,user,ip
//    return success/failure

// if action == remove
//    remove like for id,user,ip
//    return success/failure

?>
