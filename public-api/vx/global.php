<?php
const CONFIG_PATH = "../../src/shrub/";
const SHRUB_PATH = "../../src/shrub/src/";

include_once __DIR__."/".CONFIG_PATH."config.php";
require_once __DIR__."/".SHRUB_PATH."core/json.php";
require_once __DIR__."/".SHRUB_PATH."global/global.php";
require_once __DIR__."/".SHRUB_PATH."user/auth.php";

// Begin //
$response = json_NewResponse();

// Authenticate //
user_Auth();
$response['auth'] = $AUTH;

// Parse Arguments //
$REQUEST = core_GetAPIRequest();
$response['request'] = $REQUEST;

// Do Actions //
switch ( $REQUEST[0] ) {
	case 'get':
		if ( user_AuthIsAdmin() ) {
			global_Load();
			$response['global'] = $SH;
		}
		else {
			json_EmitFatalPermissionError($response);
		}
		break;
	default:
		json_EmitFatalForbiddenError($response);
		break;
};

// Emit Response //
json_Emit( $response );
