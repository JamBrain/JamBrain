<?php
const CONFIG_PATH = "../../src/shrub/";
const SHRUB_PATH = "../../src/shrub/src/";

include_once __DIR__."/".CONFIG_PATH."config.php";
require_once __DIR__."/".SHRUB_PATH."api.php";
require_once __DIR__."/".SHRUB_PATH."theme/theme.php";
require_once __DIR__."/".SHRUB_PATH."node/node.php";

json_Begin();

const CACHE_KEY_PREFIX = "SH!THEME!";
const CACHE_TTL = 15;//10*60;

function GetEventNodes() {
	$cache_key = CACHE_KEY_PREFIX."GetEventNodes";

	$ret = cache_Fetch($cache_key);
	if ( !isset($ret) ) {
		$ret = node_GetIdByType(SH_NODE_TYPE_EVENT);
		cache_Store($cache_key, $ret, CACHE_TTL);
	}
	return $ret;
}

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
					/// Broadphase: check if $event_id is on the master list of event nodes.
					if ( in_array($event_id, GetEventNodes()) ) {
						///	Narrowphase: Get the threshold from the node itself
						$threshold = nodeCache_GetMetaFieldById($event_id, 'theme_threshold', null);
						$cache_key = CACHE_KEY_PREFIX."IDEA!GET".$event_id."!".$threshold;
							
						$RESPONSE['themes'] = cache_Fetch($cache_key);
						if ( !isset($RESPONSE['themes']) ) {
							$RESPONSE['themes'] = themeIdea_GetOriginal($event_id, null, $threshold);
							cache_Store($cache_key, $RESPONSE['themes'], CACHE_TTL);
						}
						
						$RESPONSE['count'] = count($RESPONSE['themes']);
					}
					else {
						json_EmitFatalError_NotFound(null, $RESPONSE);
					}
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
