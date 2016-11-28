<?php

// For fetching subscriptions
function node_GetPublishedIdModifiedByParentType( $parent, $types = null, $limit = 20, $offset = 0 ) {
	$query_suffix = ';';	// do we want this anymore?
		
	if ( is_integer($parent) ) {
		$parent = [$parent];
	}

	if ( is_array($parent) ) {
		// Confirm that all IDs are not zero
		foreach( $parent as $id ) {
			if ( intval($id) == 0 )
				return null;
		}

		// Build IN string
		$ids_string = implode(',', $parent);
		
		if ( $types ) {
			if ( !is_array($types) ) {
				$types = [$types];
			}
			
			$types_string = '"'.implode('","', $types).'"';
			
			return db_QueryFetchPair(
				"SELECT id, ".DB_FIELD_DATE('modified')." 
				FROM ".SH_TABLE_PREFIX.SH_TABLE_NODE." 
				WHERE parent IN ($ids_string) AND type IN ($types_string) AND published > CONVERT(0,DATETIME)
				ORDER BY published DESC
				LIMIT ? OFFSET ?
				".$query_suffix,
				$limit, $offset
			);			
		}
		else {
			return db_QueryFetchPair(
				"SELECT id, ".DB_FIELD_DATE('modified')." 
				FROM ".SH_TABLE_PREFIX.SH_TABLE_NODE." 
				WHERE parent IN ($ids_string) AND published > CONVERT(0,DATETIME)
				ORDER BY published DESC
				LIMIT ? OFFSET ?
				".$query_suffix,
				$limit, $offset
			);
		}
	}
	
	return null;
}

function nodeVersion_Add( $node, $author, $type, $subtype, $subsubtype, $slug, $name, $body, $tag = "" ) {
	$ret = db_QueryInsert(
		"INSERT IGNORE INTO ".SH_TABLE_PREFIX.SH_TABLE_NODE_VERSION." (
			node,
			author, 
			type, subtype, subsubtype, 
			timestamp,
			slug, name, body,
			tag
		)
		VALUES ( 
			?,
			?,
			?, ?, ?,
			NOW(),
			?, ?, ?,
			?
		)",
		$node,
		$author,
		$type, $subtype, $subsubtype,
		/**/
		$slug, $name, $body,
		$tag
	);
	
	return $ret;
}


function node_Add( $parent, $author, $type, $subtype, $subsubtype, $slug, $name, $body ) {
	// TODO: wrap this in a block
	$node = db_QueryInsert(
		"INSERT IGNORE INTO ".SH_TABLE_PREFIX.SH_TABLE_NODE." (
			created
		)
		VALUES ( 
			NOW()
		)"
	);

	$edit = node_Edit( $node, $parent, $author, $type, $subtype, $subsubtype, $slug, $name, $body, "!ZERO" );
	
	return $node;
}

function node_Edit( $node, $parent, $author, $type, $subtype, $subsubtype, $slug, $name, $body, $tag = "" ) {
	$version = nodeVersion_Add( $node, $author, $type, $subtype, $subsubtype, $slug, $name, $body, $tag );

	$success = db_QueryUpdate(
		"UPDATE ".SH_TABLE_PREFIX.SH_TABLE_NODE."
		SET
			parent=?, author=?,
			type=?, subtype=?, subsubtype=?,
			modified=NOW(),
			version=?,
			slug=?, name=?, body=?
		WHERE
			id=?;",
		$parent, $author,
		$type, $subtype, $subsubtype,
		/**/
		$version,
		$slug, $name, $body,
		
		$node
	);
	
	return $success;
}

function node_Publish( $node, $state = true ) {
	if ( $state ) {
		return db_QueryUpdate(
			"UPDATE ".SH_TABLE_PREFIX.SH_TABLE_NODE."
			SET
				published=NOW()
			WHERE
				id=?;",
			$node
		);
	}
	
	// Unpublish
	return db_QueryUpdate(
		"UPDATE ".SH_TABLE_PREFIX.SH_TABLE_NODE."
		SET
			published=0
		WHERE
			id=?;",
		$node
	);
}


