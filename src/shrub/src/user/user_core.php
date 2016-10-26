<?php

// NOTE: Confirming an e-mail address BEFORE entering account credentials is BEST!
// This avoids the problem where you enter the wrong e-mail address as you sign up sign up.

// Create an account
//  if $mail doesn't exist
//   mail = blah@blah.com
//   node = 0
//   created = NOW()
//   auth_key = RANDOM_BYTES
//   last_auth = 0:00:00
//   do( email_Send( mail, auth_key, $redirect_url )
//
// website.com/#user-activate?id=5862&key=aeo8du8aodu8
// api.website.com/vx/user/activate [id=5862&key=aeo8du8aodu8]

// Activate an account (and partially activate an account)
//  lookup $id by id (not node)
//  does $key match?
//   no: erase auth_key, stop
//   yes: set last_auth to NOW()
//   is node 0? ***
//    no: stop
//    yes:
//    is $name set and strlen() >= 3
//     is $pw set and strlen() >= 8
//      yes:
//      is node $user available
//       yes:
//       is on reserved list
//        no: hash($pw) to hash, create a node named $user, erase auth_key
//        yes:
//        does $mail match?
//         yes: hash($pw) to hash, create a node named $user, erase auth_key
//
// api.website.com/vx/user/activate [id=5862&key=aeo8du8aodu8&name=homeboy&pw=potatoes]

// *** //

const _SH_USER_ROW_MAP = [
	'id'=>SH_FIELD_TYPE_INT,
	'node'=>SH_FIELD_TYPE_INT,
//	'created'=>SH_FIELD_TYPE_DATETIME,
//	'last_auth'=>SH_FIELD_TYPE_DATETIME,
];
	

/// @retval Array[String=>String] Since ID's are unique, there will only ever be one
function user_GetById( $id, $query_suffix = ";" ) {
	$ret = db_QueryFetchFirst(
		"SELECT id,node,mail,".DB_FIELD_DATE('created').",hash,HEX(secret) AS secret,auth_key,".DB_FIELD_DATE('last_auth')."
		FROM ".SH_TABLE_PREFIX.SH_TABLE_USER." 
		WHERE id=?
		LIMIT 1".$query_suffix,
		$id
	);
	return db_ParseRow($ret, _SH_USER_ROW_MAP);
}

// @retval Array[Array[String=>String] 
function user_GetByNode( $node, $query_suffix = ";" ) {
	$ret = db_QueryFetch(
		"SELECT id,node,mail,".DB_FIELD_DATE('created').",hash,HEX(secret) AS secret,auth_key,".DB_FIELD_DATE('last_auth')."
		FROM ".SH_TABLE_PREFIX.SH_TABLE_USER." 
		WHERE node=?".$query_suffix,
		$node
	);
	return db_ParseRows($ret, _SH_USER_ROW_MAP);
}

/// @retval Array[String=>String] Since emails are unique, there will only ever be one
function user_GetByMail( $mail, $query_suffix = ";" ) {
	$ret = db_QueryFetchFirst(
		"SELECT id,node,mail,".DB_FIELD_DATE('created').",hash,HEX(secret) AS secret,auth_key,".DB_FIELD_DATE('last_auth')."
		FROM ".SH_TABLE_PREFIX.SH_TABLE_USER." 
		WHERE mail=?
		LIMIT 1".$query_suffix,
		$mail
	);
	return db_ParseRow($ret, _SH_USER_ROW_MAP);
}

// @retval Array[Array[String=>String] 
function user_GetBySlug( $slug, $query_suffix = ";" ) {
//	//$node = nodeCache_GetBySlug($slug, $query_suffix);
//	$node = node_GetBySlug($slug, $query_suffix);
//	return user_GetByNode($node, $query_suffix);
}


// *** //

/// @retval Integer 1 if found, 0 if not
function user_CountByMail( $mail, $query_suffix = ';' ) {
	return db_QueryFetchValue(
		"SELECT count(id) FROM ".SH_TABLE_PREFIX.SH_TABLE_USER." 
		WHERE mail=?
		LIMIT 1".$query_suffix,
		$mail
	);
}

// @retval Integer 0 or more
function user_CountByNode( $node, $query_suffix = ';' ) {
	return db_QueryFetchValue(
		"SELECT count(id) FROM ".SH_TABLE_PREFIX.SH_TABLE_USER." 
		WHERE node=?
		LIMIT 1".$query_suffix,
		$node
	);
}

// *** //

function user_Add( $mail, $node = 0 ) {
	$key = userAuthKey_Gen();
	$id = db_QueryInsert(
		"INSERT IGNORE INTO ".SH_TABLE_PREFIX.SH_TABLE_USER." (
			node, mail, created, auth_key, last_auth
		)
		VALUES ( 
			?, ?, NOW(), ?, 0
		)",
		$node, $mail, $key
	);
	
	if ( $id ) {
		$ret = [];
		$ret['id'] = $id;
		$ret['auth_key'] = $key;
		return $ret;
	}
	return null;
}

// *** //

function user_ClearAuthKey() {
	
}

// *** //

function userAuthKey_Gen() {
	return bin2hex(openssl_random_pseudo_bytes(32));
}
