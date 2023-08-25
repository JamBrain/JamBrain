<?php

// Scope of comments is inherited by the parent node
const NODE_TYPES_WITH_PUBLIC_COMMENTS = [
	'post',
	'item'
];

const NODE_TYPES_WITH_PROTECTED_COMMENTS = [
	'user'
];

const NODE_TYPES_WITH_PRIVATE_COMMENTS = [
];

// Returns whether a node is allowed
function comment_IsCommentPublicByNode( $node ) {
	return in_array($node['type'], NODE_TYPES_WITH_PUBLIC_COMMENTS);
}

// Can be used to detect if the comments on a node have changed
function comment_CountByNode( $ids ) {
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
			FROM ".SH_TABLE_PREFIX.SH_TABLE_COMMENT."
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


function _comment_FetchTree( $ids, $threshold = null ) {
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

		// NOTE: I've seen "hops" also called depth

		$ret = db_QueryFetch(
			"SELECT _node, comment, ancestor, hops
			FROM ".SH_TABLE_PREFIX.SH_TABLE_COMMENT_TREE."
			WHERE _node IN ($ids_string)
			$threshold_string
			;"
		);
		return $ret;
	}

	return null;
}

function comment_FetchTree( $ids, $threshold = null ) {
	// Fetch tree
	$trees = _comment_FetchTree($ids);

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
//		'comment': 1,
//		'children': []
//	}
//	{
//	}
//]

function _comment_GetByNode( $ids ) {
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
				node, _supernode,
				author,
				".DB_FIELD_DATE('created').",
				".DB_FIELD_DATE('modified').",
				_trust,
				version, flags,
				body
			FROM ".SH_TABLE_PREFIX.SH_TABLE_COMMENT."
			WHERE node IN ($ids_string)
			;"
		);

		return $ret;
	}

	return null;
}

function comment_GetByNode( $ids ) {
	$comments = _comment_GetByNode($ids);

	$ret = [];

	if ( is_array($ids) ) {
		foreach( $ids as $id ) {
			$ret[$id] = [];
		}

		foreach( $comments as &$comment ) {
			$ret[$comment['node']][$comment['id']] = $comment;
		}
	}
	else if ( is_array($comments) ) {
		foreach( $comments as &$comment ) {
			$ret[$comment['id']] = $comment;
		}
	}

	return $ret;
}

function comment_GetNodeIdBySuperNodeAuthor( $supernode_id, $author_id ) {
	return db_QueryFetchSingle(
		"SELECT id
		FROM ".SH_TABLE_PREFIX.SH_TABLE_COMMENT."
		WHERE _supernode=? AND author=?
		;",
		$supernode_id,
		$author_id
	);
}


function comment_InterestedUsers( $node )
{
	return db_QueryFetchSingle(
		"SELECT DISTINCT author
		FROM ".SH_TABLE_PREFIX.SH_TABLE_COMMENT."
		WHERE node = ?;",
		$node
	);
}


function comment_GetById( $ids ) {
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
				node, _supernode,
				author,
				".DB_FIELD_DATE('created').",
				".DB_FIELD_DATE('modified').",
				_trust,
				version, flags,
				body
			FROM ".SH_TABLE_PREFIX.SH_TABLE_COMMENT."
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


function _comment_AddByNode( $node, $supernode, $author, $parent, $body, $version_detail, $flags ) {
	// Insert Proxy
	$comment_id = db_QueryInsert(
		"INSERT IGNORE INTO ".SH_TABLE_PREFIX.SH_TABLE_COMMENT." (
			parent,
			node, _supernode,
			author, flags,
			created
		)
		VALUES (
			?,
			?, ?,
			?, ?,
			NOW()
		)",
		$parent,
		$node, $supernode,
		$author, $flags
	);

	$edit = comment_SafeEdit( $comment_id, $author, $body, $version_detail, $flags );

	return $comment_id;
}

function comment_AddByNode( $node, $supernode, $author, $parent, $body, $version_detail, $flags = 0 ) {
	$comment_id = _comment_AddByNode($node, $supernode, $author, $parent, $body, $version_detail, $flags);

	// Hack: Adding just the root entry to the tree
	$tree = commentTree_Add($node, $comment_id, 0, 1);

	return $comment_id;
}

function comment_SafeEdit( $comment_id, $author, $body, $version_detail, $flags ) {
	$version_id = commentVersion_Add($comment_id, $author, $body, $version_detail, $flags);

	return db_QueryUpdate(
		"UPDATE ".SH_TABLE_PREFIX.SH_TABLE_COMMENT."
		SET
			modified=NOW(),
			version=?,
			flags=?,
			body=?
		WHERE
			id=?;",
		$version_id,
		$flags,
		$body,

		$comment_id
	);
}


function comment_SetAuthorTrust($author_id, $value) {
	return db_QueryUpdate(
		"UPDATE ".SH_TABLE_PREFIX.SH_TABLE_COMMENT."
		SET
			_trust=?
		WHERE
			author=?;",
		$value,
		$author_id
	);
}

function comment_SetIdTrust($comment_id, $value) {
	return db_QueryUpdate(
		"UPDATE ".SH_TABLE_PREFIX.SH_TABLE_COMMENT."
		SET
			_trust=?
		WHERE
			id=?;",
		$value,
		$comment_id
	);
}