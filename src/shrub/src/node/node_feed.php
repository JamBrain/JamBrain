<?php

// For fetching subscriptions
function nodeFeed_GetByNodeMethodType( $node_ids, $methods, $types = null, $subtypes = null, $subsubtypes = null, $score_minimum = null, $limit = 20, $offset = 0 ) {
	$published = true;
	$magic = null;
	$authors = null;

	// PLEASE PRE-SANITIZE YOUR TYPES!
	$QUERY = [];
	$ARGS = [];

	// Build a query fragment for the nodes
	if ( is_array($node_ids) && count($node_ids) ) {
		foreach( $node_ids as &$id ) {
			// Confirm that IDs are non-zero integers
			if ( !is_integer($id) || $id <= 0 ) return null;
		}

		$node_query = " IN (".implode(',', $node_ids).")";
		$node_args = null;
	}
	else if ( is_integer($node_ids) ) {
		$node_query = "=?";
		$node_args = $node_ids;
	}
	else {
		return null;
	}

	// Build a query fragment for the methods
	if ( is_string($methods) ) {
		$methods = [$methods];
	}
	if ( is_array($methods) && count($methods) ) {
		$pre_query = [];
		$post_query = null;
		foreach ( $methods as &$method ) {
			switch ( $method ) {
				case 'parent':
					$pre_query[] = $method.$node_query;
					if ( isset($node_args) ) $ARGS[] = $node_args;
				break;
				case 'superparent':
					$pre_query[] = $method.$node_query;
					if ( isset($node_args) ) $ARGS[] = $node_args;
				break;
				case 'author':
					$pre_query[] = $method.$node_query;
					if ( isset($node_args) ) $ARGS[] = $node_args;
				break;
				case 'all':
				break;
				case 'authors':
					$QUERY[] = '`key`=?';
					$ARGS[] = 'author';

					$pre_query[] = 'b'.$node_query;
					if ( isset($node_args) ) $ARGS[] = $node_args;
					
					$post_query[] = "id IN (SELECT MAX(id) FROM ".SH_TABLE_PREFIX.SH_TABLE_NODE_META." GROUP BY a, b, `key`)";
					$post_query[] = "scope=?";
					$ARGS[] = 0;
					
					$authors = true;
				break;
				case 'unpublished':
					$published = false;
				break;
				case 'cool':
					$magic = 'cool';
				break;
				case 'smart':
					$magic = 'smart';
				break;
				case 'grade':
					$magic = 'grade';
				break;
				case 'feedback':
					$magic = 'feedback';
				break;
			};
		}

		if ( count($pre_query) )
			$QUERY[] = '('.implode(' OR ', $pre_query).')';
		if ( count($post_query) )
			$QUERY[] = implode(' AND ', $post_query);
	}
	else {
		return null;
	}

	if ( $magic ) {
		$orderby_query = "ORDER BY score DESC";
		$QUERY[] = 'name=?';
		$ARGS[] = $magic;
	}
	else if ( $authors ) {
	}
	else {
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

		// Build query fragment for published content
		if ( $published ) {
			$QUERY[] = "published > CONVERT(0, DATETIME)";
			$orderby_query = "ORDER BY published DESC";
		}
		else {
			$orderby_query = "ORDER BY modified DESC";
		}
	}

	// Build query fragment for score
	if ( is_integer($score_minimum) ) {
		$QUERY[] = "score >= ".$score_minimum;
	}
	else if ( is_null($score_minimum) ) {
	}
	else {
		return null;
	}

	$full_query = '';
	if ( count($QUERY) )
		$full_query = 'WHERE ('.implode(' AND ', $QUERY).')';

	$ARGS[] = $limit;
	$ARGS[] = $offset;
	
	if ( $magic ) {
		// NOTE: Timestamp is wrong! It should be the modified date of the original
		return db_QueryFetch(
			"SELECT
				node AS id,
				".DB_FIELD_DATE('timestamp', 'modified')."
			FROM ".SH_TABLE_PREFIX.SH_TABLE_NODE_MAGIC."
			$full_query
			$orderby_query
			LIMIT ?
			OFFSET ?
			;",
			...$ARGS
		);
	}
	else if ( $authors ) {
		// NOTE: Timestamp is wrong! It should be the modified date of the original
		return db_QueryFetch(
			"SELECT
				a AS id,
				".DB_FIELD_DATE('timestamp', 'modified')."
			FROM ".SH_TABLE_PREFIX.SH_TABLE_NODE_META."
			$full_query
			ORDER BY id DESC
			LIMIT ?
			OFFSET ?
			;",
			...$ARGS
		);
	}
	return db_QueryFetch(
		"SELECT
			id,
			".DB_FIELD_DATE('modified')."
		FROM ".SH_TABLE_PREFIX.SH_TABLE_NODE."
		$full_query
		$orderby_query
		LIMIT ?
		OFFSET ?
		;",
		...$ARGS
	);

//	if ( is_integer($parent) ) {
//		$parent = [$parent];
//	}
//
//	if ( is_array($parent) ) {
//		// Confirm that all IDs are not zero
//		foreach( $parent as $id ) {
//			if ( intval($id) == 0 )
//				return null;
//		}
//
//		// Build IN string
//		$ids_string = implode(',', $parent);
//
//		if ( $types ) {
//			if ( !is_array($types) ) {
//				$types = [$types];
//			}
//
//			$types_string = '"'.implode('","', $types).'"';
//
//			return db_QueryFetch(
//				"SELECT id, ".DB_FIELD_DATE('modified')."
//				FROM ".SH_TABLE_PREFIX.SH_TABLE_NODE."
//				WHERE parent IN ($ids_string) AND type IN ($types_string) AND published > CONVERT(0,DATETIME)
//				ORDER BY published DESC
//				LIMIT ? OFFSET ?
//				;",
//				$limit, $offset
//			);
//		}
//		else {
//			return db_QueryFetchPair(
//				"SELECT id, ".DB_FIELD_DATE('modified')."
//				FROM ".SH_TABLE_PREFIX.SH_TABLE_NODE."
//				WHERE parent IN ($ids_string) AND published > CONVERT(0,DATETIME)
//				ORDER BY published DESC
//				LIMIT ? OFFSET ?
//				;",
//				$limit, $offset
//			);
//		}
//	}

	return null;
}


