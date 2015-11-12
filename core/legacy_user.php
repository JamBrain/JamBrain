<?php
/**
 * Legacy User Lib
 *
 * @file
 */
//require_once __DIR__ . "/../db.php";
require_once __DIR__."/internal/core.php";

function legacy_GetUser() {
	if (isset($_COOKIE['lusha'])) {
		$part = explode("|",$_COOKIE['lusha'],2);
		
		if (count($part) !== 2)
			return 0;
		
		$user_id = intval(base48_Decode($part[0]));
		
		// Confirm User Id and HASH match //
		
		return $user_id;
	}
	return 0;	
}
