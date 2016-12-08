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

/// NOTE: By default, this ignores any node with a scope less than 0 (that is how deleting works)
/// Pass $scope_check as null to get everything, or "=64" to get specific
function nodeMeta_GetByNode( $nodes, $scope_check = ">=0" ) {
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
		
		if ( empty($scope_check) ) {
			$scope_check_string = "";
		}
		else {
			$scope_check_string = "scope".$scope_check." AND";
		}

//		// Original Query
//		SELECT node, scope, `key`, `value`
//		FROM sh_node_meta 
//		WHERE scope>=0 AND node IN (11,12) AND id IN (
//			SELECT MAX(id) FROM sh_node_meta GROUP BY node, `key`
//		);

//		// Potential faster query (uses where)	
//		SELECT node, scope, `key`, `value`
//		FROM sh_node_meta 
//		WHERE scope>=0 AND node IN (11,12) AND id IN (
//			SELECT MAX(id) FROM sh_node_meta WHERE scope>=0 AND node IN (11,12) GROUP BY node, `key`
//		);

//		// Potentially even faster
//		SELECT _in.node, _in.scope, _in.key, _in.value
//		FROM (
//		    SELECT node, scope, `key`, `value`, MAX(id) AS max_id
//		    FROM sh_node_meta
//		    WHERE scope>=0 AND node IN (11,12)
//		    GROUP BY node, `key`
//		) _out
//		JOIN sh_node_meta _in
//		ON _in.id = _out.max_id

//		// More concice
//		SELECT _in.node, _in.scope, _in.key, _in.value
//		FROM (
//		    SELECT MAX(id) AS max_id
//		    FROM sh_node_meta
//		    WHERE scope>=0 AND node IN (11,12)
//		    GROUP BY node, `key`
//		) _out
//		JOIN sh_node_meta _in
//		ON _in.id = _out.max_id


		// http://stackoverflow.com/questions/1299556/sql-group-by-max
		
		// NOTE: This query may need some work. The subquery may be doing a full table scan
		$ret = db_QueryFetch(
			"SELECT node, scope, `key`, `value`
			FROM ".SH_TABLE_PREFIX.SH_TABLE_NODE_META." 
			WHERE $scope_check_string node IN ($node_string) AND id IN (
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
			"SELECT a, b, scope, `key`, `value`
			FROM ".SH_TABLE_PREFIX.SH_TABLE_NODE_LINK." 
			WHERE id IN ($ids_string)
			"
		);
	}
	
	return null;
}

function nodeLink_GetByNode( $nodes, $scope_check = ">=0" ) {
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

		if ( empty($scope_check) ) {
			$scope_check_string = "";
		}
		else {
			$scope_check_string = "scope".$scope_check." AND";
		}

		// NOTE: This may be poor performing once we have more nodes. See Meta above for some optimization homework
		$ret = db_QueryFetch(
			"SELECT a, b, scope, `key`, `value`
			FROM ".SH_TABLE_PREFIX.SH_TABLE_NODE_LINK." 
			WHERE $scope_check_string (a IN ($node_string) OR b IN ($node_string)) AND id IN (
				SELECT MAX(id) FROM ".SH_TABLE_PREFIX.SH_TABLE_NODE_LINK." GROUP BY a, b, `key`
			);"
		);
//			WHERE a IN ($node_string) OR b IN ($node_string);"
		
		if ( $multi )
			return $ret;
		else
			return $ret ? $ret[0] : null;
	}
	
	return null;
}


function nodeMeta_ParseByNode( $node_ids ) {
	$multi = is_array($node_ids);
	if ( !$multi )
		$node_ids = [$node_ids];
	
	$metas = nodeMeta_GetByNode($node_ids);

	$ret = [];

	// Populate Metadata (NOTE: This is a full-scan per node requested. Could be quicker)
	foreach ( $node_ids as $node_id ) {
		$raw_meta = [];

		foreach ( $metas as $meta ) {
			// If this item in the meta list belongs to us
			if ( $node_id === $meta['node'] ) {
				// Create Scope array (if missing)
				if ( isset($raw_meta[$meta['scope']]) && !is_array($raw_meta[$meta['scope']]) ) {
					$raw_meta[$meta['scope']] = [];
				}
				
				// Store
				$raw_meta[$meta['scope']][$meta['key']] = $meta['value'];
			}
		}
//		arsort($raw_meta);
		
		$ret[$node_id] = $raw_meta;
	}
	
	if ($multi)
		return $ret;
	else
		return $ret[$node_ids[0]];
}


