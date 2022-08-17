<?php
require_once __DIR__."/../config.php";

include_once __DIR__."/".CONFIG_PATH."config.php";
require_once __DIR__."/".SHRUB_PATH."api2.php";


api_Exec([
["media/get", API_GET | API_CHARGE, function(&$RESPONSE, $HEAD_REQUEST) {
}],
]);
