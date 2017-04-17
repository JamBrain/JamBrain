<?php

// Scope of notes is inherited by the parent node
const NODE_TYPES_WITH_PUBLIC_NOTES = [
	'post',
	'game'
];

const NODE_TYPES_WITH_PROTECTED_NOTES = [
	'user'
];

const NODE_TYPES_WITH_PRIVATE_NOTES = [
];

// Returns whether a node is allowed 
function note_IsNotePublicByNode( $node ) {
	return in_array($node['type'], NODE_TYPES_WITH_PUBLIC_NOTES);
}

// Can be used to detect if the comments on a node have changed
function note_CountByNode( $ids ) {
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
			"SELECT node, COUNT(node) AS count, ".DB_FIELD_DATE('MAX(modified)','timestamp')."
			FROM ".SH_TABLE_PREFIX.SH_TABLE_NOTE." 
			WHERE node IN ($ids_string)
			GROUP BY node".($multi?';':' LIMIT 1;')
		);

		if ( $multi )
			return $ret;
		else
			return $ret ? $ret[0] : null;
	}
	
	return null;
}


function _note_FetchTree( $ids, $threshold = null ) {
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
		
		// Build threshold string
		$threshold_string = '';
		if ( $threshold !== null ) {
			$threshold_string = " AND hops <= $threshold";
		}

		$ret = db_QueryFetch(
			"SELECT node, note, ancestor, hops
			FROM ".SH_TABLE_PREFIX.SH_TABLE_NOTE_TREE." 
			WHERE node IN ($ids_string)
			$threshold_string
			;"
		);
		return $ret;
	}
	
	return null;
}

function note_FetchTree( $ids, $threshold = null ) {
	// Fetch tree
	$trees = _note_FetchTree($ids);
	
	// Parse Tree
	$multi = is_array($ids);
	if ( !$multi )
		$ids = [$ids];

	
	
	// Return Parsed Tree
	return $trees;
}

//
//{
//	'1': {},
//	'2': {}
//}
//
//[
//	{
//		'node': 11,
//		'note': 1,
//		'children': []
//	}
//	{
//	}
//]

function _note_GetByNode( $ids ) {
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
			"SELECT id, parent, 
				node, supernode, 
				author, 
				".DB_FIELD_DATE('created').",
				".DB_FIELD_DATE('modified').",
				version,
				body
			FROM ".SH_TABLE_PREFIX.SH_TABLE_NOTE." 
			WHERE node IN ($ids_string)
			;"
		);
		
		return $ret;
	}
	
	return null;
}

function note_GetByNode( $ids ) {
	$notes = _note_GetByNode($ids);

	$ret = [];

	if ( is_array($ids) ) {
		foreach( $ids as $id ) {
			$ret[$id] = [];
		}
	
		foreach( $notes as &$note ) {
			$ret[$note['node']][$note['id']] = $note;
		}
	}
	else {
		foreach( $notes as &$note ) {
			$ret[$note['id']] = $note;
		}
	}

	return $ret;
}


function note_GetById( $ids ) {
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
			"SELECT id, parent, 
				node, supernode, 
				author, 
				".DB_FIELD_DATE('created').",
				".DB_FIELD_DATE('modified').",
				version,
				body
			FROM ".SH_TABLE_PREFIX.SH_TABLE_NOTE." 
			WHERE id IN ($ids_string)
			;"
		);

		if ( $multi )
			return $ret;
		else
			return $ret ? $ret[0] : null;
	}
	
	return null;
}


function _note_AddByNode( $node, $supernode, $author, $parent, $body, $version_tag ) {
	// Insert Proxy
	$note_id = db_QueryInsert(
		"INSERT IGNORE INTO ".SH_TABLE_PREFIX.SH_TABLE_NOTE." (
			parent,
			node, supernode,
			author,
			created
		)
		VALUES (
			?,
			?, ?,
			?,
			NOW()
		)",
		$parent,
		$node, $supernode,
		$author
	);

	$edit = note_SafeEdit( $note_id, $author, $body, $version_tag );
	
	return $note_id;
}

function note_AddByNode( $node, $supernode, $author, $parent, $body, $version_tag ) {
	$note_id = _note_AddByNode($node, $supernode, $author, $parent, $body, $version_tag);
	
	// Hack: Adding just the root entry to the tree
	$tree = noteTree_Add($node, $note_id, 0, 1);
	
	return $note_id;
}

function note_SafeEdit( $note_id, $author, $body, $version_tag ) {
	$version_id = noteVersion_Add($note_id, $author, $body, $version_tag);

	return db_QueryUpdate(
		"UPDATE ".SH_TABLE_PREFIX.SH_TABLE_NOTE."
		SET
			modified=NOW(),
			version=?,
			body=?
		WHERE
			id=?;",
		$version_id,
		$body,
	
		$note_id
	);
}
