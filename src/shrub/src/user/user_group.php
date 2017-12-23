<?php

function _userGroup_GetFlagStatus( $status, $flag ) {
	return $status & (1 << $flag);
}

function _userGroup_GetUpdatedFlagStatusAdd( $status, $flag ) {
	return $status | (1 << $flag);
}

function _userGroup_GetUpdatedFlagStatusRemove( $status, $flag ) {
	return $status & (~(1 << $flag));
}

function _userGroup_GetById( $id, $query_suffix = ";" ) {
	$ret = db_QueryFetchFirst(
		"SELECT user_group
		FROM ".SH_TABLE_PREFIX.SH_TABLE_USER."
		WHERE id=?
		LIMIT 1".$query_suffix,
		$id
	);
	return db_ParseRow($ret, _SH_USER_ROW_MAP);
}

function userGroup_GetStatusCodeFromFlags( ...$flags ) {
	$status = 0;
	foreach ($flags as $flag) {
		$status = _userGroup_GetUpdatedFlagStatusAdd($flag);
	}
	return $status;
}

function userGroup_GetUserHasStatus( $id, $userGroupStatus ) {
	$data = _userGroup_GetById($id);
	if ($data && isset($data['user_group'])) {
		return _userGroup_GetFlagStatus($data['user_group'], $userGroupStatus);
	}
	return false;
}

function userGroup_SetUserStatusAdd( $id, $flag ) {
	$data = _userGroup_GetById( $id );
	$status = 0;
	if ($data && isset($data['user_group'])) {
		$status = $data['user_group'];
	}
	$status = _userGroup_GetUpdatedFlagStatusAdd($status, $flag);
	return db_QueryUpdate(
		"UPDATE ".SH_TABLE_PREFIX.SH_TABLE_USER."
		SET
			user_group=?
		WHERE
			id=?;",
		$status, $id
	);
}

function userGroup_SetUserStatusRemove( $id, $flag ) {
	$data = _userGroup_GetById( $id );
	$status = 0;
	if ($data && isset($data['user_group'])) {
		$status = $data['user_group'];
	}
	$status = _userGroup_GetUpdatedFlagStatusRemove($status, $flag);
	return db_QueryUpdate(
		"UPDATE ".SH_TABLE_PREFIX.SH_TABLE_USER."
		SET
			user_group=?
		WHERE
			id=?;",
		$status, $id
	);
}

?>
