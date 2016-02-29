<?php
require_once __DIR__."/../../api.php";

$action = core_ParseActionURL();
$endpoint = array_shift($action);

switch ($endpoint) {
case "login":
	require_once __DIR__."/auth.php";
	break;
default:
	json_Emit([]);
	break;
};
