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
		$hash = $part[1];
		
		if (defined('LEGACY_DEBUG')) {
			$user = [];
			$user['hash'] = "this_is_fake";
		}
		else {
			$user = legacy_GetUser($id);
		}
		
		if ( isset($user['hash']) && ($user['hash'] == $hash) ) {
			return $id;
		}
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
	$curl = curl_init();

	curl_setopt($curl, CURLOPT_URL, LEGACY_FETCH_URL);
	curl_setopt($curl, CURLOPT_POST, 1);
	curl_setopt($curl, CURLOPT_POSTFIELDS, 
		http_build_query(['action'=>"LEGACY_FETCH",'id'=>$id]));

	// receive server response ...
	curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);

	$result = curl_exec($curl);

	curl_close ($curl);
	
	if ( $result !== false ) {
		return json_decode($result,true);
	}
	return null;
}

function legacy_SetExtraInfo($id,$result) {
	return db_DoDelete(
		"UPDATE ".CMW_TABLE_LEGACY_USER."
		SET num_events=? AND gravatar=?
		WHERE id=?
		;",
		$result['num_events'],$result['gravatar'],$id
	);
}
