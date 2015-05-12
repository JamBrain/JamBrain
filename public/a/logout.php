<?php
require_once __DIR__ . "/../../lib/api.php";

session_start();	// Retrieve Session //

$response = array();

if ( isset($_SESSION['uid']) ) {
	$response['uid'] = $_SESSION['uid'];
}

session_unset();	// Remove Session Variables //
session_destroy();	// Destroy the Session //

api_emitJSON($response);
?>