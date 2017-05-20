<?php

// Get Subset Functions

function node_GetParentById( $id ) {
	return db_QueryFetchValue(
		"SELECT parent
		FROM ".SH_TABLE_PREFIX.SH_TABLE_NODE."
		WHERE id=?
		LIMIT 1;",
		$id
	);
}

function node_GetParentSlugById( $id ) {
	return db_QueryFetchFirst(
		"SELECT parent, slug
		FROM ".SH_TABLE_PREFIX.SH_TABLE_NODE."
		WHERE id=?
		LIMIT 1;",
		$id
	);
}

function node_GetIdByParentSlug( $parent, $slug ) {
	return db_QueryFetchValue(
		"SELECT id
		FROM ".SH_TABLE_PREFIX.SH_TABLE_NODE." 
		WHERE parent=? AND slug=?
		LIMIT 1;",
		$parent, $slug
	);
}

function node_GetSlugByParentSlugLike( $parent, $slug ) {
	return db_QueryFetchSingle(
		"SELECT 
			slug
		FROM ".SH_TABLE_PREFIX.SH_TABLE_NODE." 
		WHERE 
			parent=? AND slug LIKE ?
		;",
		$parent, $slug
	);	
}

function node_GetIdByParentType( $parent, $type, $subtype = null, $subsubtype = null ) {
	// TODO: add subtype and subsubtype
	return db_QueryFetchSingle(
		"SELECT 
			id
		FROM ".SH_TABLE_PREFIX.SH_TABLE_NODE." 
		WHERE 
			parent=? AND type=?
		;",
		$parent, 
		$type
	);
}

function node_GetIdByParentTypePublished( $parent, $type, $subtype = null, $subsubtype = null ) {
	// TODO: add subtype and subsubtype
	return db_QueryFetchSingle(
		"SELECT
			id
		FROM ".SH_TABLE_PREFIX.SH_TABLE_NODE." 
		WHERE 
			parent=? AND published>0 AND type=?
		;",
		$parent, 
		$type
	);
}



function _node_GetPathById( $id, $top = 0, $timeout = 10 ) {
	if ( !$id )
		return '';

	$tree = [];
	do {
		$data = node_GetParentSlugById($id);
		$tree[] = $data;
		$id = $data['parent'];
	} while ( $id > 0 && ($data['parent'] !== $top) && ($timeout--) );

	return $tree;
}
function node_GetPathById( $id, $top = 0, $timeout = 10 ) {
	$tree = _node_GetPathById($id, $top, $timeout);
	
	$path = '';
	$parent = [];
	foreach( $tree as &$leaf ) {
		$path = '/'.($leaf['slug']).$path;
		array_unshift($parent, $leaf['parent']);
	}
	
	return [ 'path' => $path, 'parent' => $parent ];
}


const SH_MAX_SLUG_LENGTH = 96;
const SH_MAX_SLUG_RETRIES = 100;

function node_GetUniqueSlugByParentSlug( $parent, $slug ) {
	// Trim the slug
	$slug = substr($slug, 0, SH_MAX_SLUG_LENGTH);
	
	// Search for similar slugs
	$slugs = node_GetSlugByParentSlugLike($parent, $slug.'%');
	
	// If not found, success
	if ( !in_array($slug, $slugs) ) {
		return $slug;
	}
	
	// Try up to 100 different variants
	for ( $idx = 1; $idx < SH_MAX_SLUG_RETRIES; $idx++ ) {
		$append = '-'.$idx;
		$append_length = strlen($append);
		
		$try = $slug.$append;
		if ( strlen($try) > SH_MAX_SLUG_LENGTH ) {
			$try = substr($try, 0, SH_MAX_SLUG_LENGTH-$append_length).$append;
		}

		if ( !in_array($try, $slugs) ) {
			return $try;
		}
	}
	return null;
}


function node_GetIdByType( $types ) {
	if ( is_string($types) ) {
		return db_QueryFetchSingle(
			"SELECT id
			FROM ".SH_TABLE_PREFIX.SH_TABLE_NODE." 
			WHERE type=?;",
			$types
		);
	}
	else if ( is_array($types) ) {
		$types_string = '"'.implode('","', $types).'"';

		return db_QueryFetchSingle(
			"SELECT id
			FROM ".SH_TABLE_PREFIX.SH_TABLE_NODE." 
			WHERE type IN ($types_string);"
		);
	}
	return null;
}

// Get Everything Functions

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
			"SELECT id, parent, superparent, author,
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

