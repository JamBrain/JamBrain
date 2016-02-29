<?php
require_once __DIR__."/../../api.php";

$action = core_ParseActionURL();
$endpoint = array_shift($action);

switch ($endpoint) {
case "login":
	require_once __DIR__."/auth.php";
	auth_Login($action);
	break;
case "logout":
	require_once __DIR__."/auth.php";
	auth_Logout($action);
	break;
default:
	json_EmitError();
	break;
};