function node_GetIdByType( $types ) {
	if ( is_string($types) ) {
		$types = [$types];
	}
	
	if ( is_array($types) ) {
		$types_string = '"'.implode('","', $types).'"';

		return db_QueryFetchSingle(
			"SELECT id
			FROM ".SH_TABLE_PREFIX.SH_TABLE_NODE." 
			WHERE type IN ($types_string)
			"
		);
	}
	
	return null;
//	
//	// hack
//	return [100,101];
}

function node_GetIdByParentSlug( $parent, $slug ) {
	$query_suffix = ';';	// do we want this anymore?

	return db_QueryFetchValue(
		"SELECT id
		FROM ".SH_TABLE_PREFIX.SH_TABLE_NODE." 
		WHERE parent=? AND slug=?
		LIMIT 1
		".$query_suffix,
		$parent, $slug
	);
}

// Get All Functions

function node_GetById( $ids ) {
	$multi = is_array($ids);
	if ( !$multi )
		$ids = [$ids];
	
	if ( is_array($ids) ) {
		// Confirm that all IDs are not zero
		foreach( $ids as $id ) {
			if ( intval($id) == 0 )
				return null;
		}

		// Build IN string
		$ids_string = implode(',', $ids);

		$ret = db_QueryFetch(
			"SELECT id, parent, author,
				type, subtype, subsubtype,
				".DB_FIELD_DATE('published').",
				".DB_FIELD_DATE('created').",
				".DB_FIELD_DATE('modified').",
				version,
				slug, name, body
			FROM ".SH_TABLE_PREFIX.SH_TABLE_NODE." 
			WHERE id IN ($ids_string);"
		);
		
		if ( $multi )
			return $ret;
		else
			return $ret ? $ret[0] : null;
	}
	
	return null;
}

// This isn't what you want
function nodeMeta_GetById( $ids ) {
	if ( is_integer($ids) ) {
		$ids = [$ids];
	}
	
	if ( is_array($ids) ) {
		// Confirm that all IDs are not zero
		foreach( $ids as $id ) {
			if ( intval($id) == 0 )
				return null;
		}

		// Build IN string
		$ids_string = implode(',', $ids);

		return db_QueryFetch(
			"SELECT node, scope, `key`, `value`
			FROM ".SH_TABLE_PREFIX.SH_TABLE_NODE_META." 
			WHERE id IN ($ids_string)
			"
		);
	}
	
	return null;
}

function nodeMeta_GetByNode( $nodes ) {
	$multi = is_array($nodes);
	if ( !$multi )
		$nodes = [$nodes];
	
	if ( is_array($nodes) ) {
		// Confirm that all Nodes are not zero
		foreach( $nodes as $node ) {
			if ( intval($node) == 0 )
				return null;
		}

		// Build IN string
		$node_string = implode(',', $nodes);

		$ret = db_QueryFetch(
			"SELECT node, scope, `key`, `value`
			FROM ".SH_TABLE_PREFIX.SH_TABLE_NODE_META." 
			WHERE node IN ($node_string) AND id IN (
				SELECT MAX(id) FROM ".SH_TABLE_PREFIX.SH_TABLE_NODE_META." GROUP BY node, `key`
			);"
		);
		
		if ( $multi )
			return $ret;
		else
			return $ret ? $ret[0] : null;
	}
	
	return null;
}

// This isn't what you want
function nodeLink_GetById( $ids ) {
	if ( is_integer($ids) ) {
		$ids = [$ids];
	}
	
	if ( is_array($ids) ) {
		// Confirm that all IDs are not zero
		foreach( $ids as $id ) {
			if ( intval($id) == 0 )
				return null;
		}

		// Build IN string
		$ids_string = implode(',', $ids);

		return db_QueryFetch(
			"SELECT a, b, type
			FROM ".SH_TABLE_PREFIX.SH_TABLE_NODE_LINK." 
			WHERE id IN ($ids_string)
			"
		);
	}
	
	return null;
}

