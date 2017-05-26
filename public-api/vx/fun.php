<?php
require_once __DIR__."/../config.php";

include_once __DIR__."/".CONFIG_PATH."config.php";
require_once __DIR__."/".SHRUB_PATH."api.php";

json_Begin();

// Bail if not the development environment
if ( !defined(SH_PHP_DEBUG) || !SH_PHP_DEBUG ) {
	json_EmitFatalError_Forbidden("Sorry, this server isn't fun", $RESPONSE);
}

// Do Actions
$action = json_ArgShift();
switch ( $action ) {
	case 'post': //fun/post
		json_ValidateHTTPMethod('POST');
		
		$RESPONSE['message'] = 'This is a sample requiring the POST method';

		break; //case 'post': //fun/post
		
	case 'get': //fun/get
		json_ValidateHTTPMethod('GET');
		
		$RESPONSE['message'] = 'This is a sample requiring the GET method';

		break; //case 'get': //fun/get

	default:
		json_EmitFatalError_Forbidden(null, $RESPONSE);
		break; // default
};

json_End();
