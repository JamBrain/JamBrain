<?php
require_once __DIR__."/../config.php";

include_once __DIR__."/".CONFIG_PATH."config.php";
require_once __DIR__."/".SHRUB_PATH."api.php";
require_once __DIR__."/".SHRUB_PATH."node/node.php";
require_once __DIR__."/".SHRUB_PATH."notification/notification.php";
require_once __DIR__."/".SHRUB_PATH."user/user.php";

json_Begin();

// Do Actions
$action = json_ArgShift();
switch ( $action ) {
	case 'unread': //notification/unread
	case 'all': //notification/all
		$notification_type = $action;
		$action = json_ArgShift();
		switch ( $action ) {
			case 'count': //notification/unread/count, //notification/all/count
				json_ValidateHTTPMethod('GET');
				
				if ( $user_id = userAuth_GetID() ) {
					
					if ( $notification_type == 'unread' ) {
						$RESPONSE['count'] = notification_CountUnread($user_id);
					} else {
						$RESPONSE['count'] = notification_Count($user_id);
					}
				}
				else {
					json_EmitFatalError_Permission(null, $RESPONSE);
				}				
				
				break; // case 'count': //notification/unread/count, //notification/all/count
				
			case 'feed': //notification/unread/feed, //notification/all/feed
				json_ValidateHTTPMethod('GET');
				
				if ( $user_id = userAuth_GetID() ) {
					
					$RESPONSE['offset'] = 0;
					$RESPONSE['limit'] = 20;

					if ( isset($_GET['offset']) ) {
						$RESPONSE['offset'] = intval($_GET['offset']);
					}
					if ( isset($_GET['limit']) ) {
						$RESPONSE['limit'] = intval($_GET['limit']);
						if ( $RESPONSE['limit'] < 1 )
							$RESPONSE['limit'] = 1;
						if ( $RESPONSE['limit'] > 100 )
							$RESPONSE['limit'] = 100;
					}
					
					
					if ( $notification_type == 'unread' ) {
						$RESPONSE['count'] = notification_CountUnread($user_id);
						$RESPONSE['feed'] = notification_GetUnread($user_id, $RESPONSE['limit'], $RESPONSE['offset']);
					} else {
						$RESPONSE['count'] = notification_Count($user_id);
						$RESPONSE['feed'] = notification_Get($user_id, $RESPONSE['limit'], $RESPONSE['offset']);
					}
				}
				else {
					json_EmitFatalError_Permission(null, $RESPONSE);
				}							
				
				break; //case 'feed': //notification/unread/feed, //notification/all/feed
				
			default:
				json_EmitFatalError_Forbidden(null, $RESPONSE);
				break; // default			
		}
		break; // case 'all': //notification/all

	case 'markread': //notification/markread
		json_ValidateHTTPMethod('POST');
		if ( $user_id = userAuth_GetID() ) {
		
			if ( !isset($_POST['max_read']) )
				json_EmitFatalError_BadRequest("Missing max_read parameter", $RESPONSE);
			$max_read = intval($_POST['max_read']);
			
			// Sanity check the value being passed in here.
			$prev_cursor = user_GetLastReadNotificationByNode($user_id);
			$max_notification = notification_Max($user_id);
			
			if ( $max_read < $prev_cursor || $max_read > $max_notification ) {
				json_EmitFatalError_BadRequest("New max_read notification index is out of range", $RESPONSE);
			}
			
			$success = user_SetLastReadNotificationByNode($user_id, $max_read);
			if( !$success ) {
				json_EmitFatalError_Server(null, $RESPONSE);
			}
			
			$RESPONSE['max_read'] = $max_read;
			
		} else {
			json_EmitFatalError_Permission(null, $RESPONSE);
		}		
		break;

	default:
		json_EmitFatalError_Forbidden(null, $RESPONSE);
		break; // default
};

json_End();
