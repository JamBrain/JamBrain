<?php
require_once __DIR__."/../node/node.php";

// TODO: MK Determine if the user table is really the best place for this. 
//       i.e. for security reasons, access to the user table needs to be HEAVILY restricted.

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
