<?php
const CONFIG_PATH = "../../src/shrub/";
const SHRUB_PATH = "../../src/shrub/src/";

include_once __DIR__."/".CONFIG_PATH."config.php";
require_once __DIR__."/".SHRUB_PATH."config/config.php";
require_once __DIR__."/".SHRUB_PATH."core/json.php";

// Begin //
$response = json_NewResponse();

// Authenticate //

// Parse Arguments //

// Do //
/// @todo Require admin status to do anything to (even read) the configuration
config_Load();
$response['config'] = $SH_CONFIG;

// Emit Response //
json_Emit( $response );
