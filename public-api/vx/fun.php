<?php
require_once __DIR__."/../config.php";

include_once __DIR__."/".CONFIG_PATH."config.php";

require_once __DIR__."/".SHRUB_PATH."api.php";
require_once __DIR__."/".SHRUB_PATH."link/link.php";

json_Begin();

// Bail if not the development environment
if ( !defined("SH_PHP_DEBUG") || !SH_PHP_DEBUG ) {
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

	case "link": //link/:sub_action/:linkhash
		/* Sub-actions are:
			out: For navigating to external page via internal linkhash
			ping: Test if link responds with header
			report: Flag a link, e.g. for not responding to ping
			check: Investigate game link for what a link points to as way to assist user
			
			out action should not require being logged in, the other may need 
			I figure linkhash creation shoul not be part of the public api but part of
			the behind scenes things that happen when you publish a game page.
			Pinging could be part of the API though if we want to defer checking for broken links
			to let user looking at a page invoke ping if hasn't been done for long time.
		*/
				
		$sub_action = json_ArgShift();
		
		switch ( $sub_action ) {
			case 'check':				
				$user_id = userAuth_GetID();
				if ($user_id === null) {
					json_EmitFatalError_Forbidden(null, $RESPONSE);
				} else {
					//TODO: should probably only allow post but easier testing with get
					if ( isset($_POST['uri']) ) {			
						json_ValidateHTTPMethod('POST');
						$RESPONSE['link'] = linkComplete_GetFromURI($_POST['uri']);
					} else if ( isset($_GET['uri']) ) {
						json_ValidateHTTPMethod('GET');						
						$RESPONSE['link'] = linkComplete_GetFromURI($_GET['uri']);				
					} else {
						json_EmitFatalError_BadRequest(null, $RESPONSE);
					}
				}
				break;
			case 'ping':
				$user_id = userAuth_GetID();
				if ($user_id === null) {
					json_EmitFatalError_Forbidden(null, $RESPONSE);
				} else {
					$linkhash = json_ArgShift();
					if ($linkhash == null) {
						json_EmitFatalError_BadRequest(null, $RESPONSE);
					} else {
						$ping = link_Ping($linkhash, true);
						$RESPONSE['message'] = $ping['message'];
						$RESPONSE['broken'] = $ping['error'];
					}
				}
				break;
			case 'out':
				$linkhash = json_ArgShift();
				if ($linkhash == null) {
					json_EmitFatalError_BadRequest(null, $RESPONSE);
				} else {
					//TODO: Do magic to redirect using link_getExternal and possibly something about setting data
				}
				break;
			case 'report':
				$user_id = userAuth_GetID();
				if ($user_id === null) {
					json_EmitFatalError_Forbidden(null, $RESPONSE);
				} else {
					$linkhash = json_ArgShift();
					if ($linkhash == null) {
						json_EmitFatalError_BadRequest(null, $RESPONSE);
					} else {
						//TODO: Check if $linkhash exists and if so flag it in database and email user perhaps
					}
				}
				break;
			default:
				json_EmitFatalError_Forbidden(null, $RESPONSE);
				break; // default
		}
		

	default:
		json_EmitFatalError_Forbidden(null, $RESPONSE);
		break; // default
};

json_End();
