<?php
const CONFIG_PATH = "../../src/shrub/";
const SHRUB_PATH = "../../src/shrub/src/";

include_once __DIR__."/".CONFIG_PATH."config.php";
require_once __DIR__."/".SHRUB_PATH."api.php";
require_once __DIR__."/".SHRUB_PATH."node/node.php";

json_Begin();

// Do Actions
$action = json_ArgShift();
switch ( $action ) {
	// Make a Ludum Dare event
	case 'add': //ldjam/add
		json_ValidateHTTPMethod('GET');

		// TODO: is Admin
		
		break; // case 'add': //ldjam/add

	default:
		json_EmitFatalError_Forbidden(null, $RESPONSE);
		break; // default
};

json_End();
