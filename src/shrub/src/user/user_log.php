<?php
function userLog_Add( $user, $detail ) {
	return db_QueryInsert(
		"INSERT INTO ".SH_TABLE_PREFIX.SH_TABLE_USER_ACCESS." (
			user, 
            ip,
            detail,
            timestamp
		)
		VALUES ( 
			?,
            INET6_ATON(?),
            ?,
            NOW()
		)",
		$user,
        core_GetClientIP(),
        $detail
	);
}

function userLog_GetLastIPByUserId( $user_id ) {
	return db_QueryFetch(
		"SELECT user, detail, INET6_NTOA(ip) as ip
		FROM ".SH_TABLE_PREFIX.SH_TABLE_USER_ACCESS."
		WHERE user = ?
		ORDER BY id DESC
		LIMIT 1
		;",
		$user_id
	);
}

function userLog_GetLastIPByNode( $node_id ) {
	if ($node_id == 0) {
		return null;
	}

	$user = user_GetByNode($node_id);
	if (!count($user)) {
		return null;
	}
	$user = $user[0];

	$log = userLog_GetLastIPByUserId($user['id']);
	if (!count($log)) {
		$ret = [];
		$ret['mail'] = $user['mail'];
		$ret['ip'] = "???";
		return $ret;
	}
	$log = $log[0];

	$ret = [];
	$ret['mail'] = $user['mail'];
	$ret['ip'] = $log['ip'];

	return $ret;
}
