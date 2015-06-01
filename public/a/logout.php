<?php
require_once __DIR__ . "/../../lib.php";

$response = api_newResponse();

// Retrieve Session, store UID
user_start();
$response['uid'] = user_getId();

session_unset();	// Remove Session Variables //
session_destroy();	// Destroy the Session //

api_emitJSON($response);
?>