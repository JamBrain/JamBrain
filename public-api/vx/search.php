<?php
require_once __DIR__."/../config.php";

include_once __DIR__."/".CONFIG_PATH."config.php";
require_once __DIR__."/".BACKEND_PATH."api.php";
require_once __DIR__."/".BACKEND_PATH."node/node.php";
require_once __DIR__."/".BACKEND_PATH."/core/db_sphinx.php";

api_Exec([
["search", API_GET, API_CHARGE_1, function(&$RESPONSE) {
	// q=what (like google)

	$RESPONSE['test'] = true;
}],
]);
