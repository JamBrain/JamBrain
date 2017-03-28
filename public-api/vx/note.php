<?php
const CONFIG_PATH = "../../src/shrub/";
const SHRUB_PATH = "../../src/shrub/src/";

include_once __DIR__."/".CONFIG_PATH."config.php";
require_once __DIR__."/".SHRUB_PATH."api.php";
require_once __DIR__."/".SHRUB_PATH."note/note.php";
require_once __DIR__."/".SHRUB_PATH."node/node.php";

json_Begin();

const CACHE_KEY_PREFIX = "SH!NOTE!";
const CACHE_TTL = 60;

// Do Actions
$action = json_ArgShift();
switch ( $action ) {
	case 'stats': //note/stats
		json_ValidateHTTPMethod('GET');
		//$event_id = intval(json_ArgGet(0));
		
		$RESPONSE['ham'] = "true";
			
		break; // case 'stats': //note/stats

	default:
		json_EmitFatalError_Forbidden(null, $RESPONSE);
		break; // default
};

json_End();
