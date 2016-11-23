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


function node_GetIdByType( $type ) {
	// hack
	return [100,101];
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
			"SELECT id, parent, author,
				type, subtype, subsubtype,
				".DB_FIELD_DATE('published').",
				".DB_FIELD_DATE('created').",
				".DB_FIELD_DATE('modified').",
				version,
				slug, name, body
			FROM ".SH_TABLE_PREFIX.SH_TABLE_NODE." 
			WHERE id IN ($ids_string)
			"
		);
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
	if ( is_integer($nodes) ) {
		$nodes = [$nodes];
	}
	
	if ( is_array($nodes) ) {
		// Confirm that all Nodes are not zero
		foreach( $nodes as $node ) {
			if ( intval($node) == 0 )
				return null;
		}

		// Build IN string
		$node_string = implode(',', $nodes);

		return db_QueryFetch(
			"SELECT node, scope, `key`, `value`
			FROM ".SH_TABLE_PREFIX.SH_TABLE_NODE_META." 
			WHERE node IN ($node_string) AND id IN (
				SELECT MAX(id) FROM ".SH_TABLE_PREFIX.SH_TABLE_NODE_META." GROUP BY node, `key`
			)
			"
		);
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
	if ( is_integer($nodes) ) {
		$nodes = [$nodes];
	}
	
	if ( is_array($nodes) ) {
		// Confirm that all Nodes are not zero
		foreach( $nodes as $node ) {
			if ( intval($node) == 0 )
				return null;
		}

		// Build IN string
		$node_string = implode(',', $nodes);

		return db_QueryFetch(
			"SELECT a, b, type
			FROM ".SH_TABLE_PREFIX.SH_TABLE_NODE_LINK." 
			WHERE a IN ($node_string) OR b IN ($node_string)
			"
		);
	}
	
	return null;
}

