<?php

// For fetching subscriptions
function nodeFeed_GetByNodeMethodType( $node_ids, $methods, $types = null, $subtypes = null, $subsubtypes = null, $score_minimum = null, $limit = 20, $offset = 0 ) {
	$published = true;
	$magic = null;

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
					// TODO: this
				break;
				case 'unpublished':
					$published = false;
				break;
				case 'cool':
					$magic = 'cool';
				break;
			};
		}

		if ( count($pre_query) )
			$QUERY[] = '('.implode(' OR ', $pre_query).')';
	}
	else {
		return null;
	}

	if ( $magic ) {
		$orderby_query = "ORDER BY score DESC";
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
				".DB_FIELD_DATE('timestamp','modified')."
			FROM ".SH_TABLE_PREFIX.SH_TABLE_NODE_MAGIC."
			$full_query
			$orderby_query
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