// Like get, but omits the body (i.e. a string of indeterminate length)
function node_GetNoBodyById( $ids ) {
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
			"SELECT id, parent, superparent, author,
				type, subtype, subsubtype,
				".DB_FIELD_DATE('published').",
				".DB_FIELD_DATE('created').",
				".DB_FIELD_DATE('modified').",
				version,
				slug, name
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

function node_CountByParentAuthorType( $parent = null, $superparent = null, $author = null, $type = null, $subtype = null, $subsubtype = null, $published = true ) {
	$QUERY = [];
	$ARGS = [];
	
	dbQuery_MakeEq('parent', $parent, $QUERY, $ARGS);
	dbQuery_MakeEq('superparent', $superparent, $QUERY, $ARGS);
	dbQuery_MakeEq('author', $author, $QUERY, $ARGS);
	dbQuery_MakeEq('type', $type, $QUERY, $ARGS);
	dbQuery_MakeEq('subtype', $subtype, $QUERY, $ARGS);
	dbQuery_MakeEq('subsubtype', $subsubtype, $QUERY, $ARGS);
	
	if ( is_bool($published) )
		dbQuery_MakeOp('published', $published ? '!=' : '=', 0, $QUERY, $ARGS);

	return db_QueryFetchValue(
		"SELECT 
			COUNT(id)
		FROM
			".SH_TABLE_PREFIX.SH_TABLE_NODE."
		".dbQuery_MakeQuery($QUERY)."
		LIMIT 1
		;",
		...$ARGS
	) |0;	// Clever: If nothing is returned, result is zero
}

function node_CountByAuthorType( $ids, $authors, $types = null, $subtypes = null, $subsubtypes = null ) {
	$multi = is_array($ids);
	if ( !$multi )
		$ids = [$ids];
	
	if ( is_array($ids) ) {
		// Confirm that all IDs are not zero
		foreach( $ids as $id ) {
			if ( intval($id) == 0 )
				return null;
		}
		
		$QUERY = [];
		$ARGS = [];
		
		// Build query fragment for the types check
		if ( is_array($types) ) {
			$QUERY[] = 'type IN ("'.implode('","', $types).'")';
		}
		else if ( is_string($types) ) {
			$QUERY[] = "type=?";
			$ARGS[] = $types;
		}
		else if ( is_null($types) ) {
		}
		else {
			return null;	// Non strings, non arrays
		}
	
		// Build query fragment for the subtypes check
		if ( is_array($subtypes) ) {
			$QUERY[] = 'subtype IN ("'.implode('","', $subtypes).'")';
		}
		else if ( is_string($subtypes) ) {
			$QUERY[] = "subtype=?";
			$ARGS[] = $subtypes;
		}
		else if ( is_null($subtypes) ) {
		}
		else {
			return null;	// Non strings, non arrays
		}
	
		// Build query fragment for the subsubtypes check
		if ( is_array($subsubtypes) ) {
			$QUERY[] = 'subsubtype IN ("'.implode('","', $subsubtypes).'")';
		}
		else if ( is_string($subsubtypes) ) {
			$QUERY[] = "subsubtype=?";
			$ARGS[] = $subsubtypes;
		}
		else if ( is_null($subsubtypes) ) {
		}
		else {
			return null;	// Non strings, non arrays
		}

		// Build IN string
		$ids_string = implode(',', $ids);


		$full_query = '('.implode(' AND ', $QUERY).')';
		
//		$ARGS[] = $limit;
//		$ARGS[] = $offset;

		if ( $authors ) {
			// if true, I don't actually know how I should handle this.
			// Yes we search the meta table for matching author
			// Unfortunately you will find everything that user is an author of
			// For now that's games (which is exactly what we want), but future co-authoring fetures wont be right
			// Sub query? Find all valid nodes, then check if they match the types (in theory an user will have authored less co-authored items)
//			$ret = db_QueryFetch(
//				"SELECT id, COUNT(id) AS count
//				FROM ".SH_TABLE_PREFIX.SH_TABLE_NODE_META." 
//				WHERE author IN ($ids_string)
//				AND $full_query
//				GROUP BY id".($multi?';':' LIMIT 1;'),
//				...$ARGS
//			);
			$QUERY[] = '`key`=?';
			$ARGS[] = 'author';

			$pre_query[] = 'b'.$node_query;
			if ( isset($node_args) ) $ARGS[] = $node_args;
			
			$post_query[] = "id IN (SELECT MAX(id) FROM ".SH_TABLE_PREFIX.SH_TABLE_NODE_LINK." GROUP BY a, b, `key`)";
			$post_query[] = "scope=?";
			$ARGS[] = 0;
			
			$full_query = '';
			if ( count($QUERY) )
				$full_query = 'WHERE ('.implode(' AND ', $QUERY).')';
	
			$ret = db_QueryFetch(
				"SELECT
					a AS id, COUNT(id) AS count
					".DB_FIELD_DATE('timestamp', 'modified')."
				FROM ".SH_TABLE_PREFIX.SH_TABLE_NODE_LINK."
				$full_query
				;",
				...$ARGS
			);
		}
		else {
			$ret = db_QueryFetch(
				"SELECT author AS id, COUNT(id) AS count
				FROM ".SH_TABLE_PREFIX.SH_TABLE_NODE." 
				WHERE author IN ($ids_string)
				AND $full_query
				GROUP BY author".($multi?';':' LIMIT 1;'),
				...$ARGS
			);
		}

		if ( $multi )
			return $ret;
		else
			return $ret ? $ret[0] : null;
	}
	
	return null;
}



function _node_Add( $parent, $superparent, $author, $type, $subtype, $subsubtype, $slug, $name, $body ) {
	// TODO: wrap this in a block

	// With a slug set
	if ( !empty($slug) ) {
		$node = db_QueryInsert(
			"INSERT IGNORE INTO ".SH_TABLE_PREFIX.SH_TABLE_NODE." (
				created,
				slug
			)
			VALUES (
				NOW(),
				?
			)",
			$slug
		);
	}
	// Without a slug set, generate one
	else {
		// Insert with a dummy slug
		$node = db_QueryInsert(
			"INSERT IGNORE INTO ".SH_TABLE_PREFIX.SH_TABLE_NODE." (
				created,
				slug
			)
			VALUES (
				NOW(),
				'$$'+LAST_INSERT_ID()
			)"
		);

		if ( empty($node) ) {
			return $node;
		}

		// Generate a unique slug (based on the node). It gets set by the edit below
		$slug = "$".$node;
	}

	// NOTE: If the edit below fails, the node will have a $$ prefixed slug, and a parent of 0 (orphaned)

	$edit = _node_Edit($node, $parent, $superparent, $author, $type, $subtype, $subsubtype, $slug, $name, $body, "!ZERO");
	
	return $node;
}
function node_Add( $parent, $author, $type, $subtype, $subsubtype, $slug, $name, $body ) {
	$superparent = $parent ? node_GetParentById($parent) : 0;
	return _node_Add($parent, $superparent, $author, $type, $subtype, $subsubtype, $slug, $name, $body);
}