function nodeLink_GetByNode( $nodes ) {
	$multi = is_array($nodes);
	if ( !$multi )
		$nodes = [$nodes];
	
	if ( is_array($nodes) ) {
		// Confirm that all Nodes are not zero
		foreach( $nodes as $node ) {
			if ( intval($node) == 0 )
				return null;
		}

		// Build IN string
		$node_string = implode(',', $nodes);

		$ret = db_QueryFetch(
			"SELECT a, b, type
			FROM ".SH_TABLE_PREFIX.SH_TABLE_NODE_LINK." 
			WHERE a IN ($node_string) OR b IN ($node_string);"
		);
		
		if ( $multi )
			return $ret;
		else
			return $ret ? $ret[0] : null;
	}
	
	return null;
}


function nodeComplete_GetById( $ids, $scope = 0 ) {
	$multi = is_array($ids);
	if ( !$multi )
		$ids = [$ids];
	
	$nodes = node_GetById($ids);
	if ( !$nodes )
		return null;
	
	$metas = nodeMeta_GetByNode($ids);
	$links = nodeLink_GetByNode($ids);
	$loves = nodeLove_GetByNode($ids);
		
	// Populate Links		
	foreach ( $nodes as &$node ) {
		$node['a'] = [];
		$node['b'] = [];
		
		foreach ( $links as $link ) {
			// Question: Should we support circular links (i.e. remove "else" from "else if")?
			
			if ( $node['id'] === $link['a'] ) {
				if ( isset($node['a'][$link['type']]) ) {
					$node['a'][$link['type']][] = $link['b'];
				}
				else {
					$node['a'][$link['type']] = [$link['b']];
				}
			}
			else if ( $node['id'] === $link['b'] ) {
				if ( isset($node['b'][$link['type']]) ) {
					$node['b'][$link['type']][] = $link['a'];
				}
				else {
					$node['b'][$link['type']] = [$link['a']];
				}
			}
		}
	}

	//$scope = 0;
	
	// Populate Metadata
	foreach ( $nodes as &$node ) {
		$node['meta'] = [];
		
		foreach ( $metas as $meta ) {
			if ( $node['id'] === $meta['node'] ) {
				if ( $meta['scope'] <= $scope ) {
					$node['meta'][$meta['key']] = $meta['value'];
				}
			}
		}
		//sort($node['meta']);
	}
	
	// Populate Love
	foreach ( $nodes as &$node ) {
		$node['love'] = 0;
		
		foreach ( $loves as $love ) {
			if ( $node['id'] === $love['node'] ) {
				$node['love'] = $love['count'];
				$node['love-timestamp'] = $love['timestamp'];
			}
		}
	}
	
	// Populate Comment Count
//	foreach ( $nodes as &$node ) {
//		$node['comments'] = 0;
//		
//	}

	if ($multi)
		return $nodes;
	else
		return $nodes[0];
}


function nodeLove_GetByNode( $nodes ) {
	$multi = is_array($nodes);
	if ( !$multi )
		$nodes = [$nodes];
	
	if ( is_array($nodes) ) {
		// Confirm that all Nodes are not zero
		foreach( $nodes as $node ) {
			if ( intval($node) == 0 )
				return null;
		}

		// Build IN string
		$node_string = implode(',', $nodes);

		$ret = db_QueryFetch(
			"SELECT node, COUNT(node) AS count, ".DB_FIELD_DATE('MAX(timestamp)','timestamp')."
			FROM ".SH_TABLE_PREFIX.SH_TABLE_NODE_LOVE." 
			WHERE node IN ($node_string)
			GROUP BY node".($multi?';':' LIMIT 1;')
		);
		
		if ( $multi )
			return $ret;
		else
			return $ret ? $ret[0] : null;
	}
	
	return null;
}

/// Can only add 1 love at a time
function nodeLove_AddByNode( $node, $author ) {
	if ( is_array($node) ) {
		return null;
	}
	
	if ( !$node )
		return null;

	// Anonymous Love support requires newer MYSQL 5.6.3+. Scotchbox ships with 5.5.x.		
	if ( $author ) {
		$ip = 0;
	}
	else {
		$ip = $_SERVER['REMOTE_ADDR'];
	}
	
	return db_QueryInsert(
		"INSERT IGNORE INTO ".SH_TABLE_PREFIX.SH_TABLE_NODE_LOVE." (
			node,
			author,
			ip,
			timestamp
		)
		VALUES ( 
			?,
			?,
			INET6_ATON(?),
			NOW()
		);",
		$node,
		$author,
		$ip
	);
}
