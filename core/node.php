<?php
/**
 * Node
 *
 * @file
 */
 
require_once __DIR__ . "/../db.php";
require_once __DIR__ . "/user.php";

// NOTE: None of these functions sanitize. Make sure you sanitize first! //

function node_Add( $type, $subtype, $slug, $name, $body, $author, $parent, $publish = false ) {
	db_Connect();

	db_Query(
		"INSERT `" . CMW_TABLE_NODE . "` (".
			"`type`,".
			"`subtype`,".
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
			"\"".$subtype."\"," .
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

function node_AddMeta( $id_a, $id_b, $type, $subtype, $data ) {
	db_Connect();
	
	db_Query(
		"INSERT `" . CMW_TABLE_NODE_META . "` (".
			"`id_a`,".
			"`id_b`,".
			"`type`,".
			"`subtype`,".
			"`data`".
		") ".
		"VALUES (" .
			$id_a."," .
			$id_b."," .
			"\"".$type."\"," .
			"\"".$subtype."\"," .
			"\"".$data."\"" .
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

function node_GetNodesByAuthorId( $author, $limit = 128, $offset = 0 ) {
	db_Connect();

	$items = db_Fetch( 
		"SELECT * FROM `" . CMW_TABLE_NODE . "` WHERE ".
			"`author`=" . $author .
			" ORDER BY `id` ASC " .
			" LIMIT " . $limit . " OFFSET " . $offset .
		";");
	
	return $items;
}
function node_GetNodesByParentId( $parent, $limit = 128, $offset = 0 ) {
	db_Connect();

	$items = db_Fetch( 
		"SELECT * FROM `" . CMW_TABLE_NODE . "` WHERE ".
			"`parent`=" . $parent .
			" ORDER BY `id` ASC " .
			" LIMIT " . $limit . " OFFSET " . $offset .
		";");
	
	return $items;
}


function node_GetNodesByAuthorIdAndType( $author, $type, $limit = 128, $offset = 0 ) {
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
function node_GetNodesByParentIdAndType( $parent, $type, $limit = 128, $offset = 0 ) {
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

function node_GetMetasById( $id ) {
	db_Connect();

	$metas = db_Fetch(
		"SELECT id_a,id_b,type,subtype,data FROM `" . CMW_TABLE_NODE_META . "` WHERE ".
			"`id_a`=" . $id . " OR " .
			"`id_b`=" . $id .
		";");

	//print_r($metas);
	
	// TODO: support prefixes. # for number, ! for boolean, [] always an array, ? for time-date (maybe)

	if ( count($metas) ) {
		$ret = [];
		foreach ( $metas as $meta ) {
			// A-Id Meta //
			if ( $meta['id_a'] === $id ) {
				// No B-Id //
				if ( empty($meta['id_b']) ) {
					// No Subtype //
					if ( empty($meta['subtype']) ) {
						// If data is already set, we need to make an array //
						if ( isset($ret[$meta['type']]) ) {
							// If not an array, insert old value in to an array //
							if ( !is_array($ret[$meta['type']]) ) {
								$ret[$meta['type']] = array($ret[$meta['type']]);
							}
							// Append the new value //
							$ret[$meta['type']][] = $meta['data'];
						}
						// Otherwise, assign the value //
						else {
							$ret[$meta['type']] = $meta['data'];
						}
					}
					// With Subtype //
					else {
						// If type not set, add an array to hold subtypes //
						if ( !isset($ret[$meta['type']]) ) {
							$ret[$meta['type']] = [];
						}
						// If SubType is set, make it an array //
						if ( isset($ret[$meta['type']][$meta['subtype']]) ) {
							// If not an array, insert old value in to an array //
							if ( !is_array($ret[$meta['type']][$meta['subtype']]) ) {
								$ret[$meta['type']][$meta['subtype']] = array($ret[$meta['type']][$meta['subtype']]);
							}
							// Append the new value //
							$ret[$meta['type']][$meta['subtype']][] = $meta['data'];
						}
						// Othewise, assign the value //
						else {
							$ret[$meta['type']][$meta['subtype']] = $meta['data'];
						}
					}
				}
				// With B-Id //
				else {
					// If type not set, add an array to hold B-Id's //
					if ( !isset($ret[$meta['type']]) ) {
						$ret[$meta['type']] = [];
					}
					// If no subtype, we add values directly under B-Ids
					if ( empty($meta['subtype']) ) {
						// If B-Id already exists, we need to make it an array //
						if ( isset($ret[$meta['type']][$meta['id_b']]) ) {
							// If not an array, insert the old value in to an array //
							if (!is_array($ret[$meta['type']][$meta['id_b']])) {
								$ret[$meta['type']][$meta['id_b']] = array($ret[$meta['type']][$meta['id_b']]);
							}
							// Append the new value //
							$ret[$meta['type']][$meta['id_b']][] = $meta['data'];
						}
						// Otherwise, assign it. //
						else {
							$ret[$meta['type']][$meta['id_b']] = $meta['data'];
						}
					}
					// Has a Subtype //
					else {
//					// If B-Id not found, add an array to hold  //
//					if ( !isset($ret[$meta['type']][$meta['id_b']]) ) {
//						$ret[$meta['type']][$meta['id_b']] = [];
//					}
					}
				}
			}
			// B-Id Metas //
			else {
				
			}
		}
		
		return $ret;
	}
	return [];
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
