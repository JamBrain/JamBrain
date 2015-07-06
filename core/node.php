<?php
/**
 * Node
 *
 * @file
 */
 
require_once __DIR__ . "/../db.php";
require_once __DIR__ . "/user.php";

// NOTE: None of these functions sanitize. Make sure you sanitize first! //

function node_Add( $type, $slug, $name, $body, $author = 0, $parent = 0, $publish = false ) {
	db_Connect();

	db_Query(
		"INSERT `" . CMW_TABLE_NODE . "` (".
			"`type`,".
			"`slug`,".
			"`name`,".
			"`body`,".
			"`author`,".
			"`parent`,".
			"`time_created`,".
			"`time_modified`,".
			"`time_published`".
		") ".
		"VALUES (" .
			"\"".$type."\"," .
			"\"".$slug."\"," .
			"\"".$name."\"," .
			"\"".$body."\"," .
			$author."," .
			$parent."," .
			"NOW()," .
			"NOW()," .
			($publish ? "NOW()" : "\"0000-00-00 00:00:00\"") .
		");");
		
	// TODO: do something on db_query error

	return db_GetId();
}


function node_AddUser( $id, $mail, $password ) {
	db_Connect();
	
	$password_hash = user_HashPassword($password);

	db_Query(
		"INSERT `" . CMW_TABLE_USER . "` (".
			"`node`,".
			"`mail`,".
			"`hash`".
		") ".
		"VALUES (" .
			$id."," .
			"\"".$mail."\"," .
			"\"".$password_hash."\"" .
		");");
		
	// TODO: do something on db_query error

	return db_GetId();
}

function node_GetNodeById( $id ) {
	db_Connect();

	$item = db_Fetch( 
		"SELECT * FROM `" . CMW_TABLE_NODE . "` WHERE ".
			"`id`=" . $id .
			" LIMIT 1" .
		";");
	
	if ( count($item) ) {
		return $item[0];
	}
	return null;
}

//// NOTE: This is not fast. Slugs are not indexed. //
//function node_GetIdBySlug( $slug ) {
//	db_Connect();
//
//	return db_FetchSingle( 
//		"SELECT `id` FROM `" . CMW_TABLE_NODE . "` WHERE ".
//			"`slug`=" . $slug .
//			" LIMIT 1" .
//		";");	
//}

function node_GetUserBySlug( $slug ) {
	db_Connect();

	$user = db_Fetch( 
		"SELECT * FROM `" . CMW_TABLE_NODE . "` WHERE ".
			"`parent`=" . CMW_NODE_USER . " AND " .
			"`slug`=\"" . $slug . "\"" .
			" LIMIT 1" .
		";");
	
	if ( count($user) ) {
		return $user[0];
	}
	return null;
}

function node_GetUserById( $id ) {
	db_Connect();

	$user = db_Fetch(
		"SELECT * FROM `" . CMW_TABLE_NODE . "` WHERE ".
			"`parent`=" . CMW_NODE_USER . " AND " .
			"`id`=" . $id .
			" LIMIT 1" .
		";");
	
	if ( count($user) ) {
		return $user[0];
	}
	return null;
}

function node_GetNodeByParentIdAndSlug( $parent, $slug ) {
	db_Connect();

	$item = db_Fetch( 
		"SELECT * FROM `" . CMW_TABLE_NODE . "` WHERE ".
			"`parent`=" . $parent . " AND " .
			"`slug`=\"" . $slug . "\"" .
			" LIMIT 1" .
		";");
	
	if ( count($item) ) {
		return $item[0];
	}
	return null;
}

function node_GetNodeByAuthorIdAndSlug( $author, $slug ) {
	db_Connect();

	$item = db_Fetch( 
		"SELECT * FROM `" . CMW_TABLE_NODE . "` WHERE ".
			"`author`=" . $author . " AND " .
			"`slug`=\"" . $slug . "\"" .
			" LIMIT 1" .
		";");
	
	if ( count($item) ) {
		return $item[0];
	}
	return null;
}

function node_GetNodesByAuthorId( $author, $limit = 100, $offset = 0 ) {
	db_Connect();

	$items = db_Fetch( 
		"SELECT * FROM `" . CMW_TABLE_NODE . "` WHERE ".
			"`author`=" . $author .
			" ORDER BY `id` ASC " .
			" LIMIT " . $limit . " OFFSET " . $offset .
		";");
	
	return $items;
}
function node_GetNodesByParentId( $parent, $limit = 100, $offset = 0 ) {
	db_Connect();

	$items = db_Fetch( 
		"SELECT * FROM `" . CMW_TABLE_NODE . "` WHERE ".
			"`parent`=" . $parent .
			" ORDER BY `id` ASC " .
			" LIMIT " . $limit . " OFFSET " . $offset .
		";");
	
	return $items;
}


function node_GetNodesByAuthorIdAndType( $author, $type, $limit = 100, $offset = 0 ) {
	db_Connect();

	$items = db_Fetch( 
		"SELECT * FROM `" . CMW_TABLE_NODE . "` WHERE ".
			"`author`=" . $author . " AND " .
			"`type`=\"" . $type . "\"" .
			" ORDER BY `id` ASC " .
			" LIMIT " . $limit . " OFFSET " . $offset .
		";");
	
	return $items;
}
function node_GetNodesByParentIdAndType( $parent, $type, $limit = 100, $offset = 0 ) {
	db_Connect();

	$items = db_Fetch( 
		"SELECT * FROM `" . CMW_TABLE_NODE . "` WHERE ".
			"`parent`=" . $parent . " AND " .
			"`type`=\"" . $type . "\"" .
			" ORDER BY `id` ASC " .
			" LIMIT " . $limit . " OFFSET " . $offset .
		";");
	
	return $items;
}

function node_GetNodeIdByAuthorIdAndSlug( $author, $slug ) {
	db_Connect();

	$item = db_FetchSingle( 
		"SELECT `id` FROM `" . CMW_TABLE_NODE . "` WHERE ".
			"`author`=" . $author . " AND " .
			"`slug`=\"" . $slug . "\"" .
			" LIMIT 1" .
		";");
	
	if ( count($item) ) {
		return $item[0];
	}
	return null;
}
function node_GetNodeIdByParentIdAndSlug( $parent, $slug ) {
	db_Connect();

	$item = db_FetchSingle( 
		"SELECT `id` FROM `" . CMW_TABLE_NODE . "` WHERE ".
			"`parent`=" . $parent . " AND " .
			"`slug`=\"" . $slug . "\"" .
			" LIMIT 1" .
		";");
	
	if ( count($item) ) {
		return $item[0];
	}
	return null;
}

function user_GetHashById( $id ) {
	db_Connect();

	// TODO: Use time-attack safe fetch function

	$hash = db_FetchSingle( 
		"SELECT `hash` FROM `" . CMW_TABLE_USER . "` WHERE ".
			"`node`=" . $id .
			" LIMIT 1" .
		";");
	
	if ( count($hash) ) {
		return $hash[0];
	}
	return null;
}

function user_GetHashByMail( $mail ) {
	db_Connect();
	
	// TODO: Use time-attack safe fetch function

	$hash = db_FetchSingle( 
		"SELECT `hash` FROM `" . CMW_TABLE_USER . "` WHERE ".
			"`mail`=\"" . $mail . "\"".
			" LIMIT 1" .
		";");	

	if ( count($hash) ) {
		return $hash[0];
	}
	return null;
}

?>
