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
		"SELECT slug
		FROM ".SH_TABLE_PREFIX.SH_TABLE_NODE." 
		WHERE parent=? AND slug LIKE ?;",
		$parent, $slug
	);	
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
	$superparent = $parent ? node_GetParentById($parent) : 0;	
	return _node_Edit($node, $parent, $superparent, $author, $type, $subtype, $subsubtype, $slug, $name, $body, $tag);
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

