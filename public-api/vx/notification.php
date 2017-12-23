<?php
require_once __DIR__."/../config.php";

include_once __DIR__."/".CONFIG_PATH."config.php";
require_once __DIR__."/".SHRUB_PATH."api.php";
require_once __DIR__."/".SHRUB_PATH."node/node.php";
require_once __DIR__."/".SHRUB_PATH."notification/notification.php";



function GetFeed($notification_type, &$RESPONSE) {
	$user_id = userAuth_GetID();
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
	
	$RESPONSE['max_read'] = notification_GetLastReadNotification($user_id);
	
	if ( $notification_type == 'unread' ) {
		$RESPONSE['count'] = notification_CountUnread($user_id);
		$RESPONSE['feed'] = notification_GetUnread($user_id, $RESPONSE['limit'], $RESPONSE['offset']);
	} 
	else {
		$RESPONSE['count'] = notification_Count($user_id);
		$RESPONSE['feed'] = notification_Get($user_id, $RESPONSE['limit'], $RESPONSE['offset']);
	}
}

function GetSubscription(&$RESPONSE) {
	$user_id = userAuth_GetID();
	$node_id = intval(json_ArgShift());
	if ( $node_id === 0 ) {
		json_EmitFatalError_BadRequest("Missing node ID parameter", $RESPONSE);
	}
	
	$RESPONSE['node'] = $node_id;
	$RESPONSE['subscribed'] = notification_GetSubscriptionForNode($user_id, $node_id);
}

function SetSubscription($value, &$RESPONSE) {
	$user_id = userAuth_GetID();
	$node_id = intval(json_ArgShift());
	if ( $node_id === 0 ) {
		json_EmitFatalError_BadRequest("Missing node ID parameter", $RESPONSE);
	}

	$RESPONSE['node'] = $node_id;
	
	// Verify that this node makes sense to subscribe to (use the same rules as note posting)
	$node = node_GetById($node_id);
	if ( !comment_IsCommentPublicByNode($node) ) {
		json_EmitFatalError_Permission("You don't have permission to subscribe to this node.", $RESPONSE);
	}

	notification_SetSubscriptionForNode($user_id, $node_id, $value);
	$RESPONSE['subscribed'] = $value;
}


api_Exec([
["notification/unread/count", API_GET | API_AUTH, API_CHARGE_1, function(&$RESPONSE) {
	$user_id = userAuth_GetID(); // Since API_AUTH is present, we can be confident there will be a user ID.
	$RESPONSE['count'] = notification_CountUnread($user_id);
}],
["notification/all/count", API_GET | API_AUTH, API_CHARGE_1, function(&$RESPONSE) {
	$user_id = userAuth_GetID();
	$RESPONSE['count'] = notification_Count($user_id);
}],
["notification/unread/feed", API_GET | API_AUTH, API_CHARGE_1, function(&$RESPONSE) {
	GetFeed("unread", $RESPONSE);
}],
["notification/all/feed", API_GET | API_AUTH, API_CHARGE_1, function(&$RESPONSE) {
	GetFeed("all", $RESPONSE);
}],
["notification/subscription/get", API_GET | API_AUTH, API_CHARGE_1, function(&$RESPONSE) {
	// Are we subscribed to this thread ID?
	GetSubscription($RESPONSE);
}],
["notification/subscription/add", API_POST | API_AUTH, API_CHARGE_1, function(&$RESPONSE) {
	// User wants notifications for this thread.
	SetSubscription(true, $RESPONSE);
}],
["notification/subscription/remove", API_POST | API_AUTH, API_CHARGE_1, function(&$RESPONSE) {
	// User doesn't want notifications for this thread.
	SetSubscription(false, $RESPONSE);
}],
["notification/markread", API_POST | API_AUTH, API_CHARGE_1, function(&$RESPONSE) {
	$user_id = userAuth_GetID();

	if ( !isset($_POST['max_read']) )
		json_EmitFatalError_BadRequest("Missing max_read parameter", $RESPONSE);
	$max_read = intval($_POST['max_read']);
	
	// Sanity check the value being passed in here.
	$prev_cursor = notification_GetLastReadNotification($user_id);
	$max_notification = notification_Max($user_id);
	
	if ( ($max_read < $prev_cursor) || ($max_read > $max_notification) ) {
		json_EmitFatalError_BadRequest("New max_read notification index is out of range", $RESPONSE);
	}
	
	$success = notification_SetLastReadNotification($user_id, $max_read);
	if ( !$success ) {
		json_EmitFatalError_Server(null, $RESPONSE);
	}
	
	$RESPONSE['max_read'] = $max_read;
}],
]);
