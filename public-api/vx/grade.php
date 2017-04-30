<?php
require_once __DIR__."/../config.php";

include_once __DIR__."/".CONFIG_PATH."config.php";
require_once __DIR__."/".SHRUB_PATH."api.php";
require_once __DIR__."/".SHRUB_PATH."node/node.php";
require_once __DIR__."/".SHRUB_PATH."grade/grade.php";

json_Begin();

// ********************* //

// Do Actions
$action = json_ArgShift();
switch ( $action ) {
	case 'stats': //grade/stats
		json_ValidateHTTPMethod('GET');
		//$event_id = intval(json_ArgGet(0));

		$RESPONSE['ham'] = "true";

		break; // case 'stats': //grade/stats
		
	case 'add': //grade/add/:node_id
		json_ValidateHTTPMethod('POST');

		break; // case 'upload': //grade/add/:node_id

	default:
		json_EmitFatalError_Forbidden(null, $RESPONSE);
		break; // default
};

json_End();
