<?php

require_once __DIR__."/../node/node.php";

function notification_GetAllSubscriptionsForNode( $node ) {
	return db_QueryFetch(
		"SELECT user, subscribed
		FROM ".SH_TABLE_PREFIX.SH_TABLE_NOTIFICATION_SUB."
		WHERE node=?
		;",
		$node
	);
}

function notification_GetSubscriptionForNode( $user, $node ) {
	$sub = db_QueryFetchSingle(
		"SELECT subscribed
		FROM ".SH_TABLE_PREFIX.SH_TABLE_NOTIFICATION_SUB." 
		WHERE user=? AND node=?;",
		$user, $node
	);
	if ( empty($sub) ) {
		return null;
	}
	return $sub['subscribed'] ? true : false;
}


function notification_SetSubscriptionForNode( $user, $node, $subscribed ) {
	$subscribed_value = $subscribed ? 1 : 0;
	
	return db_QueryInsert(
		"INSERT INTO ".SH_TABLE_PREFIX.SH_TABLE_NOTIFICATION_SUB." (
			user,
			node,
			subscribed
		)
		VALUES (
			?,
			?,
			?,
		)
		ON DUPLICATE KEY UPDATE
			subscribed=VALUES(subscribed)
		;",
		$user,
		$node,
		$subscribed_value
	);
}