<?php
/**
 * Node
 *
 * @file
 */
 
require_once __DIR__ . "/../db.php";
require_once __DIR__ . "/user.php";

// NOTE: None of these functions sanitize. Make sure you sanitize first! //

function node_Add( $type, $slug, $name, $body, $author = 0, $parent = 0, $root = 0, $publish = false ) {
	db_Connect();

	db_Query(
		"INSERT `" . CMW_TABLE_NODE . "` (".
			"`type`,".
			"`slug`,".
			"`name`,".
			"`body`,".
			"`author`,".
			"`parent`,".
			"`root`,".
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
			$root."," .
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

//function node_GetById( $id ) {	
//}

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
