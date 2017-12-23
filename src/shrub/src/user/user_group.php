<?php

const USER_GROUP_NAMES_MAP = [
	USER_GROUP_FLAG_PARTICIPANT => 'participant',
	USER_GROUP_FLAG_VETERAN => 'veteran',
	USER_GROUP_FLAG_MODERATOR => 'moderator',
	USER_GROUP_FLAG_CONTRIBUTOR => 'codeContributor',
	USER_GROUP_FLAG_MEDIA => 'media',
	USER_GROUP_FLAG_ADMIN => 'admin',
	USER_GROUP_FLAG_CAN_NEWS => 'canNews',
	USER_GROUP_FLAG_ACTIVE_EVENT_HOST => 'activeEventHost',
	USER_GROUP_FLAG_OWNER => 'owner',
];

function _userGroup_GetFlagStatus( $status, $flag ) {
	return $status & (1 << $flag);
}

function _userGroup_GetUpdatedFlagStatusAdd( $status, $flag ) {
	return $status | (1 << $flag);
}

function _userGroup_GetUpdatedFlagStatusRemove( $status, $flag ) {
	return $status & (~(1 << $flag));
}

function _userGroup_GetByNode( $node_id, $query_suffix = ";" ) {
	$ret = db_QueryFetchFirst(
		"SELECT user_group
		FROM ".SH_TABLE_PREFIX.SH_TABLE_USER."
		WHERE node=?
		LIMIT 1".$query_suffix,
		$node_id
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

function userGroup_GetUserStatusNames( $node_id ) {
	$data = _userGroup_GetByNode($node_id);
	$names = [];
	if ($data && isset($data['user_group'])) {
		$status = $data['user_group'];
		foreach (USER_GROUP_NAMES_MAP as $flag => $flagName) {
			if (_userGroup_GetFlagStatus($status, $flag)) {
				$names[] = $flagName;
			}
		}
	}
	return $names;
}

function userGroup_GetUserHasStatus( $node_id, ...$userGroupStatus ) {
	$multi = is_array($userGroupStatus);
	if (!$multi) {
		$userGroupStatus = [$userGroupStatus];
	}	
	$data = _userGroup_GetByNode($node_id);
	$status = $data && isset($data['user_group']) ? $data['user_group'] : 0;
	$ret = [];
	foreach ($userGroupStatus as $statusFlag) {
		 $ret[] = _userGroup_GetFlagStatus($data['user_group'], $statusFlag);
	}
	if ($multi) {
		return $ret;
	}
	else {
		$ret[0];
	}
	
}

function userGroup_SetUserStatusAdd( $node_id, $flag ) {
	$data = _userGroup_GetByNode( $node_id );
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
		$status, $node_id
	);
}

function userGroup_SetUserStatusRemove( $node_id, $flag ) {
	$data = _userGroup_GetByNode( $node_id );
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
		$status, $node_id
	);
}

?>
