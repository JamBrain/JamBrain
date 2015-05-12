<?php
require_once __DIR__ . "/../../lib.php";

user_start();		// Retrieve Session //

$response = array();
$response['uid'] = user_getId();

session_unset();	// Remove Session Variables //
session_destroy();	// Destroy the Session //

api_emitJSON($response);
?>