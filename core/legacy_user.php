<?php
/**
 * Legacy User Lib
 *
 * @file
 */
require_once __DIR__."/../db.php";
require_once __DIR__."/internal/cache.php";
require_once __DIR__."/internal/core.php";
require_once __DIR__."/../legacy-config.php";

// **** PLEASE SANITIZE BEFORE CALLING **** //

const _LEGACY_USER_CACHE_KEY = "CMW_LEGACY_USER_";
const _LEGACY_USER_CACHE_TTL = 5*60;

function legacy_GetUserFromCookie() {
	if (isset($_COOKIE['lusha'])) {
		$part = explode(".",$_COOKIE['lusha'],3);
		
		if (count($part) < 2) {
			$GLOBALS['ERROR'] = "Parse Error";
			return 0;
		}
		else if (count($part) === 3 ) {
			$GLOBALS['ERROR'] = "Error: ".$part[2];
			return 0;
		}
		
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
			unset($GLOBALS['ERROR']);
			return $id;
		}
		$GLOBALS['ERROR'] = "Login Failed";
	}
	return 0;	
}

function legacy_GetUser($id) {
	$ret = cache_Fetch(_LEGACY_USER_CACHE_KEY.$id);
	
	if ( $ret === null ) {
		db_Connect();
		
		$ret = db_DoFetchSingle(
			"SELECT id,".MYSQL_ISO_FORMAT('timestamp').",hash
			FROM ".CMW_TABLE_LEGACY_USER." WHERE id=? LIMIT 1;",
			$id
		);
		cache_Store(_LEGACY_USER_CACHE_KEY.$id,$ret,_LEGACY_USER_CACHE_TTL);
	}
	return $ret;
}
function legacy_GetUserWithInfo($id) {
	db_Connect();
	
	return db_DoFetchSingle(
		"SELECT id,".MYSQL_ISO_FORMAT('timestamp').",hash,bonus_votes,num_events,gravatar
		FROM ".CMW_TABLE_LEGACY_USER." WHERE id=? LIMIT 1;",
		$id
	);
}


function legacy_GenerateUserHash($id) {
	$hash = bin2hex(openssl_random_pseudo_bytes(24));
	
	db_Connect();
	
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
	db_Connect();
	
	return db_DoDelete(
		"UPDATE ".CMW_TABLE_LEGACY_USER."
		SET num_events=?,gravatar=?
		WHERE id=?
		;",
		intval($result['num_events']),strval($result['gravatar']),intval($id)
	);
}
