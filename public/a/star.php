<?php
// Check for arguments, and exit immediately if none //

// retrieve session
session_start();

// if logged in, grab id, otherwise exit

require_once __DIR__ . "/../../db.php";

db_connect();

// if action == add
//    add/overwrite the star for id,user
//    return success/failure

// if action == remove
//    remove star for id,user
//    return success/failure

?>
