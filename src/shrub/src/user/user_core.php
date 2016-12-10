<?php
require_once __DIR__."/../node/node.php";

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
	$node = node_GetIdByParentSlug(SH_NODE_ID_USERS, $slug);
	if ( $node ) {
		$users = user_GetByNode($node, $query_suffix);
	
		// Hack, always return the first user
		if ( count($users) )
			return $users[0];
	}
	return null;
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

function user_SetNode( $id, $node ) {
	return db_QueryUpdate(
		"UPDATE ".SH_TABLE_PREFIX.SH_TABLE_USER."
		SET
			node=?
		WHERE
			id=?;",
		$node, $id
	);
}
function user_SetHash( $id, $hash ) {
	return db_QueryUpdate(
		"UPDATE ".SH_TABLE_PREFIX.SH_TABLE_USER."
		SET
			hash=?
		WHERE
			id=?;",
		$hash, $id
	);
}
// TODO: needs binary conversion for read/write
//function user_SetSecret( $id, $secret ) {
//	return db_QueryUpdate(
//		"UPDATE ".SH_TABLE_PREFIX.SH_TABLE_USER."
//		SET
//			secret=?
//		WHERE
//			id=?;",
//		$secret, $id
//	);
//}

// *** //

function userNode_Add( $slug, $name ) {
	// Don't use regular version. We want to explicitly set superparent
	return _node_Add(
		SH_NODE_ID_USERS,			// parent
		0,							// superparent
		0,							// author
		SH_NODE_TYPE_USER,			// type
		'','',						// subtype, subsubtype
		$slug,						// slug
		$name,						// name
		""							// body
	);
}

// *** //

function user_AuthKeyGen( $id ) {
	$key = userAuthKey_Gen();
	$updated = db_QueryUpdate(
		"UPDATE ".SH_TABLE_PREFIX.SH_TABLE_USER."
		SET
			auth_key=?
		WHERE
			id=?;",
		$key, $id
	);

	if ( $updated ) {
		$ret = [];
		$ret['id'] = $id;
		$ret['auth_key'] = $key;
		return $ret;
	}
	return null;
	
}
function user_AuthKeyClear( $id ) {
	return db_QueryUpdate(
		"UPDATE ".SH_TABLE_PREFIX.SH_TABLE_USER."
		SET
			auth_key=''
		WHERE
			id=?;",
		$id
	);
}

function user_AuthTimeSetNow( $id ) {
	return db_QueryUpdate(
		"UPDATE ".SH_TABLE_PREFIX.SH_TABLE_USER."
		SET
			last_auth=NOW()
		WHERE
			id=?;",
		$id
	);
}

// *** //

function userAuthKey_Gen() {
	return bin2hex(openssl_random_pseudo_bytes(32));
}

// *** //

function userReserved_GetMailBySlug( $slug ) {
	return db_QueryFetchSingle(
		"SELECT mail FROM ".SH_TABLE_PREFIX.SH_TABLE_USER_RESERVED." 
		WHERE slug=?
		;",
		$slug
	);
}

function userReserved_Add( $slug, $mail ) {
	return db_QueryInsert(
		"INSERT IGNORE INTO ".SH_TABLE_PREFIX.SH_TABLE_USER_RESERVED." (
			slug, mail
		)
		VALUES ( 
			?, ?
		)",
		$slug, $mail
	);
}

function userReserved_GetSlugByMail( $mail ) {
	return db_QueryFetchSingle(
		"SELECT slug FROM ".SH_TABLE_PREFIX.SH_TABLE_USER_RESERVED." 
		WHERE mail=?
		;",
		$mail
	);
}

