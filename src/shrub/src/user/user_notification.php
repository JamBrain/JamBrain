<?php
require_once __DIR__."/../node/node.php";

// TODO: MK sh_user can't be used for this. This needs to be removed for security reasons.

/// @retval Integer Id of highest read notification.
function user_GetLastReadNotificationByNode( $node ) {
	$ret = db_QueryFetchSingle(
		"SELECT last_read_notification
		FROM ".SH_TABLE_PREFIX.SH_TABLE_USER." 
		WHERE node=?;",
		$node
	);
	if($ret == null) {
		return null;
	}
	return $ret[0];
}

function user_SetLastReadNotificationByNode( $node, $notification ) {
	return db_QueryUpdate(
		"UPDATE ".SH_TABLE_PREFIX.SH_TABLE_USER."
		SET
			last_read_notification=?
		WHERE
			node=?;",
		$notification, $node
	);
}
