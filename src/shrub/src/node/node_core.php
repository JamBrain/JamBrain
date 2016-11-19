<?php

/// For fetching subscriptions
function node_GetPublishedIdModifiedByParent( $parent, $limit = 20, $offset = 0 ) {
	if ( is_integer($parent) ) {
		return db_QueryFetchPair(
			"SELECT id, modified 
			FROM ".SH_TABLE_PREFIX.SH_TABLE_NODE." 
			WHERE published > CONVERT(0,DATETIME) AND parent=?
			ORDER BY published DESC,
			LIMIT ? OFFSET ?
			".$query_suffix,
			$parent, 
			$limit, $offset
		);
	}
	else if ( is_array($parent) ) {
		// Confirm that all IDs are not zero
		foreach( $parent as $id ) {
			if ( intval($id) == 0 )
				return null;
		}
		
		$ids = implode(',', $parent);
		
		return db_QueryFetchPair(
			"SELECT id, modified 
			FROM ".SH_TABLE_PREFIX.SH_TABLE_NODE." 
			WHERE published > CONVERT(0,DATETIME) AND parent IN ($ids)
			ORDER BY published DESC,
			LIMIT ? OFFSET ?
			".$query_suffix,
			$limit, $offset
		);
	}
	
	return null;
}

function nodeVersion_Add( $node, $author, $type, $subtype, $subsubtype, $slug, $name, $body, $tag = "" ) {
	$ret = db_QueryCreate(
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
	$node = db_QueryCreate(
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

//function node_AddIf( 


function node_GetIdByType( $type ) {
	// hack
	return [100,101];
}

// TODO: Finish me
function node_GetIdByParentAndSlug( $parent, $slug ) {
	return 0;
}

function node_GetById( $id ) {
	
}


