<?php
require_once __DIR__."/../../api.php";

$action = core_ParseActionURL();
$endpoint = array_shift($action);

switch ($endpoint) {
case "login":
	json_Emit(["whoop" => 10]);
	break;
default:
	json_Emit([]);
	break;
};
