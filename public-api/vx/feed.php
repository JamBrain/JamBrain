<?php
require_once __DIR__."/../config.php";

include_once __DIR__."/".CONFIG_PATH."config.php";
require_once __DIR__."/".SHRUB_PATH."api2.php";
require_once __DIR__."/".SHRUB_PATH."node/node.php";

api_Exec([
["feed/me", API_GET | API_COST_NORMAL, function(&$RESPONSE, $HEAD_REQUEST) {

	$RESPONSE['me'] = true;
}],
["feed/me", API_POST | API_COST_NORMAL, function(&$RESPONSE) {

	$RESPONSE['postme'] = true;
}],
["feed", API_GET | API_COST_NORMAL, function(&$RESPONSE, $HEAD_REQUEST) {

	$RESPONSE['test'] = true;
}],
]);