function nodeLink_ParseByNode( $node_ids ) {
	$multi = is_array($node_ids);
	if ( !$multi )
		$node_ids = [$node_ids];
	
	$links = nodeLink_GetByNode($node_ids);

	$ret = [];

	// Populate Metadata (NOTE: This is a full-scan per node requested. Could be quicker)
	foreach ( $node_ids as $node_id ) {
		$raw_a = [];
		$raw_b = [];
		
		foreach ( $links as $link ) {
			// Question: Should we support circular links (i.e. remove "else" from "else if")?
			if ( $node_id === $link['a'] ) {
				if ( isset($raw_a[$link['scope']]) && !is_array($raw_a[$link['scope']]) ) {
					$raw_a[$link['scope']] = [];
				}

				if ( $link['value'] === null ) {
					if ( isset($raw_a[$link['scope']][$link['key']]) ) {
						$raw_a[$link['scope']][$link['key']][] = $link['b'];
					}
					else {
						$raw_a[$link['scope']][$link['key']] = [$link['b']];
					}
				}
				else {
					if ( isset($raw_a[$link['scope']][$link['key']]) ) {
						$raw_a[$link['scope']][$link['key']][$link['b']] = $link['value'];
					}
					else {
						$raw_a[$link['scope']][$link['key']] = [$link['b'] => $link['value']];
					}
				}
			}
			else if ( $node_id === $link['b'] ) {
				if ( isset($raw_b[$link['scope']]) && !is_array($raw_b[$link['scope']]) ) {
					$raw_b[$link['scope']] = [];
				}

				if ( $link['value'] === null ) {
					if ( isset($raw_b[$link['scope']][$link['key']]) ) {
						$raw_b[$link['scope']][$link['key']][] = $link['a'];
					}
					else {
						$raw_b[$link['scope']][$link['key']] = [$link['a']];
					}
				}
				else {
					if ( isset($raw_b[$link['scope']][$link['key']]) ) {
						$raw_b[$link['scope']][$link['key']][$link['a']] = $link['value'];
					}
					else {
						$raw_b[$link['scope']][$link['key']] = [$link['a'] => $link['value']];
					}
				}
			}
		}
//		asort($raw_a);
//		asort($raw_b);

		//$raw_b[77] = 'horse';

		$ret[$node_id] = [$raw_a, $raw_b];
	}
	
	if ($multi)
		return $ret;
	else
		return $ret[$node_ids[0]];
}




function nodeComplete_GetById( $ids, $scope = 0 ) {
	$multi = is_array($ids);
	if ( !$multi )
		$ids = [$ids];
	
	$nodes = node_GetById($ids);
	if ( !$nodes )
		return null;
	
	$metas = nodeMeta_ParseByNode($ids);
	$links = nodeLink_ParseByNode($ids);

	$loves = nodeLove_GetByNode($ids);

	// Populate Metadata
	foreach ( $nodes as &$node ) {
		// Store Public Metadata
		if ( isset($metas[$node['id']][SH_NODE_META_PUBLIC]) ) {
			$node['meta'] = $metas[$node['id']][SH_NODE_META_PUBLIC];
		}
		else {
			$node['meta'] = [];
		}

		// TODO: Store Protected and Private Metadata
	}

	// Populate Links (NOTE: Links come in Pairs)
	foreach ( $nodes as &$node ) {
		if ( isset($links[$node['id']][0][SH_NODE_META_PUBLIC]) ) {
			$node['link'] = $links[$node['id']][0][SH_NODE_META_PUBLIC];
		}
		else {
			$node['link'] = [];
		}

		// TODO: Store Protected and Private Metadata
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
		$ip = '0.0.0.0';
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

/// Can only remove 1 love at a time
function nodeLove_RemoveByNode( $node, $author ) {
	if ( is_array($node) ) {
		return null;
	}
	
	if ( !$node )
		return null;

	// Anonymous Love support requires newer MYSQL 5.6.3+. Scotchbox ships with 5.5.x.		
	if ( $author ) {
		$ip = '0.0.0.0';
	}
	else {
		$ip = $_SERVER['REMOTE_ADDR'];
	}
	
	return db_QueryDelete(
		"DELETE FROM ".SH_TABLE_PREFIX.SH_TABLE_NODE_LOVE."
		WHERE node=? AND author=? AND ip=INET6_ATON(?);",
		$node,
		$author,
		$ip
	);
}

function nodeLove_GetByAuthor( $author ) {
	if ( is_array($author) ) {
		return null;
	}

	if ( !$author )
		return null;
		
	// TODO: Limit to 500 loves?

	return db_QueryFetchSingle(
		"SELECT node
		FROM ".SH_TABLE_PREFIX.SH_TABLE_NODE_LOVE."
		WHERE author=?;",
		$author
	);
	
	return null;
}



function nodeMeta_AddByNode( $node, $scope, $key, $value ) {
	return db_QueryInsert(
		"INSERT IGNORE INTO ".SH_TABLE_PREFIX.SH_TABLE_NODE_META." (
			node,
			scope,
			`key`,
			`value`,
			timestamp
		)
		VALUES ( 
			?,
			?,			
			?,
			?,
			NOW()
		);",
		$node,
		$scope,
		$key,
		$value
	);
}

// NOTE: Doesn't actually remove, but adds an "ignore-me" entry
function nodeMeta_RemoveByNode( $node, $scope, $key, $value ) {
	return nodeMeta_AddByNode($node, $scope^-1, $key, $value);
}


function nodeLink_AddByNode( $a, $b, $scope, $key, $value = null ) {
	return db_QueryInsert(
		"INSERT IGNORE INTO ".SH_TABLE_PREFIX.SH_TABLE_NODE_LINK." (
			a,
			b,
			
			scope,
			
			`key`,
			`value`,
			timestamp
		)
		VALUES ( 
			?,
			?,
			
			?,
			
			?,
			?,
			NOW()
		);",
		$a,
		$b,
		
		$scope,
		
		$key,
		$value
	);
}

// NOTE: Doesn't actually remove, but adds an "ignore-me" entry
function nodeLink_RemoveByNode( $a, $b, $scope, $key, $value ) {
	return nodeLink_AddByNode($a, $b, $scope^-1, $key, $value);
}
