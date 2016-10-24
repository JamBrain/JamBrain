<?php
const CONFIG_PATH = "../../src/shrub/";
const SHRUB_PATH = "../../src/shrub/src/";

//include_once __DIR__."/".CONFIG_PATH."config.php";
require_once __DIR__."/".SHRUB_PATH."api.php";

json_Begin();

// Do Actions //
switch ( $REQUEST[0] ) {
	case 'set':
		if ( user_AuthIsAdmin() ) {
			json_EmitFatalError_NotImplemented(null,$RESPONSE);
			
			/// @todo sanitize (don't let API create fields)
			/// @todo Do a set
			
			if ( false ) {
				json_RespondCreated();
			}
			else {
				json_EmitFatalError_Server(null,$RESPONSE);
			}
		}
		else {
			json_EmitFatalError_Permission(null,$RESPONSE);
		}
		break;
	case 'get':
		if ( user_AuthIsAdmin() ) {
			$RESPONSE['global'] = $SH;
		}
		else {
			json_EmitFatalError_Permission(null,$RESPONSE);
		}
		break;
	default:
		json_EmitFatalError_Forbidden(null,$RESPONSE);
		break;
};

json_End();
