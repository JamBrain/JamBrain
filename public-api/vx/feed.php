<?php
require_once __DIR__."/../config.php";

include_once __DIR__."/".CONFIG_PATH."config.php";
require_once __DIR__."/".SHRUB_PATH."api.php";
require_once __DIR__."/".SHRUB_PATH."node/node.php";

api_Exec([
["feed", API_GET, API_CHARGE_1, function(&$RESPONSE) {

	$RESPONSE['test'] = true;
}],
]);

