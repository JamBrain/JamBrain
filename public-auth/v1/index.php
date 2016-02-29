<?php
require_once __DIR__."/../../api.php";

$action = core_ParseActionURL();
$endpoint = array_pop($action);

switch ($endpoint) {
case "hoof":
	json_Emit(["hooves":10]);
	break;
default:
	json_Emit([]);
	break;
};
