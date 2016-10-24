<?php
const CONFIG_PATH = "../../src/shrub/";
const SHRUB_PATH = "../../src/shrub/src/";

include_once __DIR__."/".CONFIG_PATH."config.php";
require_once __DIR__."/".SHRUB_PATH."api.php";

json_Begin();

// Do Actions //
switch ( $REQUEST[0] ) {
	case 'set':
		if ( user_AuthIsAdmin() ) {
			json_EmitFatalNotImplementedError(null,$RESPONSE);
			
			/// @todo sanitize (don't let API create fields)
			/// @todo Do a set
			
			if ( false ) {
				json_SetResponseCreated();
			}
			else {
				json_EmitFatalServerError(null,$RESPONSE);
			}
		}
		else {
			json_EmitFatalPermissionError(null,$RESPONSE);
		}
		break;
	case 'get':
		if ( user_AuthIsAdmin() ) {
			$RESPONSE['global'] = $SH;
		}
		else {
			json_EmitFatalPermissionError(null,$RESPONSE);
		}
		break;
	default:
		json_EmitFatalForbiddenError(null,$RESPONSE);
		break;
};

json_End();
