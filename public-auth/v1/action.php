<?php
require_once __DIR__."/../../api.php";
require_once __DIR__."/auth.php";

$action = core_ParseActionURL();
$endpoint = array_shift($action);

switch ($endpoint) {
case "login":
	auth_Login($action);
	break;
case "logout":
	auth_Logout($action);
	break;
default:
	json_EmitError();
	break;
};
