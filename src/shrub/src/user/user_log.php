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
