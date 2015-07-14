<?php
/**
 * Node
 *
 * @file
 */
 
require_once __DIR__."/../db.php";
require_once __DIR__."/internal/cache.php";
require_once __DIR__."/constants.php";
require_once __DIR__."/users.php";

// NOTE: None of these functions sanitize. Make sure you sanitize first! //

$NODES = [];
$ID_BY_PARENT_SLUG = [];
$ID_BY_AUTHOR_SLUG = [];

define('NODE_TTL',60*3);

function node_Resolve( $action ) {
	$paths = [ CMW_NODE_ROOT ];
	foreach( $action as $key => $slug ) {
		$id = node_GetNodeIdByParentIdAndSlug($paths[$key],$slug);
		if ( !empty($id) )
			$paths[] = $id;
		else
			return null;		
	}
	
	return $paths;
}

// Prefetch Node Data 
function node_Prefetch( $nodes ) {
	
}

$NODE_SCHEMA = [
	'id' => CMW_FIELD_TYPE_INT,
	'parent' => CMW_FIELD_TYPE_INT,
	'author' => CMW_FIELD_TYPE_INT,

	'time_created' => CMW_FIELD_TYPE_DATETIME,
	'time_modified' => CMW_FIELD_TYPE_DATETIME,
	'time_published' => CMW_FIELD_TYPE_DATETIME,

	'comment_count' => CMW_FIELD_TYPE_INT,
	'love_count' => CMW_FIELD_TYPE_INT,
	'favourite_count' => CMW_FIELD_TYPE_INT,
	'popularity' => CMW_FIELD_TYPE_INT,
];

function node_Add( $type, $subtype, $slug, $name, $body, $author, $parent, $publish = false, $publish_offset = 0 ) {
	db_Connect();
	
	$time = "DATE_ADD(NOW(),INTERVAL " . $publish_offset . " SECOND)";

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
			$time . "," .
			$time . "," .
			($publish ? $time : "\"0000-00-00 00:00:00\"") .
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
	global $NODES;	
	if ( isset($NODES[$id]) ) {
		$ret = &$NODES[$id];
		return $ret;
	}
	$node = node_DBGetNodesByIds( [$id] );
	if ( !empty($node) ) {
		return $node[$id];
	}
	return null;
}
function node_GetNodesByIds( $ids ) {
	global $NODES;
	$ret = [];
	foreach( $ids as $key => &$id ) {
		if ( isset($NODES[$id]) ) {
			$ret[$id] = &$NODES[$id];
			unset($ids[$key]);
		}
	}
	
	// All nodes found in RAM //
	if ( count($ids) == 0 )
		return $ret;

 	return array_replace($ret,node_DBGetNodesByIds($ids));
}

function node_DBGetNodesByIds( $ids ) {
	global $NODES;
	$ret = [];
	
	// Fetch from Cache
	foreach( $ids as $key => &$id ) {
		$cached = cache_Fetch( "node$".$id );
		if ( $cached ) {
			$NODES[$id] = $cached;
			$ret[$id] = &$NODES[$id];
			unset($ids[$key]);
		}
	}
	$id_count = count($ids);
	
	// All nodes found in Cache //
	if ( $id_count === 0 )
		return $ret;
	
	// Fetch remaining nodes //
	global $NODE_SCHEMA;
	db_Connect();

	if ( $id_count === 1 ) {
		$items = db_Fetch(
			"SELECT * FROM `" . CMW_TABLE_NODE . "` WHERE ".
				"`id`=" . $id .
				" LIMIT 1" .
			";", $NODE_SCHEMA);
	}
	else {
		$items = db_Fetch(
			"SELECT * FROM `" . CMW_TABLE_NODE . "` WHERE ".
				"`id` in (" . implode(',',$ids) . ")" .
			";", $NODE_SCHEMA);
	}

	// Cache them as needed //
	foreach( $items as $item ) {
		$id = &$item['id'];
		$NODES[$id] = $item;
		cache_Store( "node$".$id, $item, NODE_TTL );
		$ret[$id] = &$NODES[$id];
	}

	// Finished //
	return $ret;
}

function node_GetUserBySlug( $slug ) {
	db_Connect();

	$user = db_Fetch(
		"SELECT * FROM `" . CMW_TABLE_NODE . "` WHERE ".
			"`parent`=" . CMW_NODE_USER . " AND " .
			"`slug`=\"" . $slug . "\"" .
			" LIMIT 1" .
		";");
	
	if ( !empty($user) ) {
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
	
	if ( !empty($user) ) {
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
	
	if ( !empty($item) ) {
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
	
	if ( !empty($item) ) {
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
	
	if ( !empty($item) ) {
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
	
	if ( !empty($item) ) {
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


function node_GetPosts( $limit = 10, $offset = 0 ) {
	global $NODE_SCHEMA;
	db_Connect();

	$items = db_Fetch(
	//echo(
		"SELECT * FROM `" . CMW_TABLE_NODE . "` WHERE ".
			"`time_published` != " . "'0000-00-00 00:00:00'" . " AND " .
			"`type`=" . "\"post\"" .
			" ORDER BY `time_published` DESC" .
			" LIMIT " . $limit . " OFFSET " . $offset .
		";", $NODE_SCHEMA);
	
	return $items;
}
?>
