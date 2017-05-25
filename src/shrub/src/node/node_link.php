<?php

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
			;"
		);
	}
	
	return null;
}


// Please sanitize before calling
function nodeLink_GetByKey( $keys, $values = null, $scope_check = ">=0", $scope_check_values = null ) {
	$WHERE = [];
	$ARGS = [];

	// Scope Check
	if ( !empty($scope_check) ) {
		$WHERE[] = "scope".$scope_check;
		if ( is_integer($scope_check_values) ) {
			$ARGS[] = $scope_check_values;
		}
	}

	// Keys
	if ( is_integer($keys) ) {
		$keys = strval($keys);
	}
	if ( is_string($keys) ) {
		$WHERE[] = '`key`=?';
		$ARGS[] = $keys;
	}
	else if ( is_array($keys) ) {
		$WHERE[] = '`key` IN ("'.implode('","', $keys).'")';
	}
	else {
		// Unknown key type, bail
		return null;
	}
			
	// Values
	if ( is_integer($values) ) {
		$values = strval($values);
	}
	if ( is_string($values) ) {
		$WHERE[] = "`value`=?";
		$ARGS[] = $values;
	}
	else if ( is_array($values) ) {
		$WHERE[] = '`value` IN ("'.implode('","', $values).'")';
	}
	
	$where_string = implode(' AND ', $WHERE);

	return db_QueryFetch(
		"SELECT a, b, scope, `key`, `value`
		FROM ".SH_TABLE_PREFIX.SH_TABLE_NODE_LINK." 
		WHERE $where_string AND id IN (
			SELECT MAX(id) FROM ".SH_TABLE_PREFIX.SH_TABLE_NODE_LINK." GROUP BY a, b, `key`
		);",
		...$ARGS
	);
}


// Please sanitize before calling
function nodeLink_GetByKeyNode( $keys, $nodes, $scope_check = ">=0", $scope_check_values = null ) {
	$WHERE = [];
	$ARGS = [];

	// Scope Check
	if ( !empty($scope_check) ) {
		$WHERE[] = "scope".$scope_check;
		if ( is_integer($scope_check_values) ) {
			$ARGS[] = $scope_check_values;
		}
	}

	// Keys
	if ( is_integer($keys) ) {
		$keys = strval($keys);
	}
	if ( is_string($keys) ) {
		$WHERE[] = '`key`=?';
		$ARGS[] = $keys;
	}
	else if ( is_array($keys) ) {
		$WHERE[] = '`key` IN ("'.implode('","', $keys).'")';
	}
	else {
		// Unknown key type, bail
		return null;
	}
			
	// Nodes
	if ( is_integer($nodes) ) {
		$WHERE[] = "(`a`=? OR `b`=?)";
		$ARGS[] = $nodes;
		$ARGS[] = $nodes;
	}
	else if ( is_array($nodes) ) {
		$WHERE[] = '(`a` IN ('.implode(',', $nodes).') OR `b` IN ('.implode(',', $nodes).'))';
	}
	
	$where_string = implode(' AND ', $WHERE);

	return db_QueryFetch(
		"SELECT a, b, scope, `key`, `value`
		FROM ".SH_TABLE_PREFIX.SH_TABLE_NODE_LINK." 
		WHERE $where_string AND id IN (
			SELECT MAX(id) FROM ".SH_TABLE_PREFIX.SH_TABLE_NODE_LINK." GROUP BY a, b, `key`
		);",
		...$ARGS
	);
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
		
		if ( $multi )
			return $ret;
		else
			return $ret ? $ret[0] : null;
	}
	
	return null;
}

// Variation that always returns null for values, no matter what they are set to 
function nodeLink_GetNoValueByNode( $nodes, $scope_check = ">=0" ) {
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
			"SELECT a, b, scope, `key`, null AS `value`
			FROM ".SH_TABLE_PREFIX.SH_TABLE_NODE_LINK." 
			WHERE $scope_check_string (a IN ($node_string) OR b IN ($node_string)) AND id IN (
				SELECT MAX(id) FROM ".SH_TABLE_PREFIX.SH_TABLE_NODE_LINK." GROUP BY a, b, `key`
			);"
		);
		
		if ( $multi )
			return $ret;
		else
			return $ret ? $ret[0] : null;
	}
	
	return null;
}


function nodeLink_ParseByNode( $node_ids, $get_values = true ) {
	$multi = is_array($node_ids);
	if ( !$multi )
		$node_ids = [$node_ids];
	
	if ( $get_values )
		$links = nodeLink_GetByNode($node_ids);
	else
		$links = nodeLink_GetNoValueByNode($node_ids);

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
function nodeLink_RemoveByNode( $a, $b, $scope, $key, $value = null ) {
	return nodeLink_AddByNode($a, $b, $scope^-1, $key, $value);
}


function nodeLink_CountByABKeyScope( $parent = null, $a = null, $b = null, $key = null, $scope_op = '=0' ) {
	$QUERY = [];
	$OUTER_QUERY = [];
	$INNER_QUERY = [];
	$ARGS = [];

	dbQuery_MakeEq('key', $key, $INNER_QUERY, $ARGS);

	dbQuery_MakeEq('parent', $parent, $QUERY, $ARGS);

	dbQuery_MakeEq('a', $a, $OUTER_QUERY, $ARGS);
	dbQuery_MakeEq('b', $b, $OUTER_QUERY, $ARGS);
	if ( $scope_op )
		$OUTER_QUERY[] = 'scope'.$scope_op;

//	return db_Echo(
	return db_QueryFetchValue(
		"SELECT
			COUNT(DISTINCT o.b), o.a
		FROM
			".SH_TABLE_PREFIX.SH_TABLE_NODE_LINK." AS o
			INNER JOIN (
				SELECT
					MAX(id) AS id
				FROM
					".SH_TABLE_PREFIX.SH_TABLE_NODE_LINK."
				".dbQuery_MakeQuery($INNER_QUERY)."
				GROUP BY 
					a, b, `key`
			) AS i ON o.id=i.id
			INNER JOIN (
				SELECT
					id
				FROM
					".SH_TABLE_PREFIX.SH_TABLE_NODE."
				".dbQuery_MakeQuery($QUERY)."
			) AS n ON o.a=n.id
		".dbQuery_MakeQuery($OUTER_QUERY)."
		LIMIT 1
		;",
		...$ARGS
	) |0;	// Clever: If nothing is returned, result is zero

////	return db_Echo(
//	return db_QueryFetchValue(
//		"SELECT
//			COUNT(DISTINCT o.b)
//		FROM
//			".SH_TABLE_PREFIX.SH_TABLE_NODE." AS n
//			INNER JOIN (
//				SELECT 
//					id, a, b
//				FROM
//					".SH_TABLE_PREFIX.SH_TABLE_NODE_LINK."
//				".dbQuery_MakeQuery($OUTER_QUERY)."
//			) AS o ON n.id=o.a
//			INNER JOIN (
//				SELECT
//					MAX(id) AS id
//				FROM
//					".SH_TABLE_PREFIX.SH_TABLE_NODE_LINK."
//				".dbQuery_MakeQuery($INNER_QUERY)."
//				GROUP BY 
//					a, b, `key`
//			) AS i ON o.id=i.id
//		".dbQuery_MakeQuery($QUERY)."
//		LIMIT 1
//		;",
//		...$ARGS
//	) |0;	// Clever: If nothing is returned, result is zero
}
