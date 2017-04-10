<?php
require_once __DIR__."/../config.php";

include_once __DIR__."/".CONFIG_PATH."config.php";
require_once __DIR__."/".SHRUB_PATH."api.php";

json_Begin();

// Do Actions
$action = json_ArgShift();
switch ( $action ) {
	case 'set': //global/set
		json_ValidateHTTPMethod('POST');

		if ( userAuth_IsAdmin() ) {
			json_EmitFatalError_NotImplemented(null, $RESPONSE);
			
			/// @todo sanitize (don't let API create fields)
			/// @todo Do a set
			
			if ( false ) {
				
				json_RespondCreated();
			}
			else {
				json_EmitFatalError_Server(null, $RESPONSE);
			}
		}
		else {
			json_EmitFatalError_Permission(null, $RESPONSE);
		}
		break; // case 'set': //global/set

	case 'get': //global/get
		json_ValidateHTTPMethod('GET');

		if ( userAuth_IsAdmin() ) {
			$RESPONSE['global'] = $SH;
		}
		else {
			json_EmitFatalError_Permission(null, $RESPONSE);
		}
		break; // case 'get': //global/get

	default:
		json_EmitFatalError_Forbidden(null, $RESPONSE);
		break; // default
};

json_End();
