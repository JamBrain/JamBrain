<?php
const CONFIG_PATH = "../../src/shrub/";
const SHRUB_PATH = "../../src/shrub/src/";

include_once __DIR__."/".CONFIG_PATH."config.php";
require_once __DIR__."/".SHRUB_PATH."api.php";
require_once __DIR__."/".SHRUB_PATH."theme/theme.php";
require_once __DIR__."/".SHRUB_PATH."node/node.php";

json_Begin();

const CACHE_KEY_PREFIX = "SH!THEME!";
const CACHE_TTL = 60;

function GetEventNodes() {
	$cache_key = CACHE_KEY_PREFIX."GetEventNodes";

	$ret = cache_Fetch($cache_key);
	if ( !isset($ret) ) {
		$ret = node_GetIdByType(SH_NODE_TYPE_EVENT);
		cache_Store($cache_key, $ret, CACHE_TTL);
	}
	return $ret;
}

function validateEvent( $event_id, $optional = false ) {
	global $RESPONSE;
	
	if ( $event_id !== 0 ) {
		/// Check if $event_id is on the master list of event nodes.
		if ( !in_array($event_id, GetEventNodes()) ) {
			json_EmitFatalError_NotFound("Invalid Event", $RESPONSE);
		}
	}
	else {
		if ( !$optional )
			json_EmitFatalError_BadRequest(null, $RESPONSE);
		$event_id = 0;
	}
	return $event_id;
}

//function validateIdea( $idea_id ) {
//	$event = null;
//	if ( $idea_id !== 0 ) {
//		$event = 
//		if ( $event_id !== 0 ) {
//			/// Check if $event_id is on the master list of event nodes.
//			if ( !in_array($event_id, GetEventNodes()) ) {
//				json_EmitFatalError_NotFound("Invalid Event", $RESPONSE);
//			}
//		}
//	}
//	return $ret;
//}

function doThemeIdeaVote( $value ) {
	global $RESPONSE;
	
	json_ValidateHTTPMethod('GET');
	$idea_id = intval(json_ArgGet(0));
	
	if ( $idea_id ) {
		$idea = themeIdea_GetById($idea_id);
		$RESPONSE['idea'] = $idea;
		if ( isset($idea) && isset($idea['node']) ) {
			$author_id = userAuth_GetId();
			if ( $author_id ) {
				$RESPONSE['id'] = themeIdeaVote_Add($idea['node'], $idea_id, $author_id, $value);
			}
			else {
				json_EmitFatalError_Permission(null, $RESPONSE);
			}
		}
		else {
			json_EmitFatalError_Server(null, $RESPONSE);
		}
	}
	else {
		json_EmitFatalError_BadRequest(null, $RESPONSE);
	}
}

