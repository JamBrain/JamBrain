<?php
/**
 * Legacy User Lib
 *
 * @file
 */
require_once __DIR__."/../db.php";
require_once __DIR__."/internal/core.php";
require_once __DIR__."/../legacy-config.php";

function legacy_GetUserFromCookie() {
	if (isset($_COOKIE['lusha'])) {
		$part = explode(".",$_COOKIE['lusha'],2);
		
		if (count($part) !== 2)
			return 0;
		
		$id = intval($part[0]);
		
		// TODO: Confirm User Id and HASH match //
		
		return $id;
	}
	return 0;	
}


function legacy_GetUser($id) {
	return db_DoFetchSingle(
		"SELECT id,".MYSQL_ISO_FORMAT('timestamp').",hash
		FROM ".CMW_TABLE_LEGACY_USER." WHERE id=? LIMIT 1;",
		$id
	);
}
function legacy_GetUserWithInfo($id) {
	return db_DoFetchSingle(
		"SELECT id,".MYSQL_ISO_FORMAT('timestamp').",hash,bonus_votes,num_events,gravatar
		FROM ".CMW_TABLE_LEGACY_USER." WHERE id=? LIMIT 1;",
		$id
	);
}

function legacy_GenerateUserHash($id) {
	$hash = bin2hex(openssl_random_pseudo_bytes(24));
	
	db_DoInsert(
		"INSERT IGNORE ".CMW_TABLE_LEGACY_USER." (
			id, `hash`, `timestamp`
		)
		VALUES ( 
			?, ?, NOW()
		)
		ON DUPLICATE KEY UPDATE
			`hash`=VALUES(`hash`),
			`timestamp`=VALUES(`timestamp`)
		;",
		$id,$hash
	);
	
	return $hash;
}

function legacy_FetchUserInfo($id) {	
	$data = [
		'action'=>"LEGACY_FETCH",
		'id'=>$id
	];
	
	$result = http_post_fields(LEGACY_FETCH_URL,$data);
	
	if ( $result !== false ) {
		var_dump($result);
		return json_decode($result);
	}
	return null;
}