function _node_Edit( $node, $parent, $superparent, $author, $type, $subtype, $subsubtype, $slug, $name, $body, $tag = "" ) {
	$version = nodeVersion_Add($node, $author, $type, $subtype, $subsubtype, $slug, $name, $body, $tag);

	$success = db_QueryUpdate(
		"UPDATE ".SH_TABLE_PREFIX.SH_TABLE_NODE."
		SET
			parent=?, superparent=?, author=?,
			type=?, subtype=?, subsubtype=?,
			modified=NOW(),
			version=?,
			slug=?, name=?, body=?
		WHERE
			id=?;",
		$parent, $superparent, $author,
		$type, $subtype, $subsubtype,
		/**/
		$version,
		$slug, $name, $body,
		
		$node
	);
	
	return $success;
}
function node_Edit( $node, $parent, $author, $type, $subtype, $subsubtype, $slug, $name, $body, $tag = "" ) {
	// Lookup superpaprent (skip this step by calling _node_Edit directly)
	$superparent = $parent ? node_GetParentById($parent) : 0;	
	return _node_Edit($node, $parent, $superparent, $author, $type, $subtype, $subsubtype, $slug, $name, $body, $tag);
}

// Safe version of the edit function. Only allows you to change things users are allowed to change (i.e. slug, name, body).
function node_SafeEdit( $node, $slug, $name, $body, $tag = "" ) {
	// TODO: wrap in a db lock
	$old = node_GetById($node);		// uncached
	
	return _node_Edit($node, $old['parent'], $old['superparent'], $old['author'], $old['type'], $old['subtype'], $old['subsubtype'], $slug, $name, $body, $tag);
}


// TODO: optional 'set slug'
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



function node_IdToIndex( $nodes ) {
	if ( !is_array($nodes) )
		return null;
	
	$ret = [];
	
	foreach ( $nodes as &$node ) {
		$ret[$node['id']] = $node;
	}
	
	return $ret;
}


function node_SetAuthor( $id, $author ) {
	return db_QueryUpdate(
		"UPDATE ".SH_TABLE_PREFIX.SH_TABLE_NODE."
		SET
			author=?
		WHERE
			id=?;",
		$author, $id
	);
}
function node_SetType( $id, $type, $subtype = null, $subsubtype = null ) {
	$QUERY = [];
	$ARGS = [];
	
	$QUERY[] = 'type=?';
	$ARGS[] = $type;

	if ( is_string($subtype) ) {
		$QUERY[] = 'subtype=?';
		$ARGS[] = $subtype;
	}
	if ( is_string($subsubtype) ) {
		$QUERY[] = 'subsubtype=?';
		$ARGS[] = $subsubtype;
	}
	
	$ARGS[] = $id;
	
	$merged_query = implode(',', $QUERY);
	
	return db_QueryUpdate(
		"UPDATE ".SH_TABLE_PREFIX.SH_TABLE_NODE."
		SET
			$merged_query
		WHERE
			id=?;",
		...$ARGS
	);
}