function nodeFeed_GetByMethod( $methods, $node_ids = null, $types = null, $subtypes = null, $subsubtypes = null, $score_op = null, $limit = 20, $offset = 0 ) {
	$MAGIC_QUERY = [];
	$MAGIC_ARGS = [];
	$NODE_QUERY = [];
	$NODE_ARGS = [];
	$LINK_QUERY = [];
	$LINK_ARGS = [];
	
	$JOIN_QUERY = [];
	$JOIN_ARGS = [];

	// Pre-parse the methods
	if ( !dbQuery_Arrayify($methods) ) {
		return null;
	}
	// Bail if no methods
	if ( !count($methods) ) {
		return null;
	}
	
	// Make sure $node_ids are usable
	$valid_ids = dbQuery_AreIdsValid($node_ids);

	$published = true;
	$magic = null;
	$link = null;
	
	$SORT_ORDER = 'DESC';
	
	// Build Method Queries
	foreach ( $methods as &$method ) {
		switch ( $method ) {
			case 'all':
				break;
	
			case 'parent':
			case 'superparent':
			case 'author':
				if ( !$valid_ids )
					return null;
			
//				dbQuery_MakeId($node_ids, 'm.'.$method, $MAGIC_QUERY, $MAGIC_ARGS);
				dbQuery_MakeId($node_ids, 'n.'.$method, $NODE_QUERY, $NODE_ARGS);
				break;
	
			case 'authors':
				if ( !$valid_ids )
					return null;

				// 1st join limits our scope, binds ourself to the node table
				$JOIN_QUERY[] = 
					"INNER JOIN (
						SELECT
							id, a, b
						FROM 
							".SH_TABLE_PREFIX.SH_TABLE_NODE_META."
						WHERE
							scope=0
					) 
					AS authors ON 
						n.id = authors.a
					";
				// 2nd join limits us to only the newest IDs (and only authors as key never changes)
				$JOIN_QUERY[] = 
					"INNER JOIN (
						SELECT
							MAX(id) AS max
						FROM
							".SH_TABLE_PREFIX.SH_TABLE_NODE_META."
						WHERE
							`key`='author'
						GROUP BY 
							a, b, `key`
					)
					AS sub_authors ON 
						authors.id = sub_authors.max
					";

				// Build an IN statement that confirms the authors are those specified
				dbQuery_MakeId($node_ids, 'authors.b', $LINK_QUERY, $LINK_ARGS);

				$link = 'authors';
				break;

			case 'unpublished':
				$published = false;
				break;
			
			case 'reverse':
				$SORT_ORDER = 'ASC';
				break;

			case 'target':
				// All links that reference this

				// NOTE: This WAS a double inner join, but maybe it's worth fixing this.

				break;

			case 'cool':
			case 'smart':
			case 'grade':
			case 'feedback':

			case 'grade-01-result':
			case 'grade-02-result':
			case 'grade-03-result':
			case 'grade-04-result':
			case 'grade-05-result':
			case 'grade-06-result':
			case 'grade-07-result':
			case 'grade-08-result':
			case 'grade-01-average':
			case 'grade-02-average':
			case 'grade-03-average':
			case 'grade-04-average':
			case 'grade-05-average':
			case 'grade-06-average':
			case 'grade-07-average':
			case 'grade-08-average':
				$magic = $method;
				break;
		};
	}
	
	// Build published query
	if ( $published ) {
		$NODE_QUERY[] = "published > CONVERT(0, DATETIME)";
	}
	
	// Build type queries
	if ( $types )
		dbQuery_Make($types, 'n.type', $NODE_QUERY, $NODE_ARGS);
	if ( $subtypes )
		dbQuery_Make($subtypes, 'n.subtype', $NODE_QUERY, $NODE_ARGS);
	if ( $subsubtypes )
		dbQuery_Make($subsubtypes, 'n.subsubtype', $NODE_QUERY, $NODE_ARGS);

	// Build score-op query
	if ( is_string($score_op) ) {
		$MAGIC_QUERY[] = "m.score".$score_op;
	}
	
	if ( $magic ) {
		$MAGIC_QUERY[] = 'm.name=?';
		$MAGIC_ARGS[] = $magic;
	}

	$LIMIT_QUERY = [];
	$LIMIT_ARGS = [];
	if ( $limit ) {
		$LIMIT_QUERY[] = 'LIMIT ?';
		$LIMIT_ARGS[] = $limit;
	}
	if ( $offset ) {
		$LIMIT_QUERY[] = 'OFFSET ?';
		$LIMIT_ARGS[] = $offset;
	}
	
	// Execute Query
	if ( $magic && $link ) {
		
	}
	else if ( $link ) {
		if ( $published )
			$ORDER_BY = "ORDER BY n.published $SORT_ORDER";
		else
			$ORDER_BY = "ORDER BY n.modified $SORT_ORDER";

		$QUERY = array_merge($NODE_QUERY, $LINK_QUERY);
		$ARGS = array_merge($JOIN_ARGS, $NODE_ARGS, $LINK_ARGS, $LIMIT_ARGS);

		$LIMITS = implode(' ', $LIMIT_QUERY);

		$JOIN = count($JOIN_QUERY) ? implode(' ', $JOIN_QUERY) : '';
		$WHERE = count($QUERY) ? 'WHERE '.implode(' AND ', $QUERY) : '';

		return db_QueryFetch(
			"SELECT
				n.id,
				".DB_FIELD_DATE('n.modified', 'modified')."
			FROM
				".SH_TABLE_PREFIX.SH_TABLE_NODE." AS n
				$JOIN
			$WHERE
			$ORDER_BY
			$LIMITS
			;",
			...$ARGS
		);		
	}
	else if ( $magic ) {
		$ORDER_BY = "ORDER BY m.score $SORT_ORDER";

		$QUERY = array_merge($MAGIC_QUERY, $NODE_QUERY);
		$ARGS = array_merge($MAGIC_ARGS, $NODE_ARGS, $LIMIT_ARGS);

		$LIMITS = implode(' ', $LIMIT_QUERY);

		$WHERE = count($QUERY) ? 'WHERE '.implode(' AND ', $QUERY) : '';

		return db_QueryFetch(
			"SELECT
				n.id,
				".DB_FIELD_DATE('n.modified', 'modified').",
				m.score
			FROM
				".SH_TABLE_PREFIX.SH_TABLE_NODE." AS n
				INNER JOIN ".SH_TABLE_PREFIX.SH_TABLE_NODE_MAGIC." AS m ON n.id=m.node
			$WHERE
			$ORDER_BY
			$LIMITS
			;",
			...$ARGS
		);
	}
	else {
		if ( $published )
			$ORDER_BY = "ORDER BY n.published $SORT_ORDER";
		else
			$ORDER_BY = "ORDER BY n.modified $SORT_ORDER";

		$QUERY = $NODE_QUERY;
		$ARGS = array_merge($NODE_ARGS, $LIMIT_ARGS);

		$LIMITS = implode(' ', $LIMIT_QUERY);

		$WHERE = count($QUERY) ? 'WHERE '.implode(' AND ', $QUERY) : '';

		return db_QueryFetch(
			"SELECT
				n.id,
				".DB_FIELD_DATE('n.modified', 'modified')."
			FROM
				".SH_TABLE_PREFIX.SH_TABLE_NODE." AS n
			$WHERE
			$ORDER_BY
			$LIMITS
			;",
			...$ARGS
		);
	}

	return null;
}
