<?php
const CONFIG_PATH = "../../src/shrub/";
const SHRUB_PATH = "../../src/shrub/src/";

include_once __DIR__."/".CONFIG_PATH."config.php";
require_once __DIR__."/".SHRUB_PATH."api.php";
require_once __DIR__."/".SHRUB_PATH."theme/theme.php";

json_Begin();

const CACHE_TTL = 15;//10*60;

// Do Actions //
$action = json_ArgGet(0);
switch ( $action ) {
	// Regular Voting Rounds //
	case 'get':
		json_ValidateHTTPMethod('GET');
		$event_id = intval(json_ArgGet(1));
		
		/// @todo Confirm valid event_id
		
		if ( $event_id !== 0 ) {
			$RESPONSE['themes'] = ['bacon'];
		}
		else {
			json_EmitFatalError_BadRequest(null,$RESPONSE);
		}
		break;
	case 'set':
		json_ValidateHTTPMethod('POST');

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

	// Theme Suggestions //
	case 'idea': {
		$parent_action = json_ArgShift();
		$action = json_ArgGet(0);
		switch ( $action ) {
			case 'getmy':
				json_ValidateHTTPMethod('GET');
				$event_id = intval(json_ArgGet(1));
				
				if ( user_AuthIsUser() ) {
					if ( $event_id ) {
						$RESPONSE['ideas'] = theme_IdeaGetMine($event_id,$AUTH['user']['id']);
						$RESPONSE['count'] = count($RESPONSE['ideas']);
					}
					else {
						json_EmitFatalError_BadRequest(null, $RESPONSE);
					}
				}
				else {
					json_EmitFatalError_Permission(null, $RESPONSE);
				}
				break;
			case 'get':
				json_ValidateHTTPMethod('GET');
				$event_id = intval(json_ArgGet(1));
				
				if ( $event_id !== 0 ) {
					/// @todo Confirm that $event_id is an event
					/// 	Broadphase: check if it's on the master list of event nodes.
					///		Narrowphase: Get the threshold from the node itself
					$threshold = 1;
					$cache_key = "SH!THEME!IDEA!GET".$event_id."!".$threshold;
					
//					$RESPONSE['themes'] = cache_FetchStore($key, 
//						function() use ($event_id, $threshold) {
//							return themeIdea_GetOriginal($event_id, null, $threshold);
//						},
//						CACHE_TTL);
						
					$RESPONSE['themes'] = cache_Fetch($cache_key);
					if ( !isset($RESPONSE['themes']) ) {
						$RESPONSE['themes'] = themeIdea_GetOriginal($event_id, null, $threshold);
						if ( isset($RESPONSE['themes']) ) {
							cache_Store($cache_key, $RESPONSE['themes'], CACHE_TTL);
						}
					}
					
					$RESPONSE['count'] = count($RESPONSE['themes']);
				}
				else {
					json_EmitFatalError_BadRequest(null, $RESPONSE);
				}

				break;
			case 'set':
				break;
			default:
				json_EmitFatalError_Forbidden(null,$RESPONSE);
				break;
		};
		break;
	}

	default:
		json_EmitFatalError_Forbidden(null,$RESPONSE);
		break;
};

json_End();
