<?php
const CONFIG_PATH = "../../src/shrub/";
const SHRUB_PATH = "../../src/shrub/src/";

include_once __DIR__."/".CONFIG_PATH."config.php";
require_once __DIR__."/".SHRUB_PATH."global/global.php";
require_once __DIR__."/".SHRUB_PATH."core/json.php";

// Begin //
$response = json_NewResponse();

// Authenticate //

// Parse Arguments //

// Do //
/// @todo Require admin status to do anything to (even read) the globals
global_Load();
$response['global'] = $SH;

// Emit Response //
json_Emit( $response );
