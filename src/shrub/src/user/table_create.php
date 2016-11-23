<?php

// User Login Credentials
$table = 'SH_TABLE_USER';
if ( in_array(constant($table), $TABLE_LIST) ) {
	$ok = null;
	
	// References:
	// - E-mail address length limit: 254 - http://stackoverflow.com/a/574698/5678759
	// - Password length limit: 128 - https://www.owasp.org/index.php/Authentication_Cheat_Sheet#Password_Length
	// - (internal) Bcrypt password limit: 72 - http://blog.nic0.me/post/63180966453/php-550s-passwordhash-api-a-deeper-look
	// - Hash length limit: 255 - http://www.php.net/manual/en/function.password-hash.php
	// - (internal) Bcrypt hash length: 60 - http://blog.nic0.me/post/63180966453/php-550s-passwordhash-api-a-deeper-look
	// - Google Authenticator secret length: 20 bytes, 160 bits (usually 80 bits) - https://github.com/RobThree/TwoFactorAuth
	// - MySQL index limit: 767 bytes (or 256*3-1)
	// - Recommended minimum password length: 12-14 - https://en.wikipedia.org/wiki/Password_strength#Random_passwords

	// NOTES:
	// - E-mail addresses are 24bit (3 byte) Unicode, so emoji in addresses wont work. To fit in the MySQL index limit.
	// - E-mail addresses must be unique!
	// - We now have a separate id and node member. This is so we can associate multiple e-mails with 1 account.
	// - When you create an account, no node is created. 'node' is 0.
	// - After activating an account, create a node, and set it.
	// - If hash is an empty string, always fail
	//
	// - TODO: you can purge any accounts with a 'node' of 0, and an age of 1 month.
	// - Encode/decoding the secret will require funky code (mysql CONV(...). HEX and UNHEX don't do it)

	table_Init($table);
	switch ( $TABLE_VERSION ) {
	case 0:
		$ok = table_Create( $table,
			"CREATE TABLE ".SH_TABLE_PREFIX.constant($table)." (
				id ".DB_TYPE_UID.",
				node ".DB_TYPE_ID.",
					INDEX(node),
				mail ".DB_TYPE_UNICODE3(254).",
					UNIQUE(mail),
				created ".DB_TYPE_TIMESTAMP.",
				hash ".DB_TYPE_ASCII(255).",
				secret VARBINARY(20) NOT NULL,
				
				auth_key ".DB_TYPE_ASCII(32*2).",
				last_auth ".DB_TYPE_TIMESTAMP."
			)".DB_CREATE_SUFFIX);
		if (!$ok) break; $TABLE_VERSION++;
	};
	table_Exit($table);
}


// User Access Log
$table = 'SH_TABLE_USER_ACCESS';
if ( in_array(constant($table), $TABLE_LIST) ) {
	$ok = null;

	table_Init($table);
	switch ( $TABLE_VERSION ) {
	case 0:
		$ok = table_Create( $table,
			"CREATE TABLE ".SH_TABLE_PREFIX.constant($table)." (
				id ".DB_TYPE_UID.",
				user ".DB_TYPE_ID.",
					INDEX(user),
				ip ".DB_TYPE_IP.",
					INDEX(ip),
				timestamp ".DB_TYPE_TIMESTAMP.",
					INDEX(timestamp),
				value ".DB_TYPE_INT32."
			)".DB_CREATE_SUFFIX);

//		$ok = table_Create( $table,
//			"CREATE TABLE ".SH_TABLE_PREFIX.constant($table)." (
//				id ".DB_TYPE_UID.",
//				user ".DB_TYPE_ID.",
//					INDEX(user),
//				ip ".DB_TYPE_IP.",
//					INDEX(ip),
//					UNIQUE `user_ip` (user, ip),
//				first_access ".DB_TYPE_TIMESTAMP.",
//				last_access ".DB_TYPE_TIMESTAMP.",
//				total ".DB_TYPE_UINT64."
//			)".DB_CREATE_SUFFIX);
		if (!$ok) break; $TABLE_VERSION++;
	};
	table_Exit($table);
}


$table = 'SH_TABLE_USER_STRIKE';
if ( in_array(constant($table), $TABLE_LIST) ) {
	$ok = null;

	table_Init($table);
	switch ( $TABLE_VERSION ) {
	case 0:
		$ok = table_Create( $table,
			"CREATE TABLE ".SH_TABLE_PREFIX.constant($table)." (
				id ".DB_TYPE_UID.",
				user ".DB_TYPE_ID.",
					INDEX(user),
				node ".DB_TYPE_ID.",
				timestamp ".DB_TYPE_TIMESTAMP.",
				reason TEXT NOT NULL
			)".DB_CREATE_SUFFIX);
		if (!$ok) break; $TABLE_VERSION++;
	};
	table_Exit($table);
}


$table = 'SH_TABLE_USER_RESERVED';
if ( in_array(constant($table), $TABLE_LIST) ) {
	$ok = null;

	table_Init($table);
	switch ( $TABLE_VERSION ) {
	case 0:
		$ok = table_Create( $table,
			"CREATE TABLE ".SH_TABLE_PREFIX.constant($table)." (
				id ".DB_TYPE_UID.",
				slug ".DB_TYPE_ASCII(64).",
					INDEX(slug),
				mail ".DB_TYPE_UNICODE3(254)."
			)".DB_CREATE_SUFFIX);
		if (!$ok) break; $TABLE_VERSION++;
	};
	table_Exit($table);
}
