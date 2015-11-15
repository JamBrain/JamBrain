<?php
/**
 * Access Log Library
 *
 * @file
 */
require_once __DIR__ . "/../db.php";

// **** PLEASE SANITIZE BEFORE CALLING **** //

function access_LogUser($user, $ip) {
	db_connect();
	
	return db_DoInsert(
		"INSERT INTO ".CMW_TABLE_USER_ACCESS." (
			user, ip, first_timestamp, last_timestamp, total
		)
		VALUES ( 
			?, ".(defined('CMW_USING_MARIADB')?"INET6_ATON(?)":"INET_ATON(?)").", NOW(), NOW(), 1
		)
		ON DUPLICATE KEY UPDATE
			last_timestamp=NOW(),
			total=total+1
		;",
		$user, $ip
	);
}

function access_GetUser($user) {
	db_connect();
	
	return db_DoFetch(
		"SELECT id,user,".
			(defined('CMW_USING_MARIADB')?"INET6_NTOA(ip)":"INET_NTOA(ip)").
			" AS ip,first_timestamp,last_timestamp,total FROM ".CMW_TABLE_USER_ACCESS." 
		WHERE user=?",
		$user
	);
}

function access_GetIP($ip) {
	db_connect();
	
	return db_DoFetch(
		"SELECT id,user,".
			(defined('CMW_USING_MARIADB')?"INET6_NTOA(ip)":"INET_NTOA(ip)").
			" AS ip,first_timestamp,last_timestamp,total FROM ".CMW_TABLE_USER_ACCESS." 
		WHERE ip=".(defined('CMW_USING_MARIADB')?"INET6_ATON(?)":"INET_ATON(?)"),
		$ip
	);
}