// Do Actions
$action = json_ArgShift();
switch ( $action ) {
	// Regular Voting Rounds //
	case 'get':
//		json_ValidateHTTPMethod('GET');
//		$event_id = intval(json_ArgGet(0));
//		
//		/// @todo Confirm valid event_id
//		
//		if ( $event_id !== 0 ) {
//			$RESPONSE['themes'] = ['bacon'];
//		}
//		else {
//			json_EmitFatalError_BadRequest(null,$RESPONSE);
//		}
		break;
	case 'set':
//		json_ValidateHTTPMethod('POST');
//
//		if ( userAuth_IsAdmin() ) {
//			json_EmitFatalError_NotImplemented(null,$RESPONSE);
//			
//			/// @todo sanitize (don't let API create fields)
//			/// @todo Do a set
//			
//			if ( false ) {
//				json_RespondCreated();
//			}
//			else {
//				json_EmitFatalError_Server(null,$RESPONSE);
//			}
//		}
//		else {
//			json_EmitFatalError_Permission(null,$RESPONSE);
//		}
		break;
	
	case 'stats': 
		json_ValidateHTTPMethod('GET');
		$event_id = intval(json_ArgGet(0));
		
		if ( $event_id !== 0 ) {
			/// Broadphase: check if $event_id is on the master list of event nodes.
			if ( in_array($event_id, GetEventNodes()) ) {
				$ret = [];
				$ret['idea'] = themeIdea_GetStats($event_id);
				
				$RESPONSE['stats'] = $ret;
			}
			else {
				json_EmitFatalError_NotFound("Invalid Event", $RESPONSE);				
			}
		}
		else {
			json_EmitFatalError_BadRequest(null, $RESPONSE);
		}
	
		break;

	// Theme Suggestions //
	case 'idea': {
		$parent_action = $action;
		$action = json_ArgShift();
		switch ( $action ) {
			case 'getmy':
				json_ValidateHTTPMethod('GET');
				$event_id = intval(json_ArgGet(0));
				
				if ( validateEvent($event_id) ) {
					$author_id = userAuth_GetId();
					if ( $author_id ) {
						$RESPONSE['ideas'] = themeIdea_Get($event_id, $author_id);
						$RESPONSE['count'] = count($RESPONSE['ideas']);
					}
					else {
						json_EmitFatalError_Permission(null, $RESPONSE);
					}
				}
				break;

//			case 'get':
//				json_ValidateHTTPMethod('GET');
//				$event_id = intval(json_ArgGet(0));
//				
//				if ( $event_id !== 0 ) {
//					/// Broadphase: check if $event_id is on the master list of event nodes.
//					if ( in_array($event_id, GetEventNodes()) ) {
//						///	Narrowphase: Get the threshold from the node itself
//						$threshold = nodeCache_GetMetaFieldById($event_id, 'theme_threshold', null);
//						$cache_key = CACHE_KEY_PREFIX."IDEA!GET".$event_id."!".$threshold;
//							
//						$RESPONSE['themes'] = cache_Fetch($cache_key);
//						if ( !isset($RESPONSE['themes']) ) {
//							$RESPONSE['themes'] = themeIdea_GetOriginal($event_id, null, $threshold);
//							cache_Store($cache_key, $RESPONSE['themes'], CACHE_TTL);
//						}
//						
//						$RESPONSE['count'] = count($RESPONSE['themes']);
//					}
//					else {
//						json_EmitFatalError_NotFound("Invalid Event", $RESPONSE);
//					}
//				}
//				else {
//					json_EmitFatalError_BadRequest(null, $RESPONSE);
//				}
//
//				break;

			case 'add':
				json_ValidateHTTPMethod('POST');
	
				$user = userAuth_GetId();
				if ( !$user ) {
					json_EmitFatalError_Permission(null, $RESPONSE);
				}

				if ( isset($_POST['idea']) )
					$idea = coreSanitize_String($_POST['idea']);
				else
					json_EmitFatalError_BadRequest("'idea' not found in POST", $RESPONSE);

				if ( $idea !== $_POST['idea'] ) {
					json_EmitFatalError_BadRequest("'idea' is invalid", $RESPONSE);
				}
					
				$event_id = intval(json_ArgGet(0));
				if ( $event_id !== 0 ) {
					/// Broadphase: check if $event_id is on the master list of event nodes.
					if ( in_array($event_id, GetEventNodes()) ) {
						// TODO: Cache
						$event = nodeComplete_GetById($event_id);
						if ( isset($event) ) {
							$event = $event;
							
							// Is Event Accepting Suggestions ?
							if ( isset($event['meta']) && isset($event['meta']['theme-mode']) && intval($event['meta']['theme-mode']) === 1 ) {
								$theme_limit = isset($event['meta']['theme-idea-limit']) ? intval($event['meta']['theme-idea-limit']) : 3;
								
								$RESPONSE['response'] = themeIdea_Add($idea, $event_id, $user, $theme_limit);
								
								$RESPONSE['ideas'] = themeIdea_Get($event_id, $user);
								$RESPONSE['count'] = count($RESPONSE['ideas']);
								
								if ( $RESPONSE['response']['id'] )
									json_RespondCreated();
							}
							else {
								json_EmitFatalError_BadRequest("Event is not accepting Theme Suggestions", $RESPONSE);
							}
						}
						else {
							json_EmitFatalError_Server(null, $RESPONSE);
						}
					}
					else {
						json_EmitFatalError_NotFound("Invalid Event", $RESPONSE);
					}
				}
				else {
					json_EmitFatalError_BadRequest(null, $RESPONSE);
				}
				break;

			case 'remove':
				json_ValidateHTTPMethod('POST');
	
				$user = userAuth_GetId();
				if ( !$user ) {
					json_EmitFatalError_Permission(null, $RESPONSE);
				}

				if ( isset($_POST['id']) )
					$id = intval($_POST['id']);
				else
					json_EmitFatalError_BadRequest("'id' not found in POST", $RESPONSE);

				if ( !$id ) {
					json_EmitFatalError_BadRequest(null, $RESPONSE);
				}
					
				$event_id = intval(json_ArgGet(0));
				if ( $event_id !== 0 ) {
					/// Broadphase: check if $event_id is on the master list of event nodes.
					if ( in_array($event_id, GetEventNodes()) ) {
						// TODO: Cache
						$event = nodeComplete_GetById($event_id);
						if ( isset($event) ) {
							$event = $event;
							
							// Is Event Accepting Suggestions ?
							if ( isset($event['meta']) && isset($event['meta']['theme-mode']) && intval($event['meta']['theme-mode']) === 1 ) {
								$RESPONSE['response'] = themeIdea_Remove($id, $user);
								
								$RESPONSE['ideas'] = themeIdea_Get($event_id, $user);
								$RESPONSE['count'] = count($RESPONSE['ideas']);
								
								if ( $RESPONSE['response'] )
									json_RespondCreated();
							}
							else {
								json_EmitFatalError_BadRequest("Event is not accepting Theme Suggestions", $RESPONSE);
							}
						}
						else {
							json_EmitFatalError_Server(null, $RESPONSE);
						}
					}
					else {
						json_EmitFatalError_NotFound("Invalid Event", $RESPONSE);
					}
				}
				else {
					json_EmitFatalError_BadRequest(null, $RESPONSE);
				}
				break;
				
			case 'vote':
				$parent_action = $action;
				$action = json_ArgShift();
				switch ( $action ) {
					case 'get':
						json_ValidateHTTPMethod('GET');
						$event_id = intval(json_ArgGet(0));

						if ( validateEvent($event_id) ) {
							$author_id = userAuth_GetId();
							if ( $author_id ) {
								$threshold = 0.0;
								$RESPONSE['ideas'] = themeIdeaVote_GetIdeas($event_id, $threshold);
							}
							else {
								json_EmitFatalError_Permission(null, $RESPONSE);
							}
						}
						break;
						
					case 'getmy':
						json_ValidateHTTPMethod('GET');
						$event_id = intval(json_ArgGet(0));

						if ( validateEvent($event_id) ) {
							$author_id = userAuth_GetId();
							if ( $author_id ) {
								$RESPONSE['myvotes'] = themeIdeaVote_GetMy($event_id, $author_id);
							}
							else {
								json_EmitFatalError_Permission(null, $RESPONSE);
							}
						}
						break;

					case 'yes':
						doThemeIdeaVote(1);
						break;

					case 'no':
						doThemeIdeaVote(0);
						break;
						
					case 'flag':
						doThemeIdeaVote(-1);
						break;
				}
				
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
