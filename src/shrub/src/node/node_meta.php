<?php

// This isn't what you want. You don't care about Metadata Ids. You want Node Ids.
// No scope check required, as this function is explicit
/*
function nodeMeta_GetById( $ids ) {
	if ( is_integer($ids) ) {
		if ( intval($ids) == 0 )
			return null;

		return db_QueryFetch(
			"SELECT a, b, scope, `key`, `value`, ".DB_FIELD_DATE('timestamp')."
			FROM ".SH_TABLE_PREFIX.SH_TABLE_NODE_META."
			WHERE id=?;",
			$ids
		);
	}
	else if ( is_array($ids) ) {
		// Confirm that all IDs are not zero
		foreach( $ids as $id ) {
			if ( intval($id) == 0 )
				return null;
		}

		// Build IN string
		$ids_string = implode(',', $ids);

		return db_QueryFetch(
			"SELECT a, b, scope, `key`, `value`, ".DB_FIELD_DATE('timestamp')."
			FROM ".SH_TABLE_PREFIX.SH_TABLE_NODE_META."
			WHERE id IN ($ids_string);"
		);
	}

	return null;
}
*/


// Please sanitize before calling
function nodeMeta_GetByKey( $keys, $values = null, $scope_check = ">=0", $scope_check_values = null ) {
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

	// Convert number Values to string
	if ( is_integer($values) ) {
		$values = strval($values);
	}
	// Is Values a String?
	if ( is_string($values) ) {
		$WHERE[] = "`value`=?";
		$ARGS[] = $values;
	}
	// Is Values an Array?
	else if ( is_array($values) ) {
		$WHERE[] = '`value` IN ("'.implode('","', $values).'")';
	}

	$where_string = implode(' AND ', $WHERE);

	return db_QueryFetch(
		"SELECT a, b, scope, `key`, `value`, ".DB_FIELD_DATE('timestamp')."
		FROM ".SH_TABLE_PREFIX.SH_TABLE_NODE_META."
		WHERE $where_string;",
		...$ARGS
	);

//	return db_QueryFetch(
//		"SELECT node, scope, `key`, `value`, ".DB_FIELD_DATE('timestamp')."
//		FROM ".SH_TABLE_PREFIX.SH_TABLE_NODE_META."
//		WHERE $where_string AND id IN (
//			SELECT MAX(id) FROM ".SH_TABLE_PREFIX.SH_TABLE_NODE_META." GROUP BY node, `key`
//		);",
//		...$ARGS
//	);
}

// Please sanitize before calling
function nodeMeta_GetByKeyNode( $keys, $nodes, $scope_check = ">=0", $scope_check_values = null, $check_a = true, $check_b = true ) {
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

//	// Nodes
//	if ( is_integer($nodes) ) {
//		$WHERE[] = "a=?";
//		$ARGS[] = $nodes;
//	}
//	else if ( is_array($nodes) ) {
//		$WHERE[] = 'a IN ('.implode(',', $nodes).')';
//	}

	// Nodes
	if ( $check_a && $check_b ) {
		if ( is_integer($nodes) ) {
			$WHERE[] = "(`a`=? OR `b`=?)";
			$ARGS[] = $nodes;
			$ARGS[] = $nodes;
		}
		else if ( is_array($nodes) ) {
			$WHERE[] = '(`a` IN ('.implode(',', $nodes).') OR `b` IN ('.implode(',', $nodes).'))';
		}
	}
	else if ( $check_a ) {
		if ( is_integer($nodes) ) {
			$WHERE[] = "(`a`=?)";
			$ARGS[] = $nodes;
		}
		else if ( is_array($nodes) ) {
			$WHERE[] = '(`a` IN ('.implode(',', $nodes).'))';
		}
	}
	else if ( $check_b ) {
		if ( is_integer($nodes) ) {
			$WHERE[] = "(`b`=?)";
			$ARGS[] = $nodes;
		}
		else if ( is_array($nodes) ) {
			$WHERE[] = '(`b` IN ('.implode(',', $nodes).'))';
		}
	}
	else {
		// No node(s), bail
		return null;
	}

	$where_string = implode(' AND ', $WHERE);

	return db_QueryFetch(
		"SELECT a, b, scope, `key`, `value`, ".DB_FIELD_DATE('timestamp')."
		FROM ".SH_TABLE_PREFIX.SH_TABLE_NODE_META."
		WHERE $where_string;",
		...$ARGS
	);

//	return db_QueryFetch(
//		"SELECT node, scope, `key`, `value`, ".DB_FIELD_DATE('timestamp')."
//		FROM ".SH_TABLE_PREFIX.SH_TABLE_NODE_META."
//		WHERE $where_string AND id IN (
//			SELECT MAX(id) FROM ".SH_TABLE_PREFIX.SH_TABLE_NODE_META." GROUP BY node, `key`
//		);",
//		...$ARGS
//	);
}


/// NOTE: By default, this ignores any node with a scope less than 0 (that is how deleting works)
/// Pass $scope_check as null to get everything, or "=64" to get specific
function nodeMeta_GetByNode( $node_ids, $scope_check = ">=0", $all_null_values = false ) {
	$multi = is_array($node_ids);
	if ( !$multi )
		$node_ids = [$node_ids];

	$ret = [];

	if ( is_array($node_ids) ) {
		/*
		// Confirm that all Nodes are not zero
		foreach( $node_ids as $node_id ) {
			if ( intval($node_id) == 0 ) {
				return null;
			}
		}
		*/

		// Build IN string
		$node_string = implode(',', $node_ids);

		if ( empty($scope_check) ) {
			$scope_check_string = "";
		}
		else {
			$scope_check_string = "scope".$scope_check." AND";
		}

		// Allows you to get all null's for values, for a slight performance boost
		if ( $all_null_values ) {
			$ret = db_QueryFetch(
				"SELECT a, b, scope, `key`, null AS `value`, ".DB_FIELD_DATE('timestamp')."
				FROM ".SH_TABLE_PREFIX.SH_TABLE_NODE_META."
				WHERE $scope_check_string (a IN ($node_string) OR b IN ($node_string));"
			);
		}
		else {
			$ret = db_QueryFetch(
				"SELECT a, b, scope, `key`, `value`, ".DB_FIELD_DATE('timestamp')."
				FROM ".SH_TABLE_PREFIX.SH_TABLE_NODE_META."
				WHERE $scope_check_string (a IN ($node_string) OR b IN ($node_string));"
			);
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

//		// NOTE: This query may need some work. The subquery may be doing a full table scan
//		$ret = db_QueryFetch(
//			"SELECT node, scope, `key`, `value`
//			FROM ".SH_TABLE_PREFIX.SH_TABLE_NODE_META."
//			WHERE $scope_check_string node IN ($node_string) AND id IN (
//				SELECT MAX(id) FROM ".SH_TABLE_PREFIX.SH_TABLE_NODE_META." GROUP BY node, `key`
//			);"
//		);

		//if ( $multi )
		//	return $ret;
		//else
		//	return $ret ? $ret[0] : null;
	}

	//return null;
	return $ret;
}


function nodeMeta_ParseByNode( $node_ids, $get_values = true, $get_modified = false ) {
	$multi = is_array($node_ids);
	if ( !$multi )
		$node_ids = [$node_ids];

	$metas = nodeMeta_GetByNode($node_ids, ">=0", !$get_values);

	$ret = [];
	$modified = [];

	// Populate Metadata (NOTE: This is a full-scan per node requested. Could be quicker)
	foreach ( $node_ids as $node_id ) {
		$modified[$node_id] = 0;
		$raw_a = [];
		$raw_b = [];

		foreach ( $metas as $meta ) {
			$modified[$node_id] = ($meta['timestamp'] > $modified[$node_id]) ? $meta['timestamp'] : $modified[$node_id];

			// If 'b' is zero, it's regular solo metadata
			if ( $meta['b'] == 0 ) {
				// If this item in the meta list belongs to us
				if ( $node_id === $meta['a'] ) {
					// Create Scope array (if missing)
					if ( isset($raw_a[$meta['scope']]) && !is_array($raw_a[$meta['scope']]) ) {
						$raw_a[$meta['scope']] = [];
					}

					// Store
					$raw_a[$meta['scope']][$meta['key']] = $meta['value'];
				}
			}
			// If 'b' is non-zero, it's paired metadata
			else {
				// Question: Should we support circular links (if so, remove "else" from "else if")?
				if ( $node_id === $meta['a'] ) {
					if ( isset($raw_a[$meta['scope']]) && !is_array($raw_a[$meta['scope']]) ) {
						$raw_a[$meta['scope']] = [];
					}

					if ( $meta['value'] === null ) {
						if ( isset($raw_a[$meta['scope']][$meta['key']]) ) {
							$raw_a[$meta['scope']][$meta['key']][] = $meta['b'];
						}
						else {
							$raw_a[$meta['scope']][$meta['key']] = [$meta['b']];
						}
					}
					else {
						if ( isset($raw_a[$meta['scope']][$meta['key']]) ) {
							$raw_a[$meta['scope']][$meta['key']][$meta['b']] = $meta['value'];
						}
						else {
							$raw_a[$meta['scope']][$meta['key']] = [$meta['b'] => $meta['value']];
						}
					}
				}
				else if ( $node_id === $meta['b'] ) {
					if ( isset($raw_b[$meta['scope']]) && !is_array($raw_b[$meta['scope']]) ) {
						$raw_b[$meta['scope']] = [];
					}

					if ( $meta['value'] === null ) {
						if ( isset($raw_b[$meta['scope']][$meta['key']]) ) {
							$raw_b[$meta['scope']][$meta['key']][] = $meta['a'];
						}
						else {
							$raw_b[$meta['scope']][$meta['key']] = [$meta['a']];
						}
					}
					else {
						if ( isset($raw_b[$meta['scope']][$meta['key']]) ) {
							$raw_b[$meta['scope']][$meta['key']][$meta['a']] = $meta['value'];
						}
						else {
							$raw_b[$meta['scope']][$meta['key']] = [$meta['a'] => $meta['value']];
						}
					}
				}
			}
		}
//		arsort($raw_meta);
//		asort($raw_a);
//		asort($raw_b);

//		$ret[$node_id] = $raw_meta;
		$ret[$node_id] = [$raw_a, $raw_b];
	}

	if ($get_modified) {
		$ret = [$ret, $modified];
	}

	if ( $multi )
		return $ret;
	else
		return $ret[$node_ids[0]];
}


function nodeMeta_CountByABKeyScope( $parent = null, $a = null, $b = null, $key = null, $scope_op = '=0' ) {
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
			".SH_TABLE_PREFIX.SH_TABLE_NODE_META." AS o
			INNER JOIN (
				SELECT
					MAX(id) AS id
				FROM
					".SH_TABLE_PREFIX.SH_TABLE_NODE_META."
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
//					".SH_TABLE_PREFIX.SH_TABLE_NODE_META."
//				".dbQuery_MakeQuery($OUTER_QUERY)."
//			) AS o ON n.id=o.a
//			INNER JOIN (
//				SELECT
//					MAX(id) AS id
//				FROM
//					".SH_TABLE_PREFIX.SH_TABLE_NODE_META."
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




//function nodeMeta_AddByNode( $node, $scope, $key, $value ) {
//	return db_QueryInsert(
//		"INSERT IGNORE INTO ".SH_TABLE_PREFIX.SH_TABLE_NODE_META." (
//			node,
//			scope,
//			`key`,
//			`value`,
//			timestamp
//		)
//		VALUES (
//			?,
//			?,
//			?,
//			?,
//			NOW()
//		);",
//		$node,
//		$scope,
//		$key,
//		$value
//	);
//}
//
//// NOTE: Doesn't actually remove, but adds an "ignore-me" entry
//function nodeMeta_RemoveByNode( $node, $scope, $key, $value ) {
//	return nodeMeta_AddByNode($node, $scope^-1, $key, $value);
//}


function _nodeMetaVersion_Add( $a, $b, $scope, $key, $value = null ) {
	return db_QueryInsert(
		"INSERT IGNORE INTO ".SH_TABLE_PREFIX.SH_TABLE_NODE_META_VERSION." (
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

// NOTE: Do not use directly! Use _nodeMeta_Add instead!
function __nodeMeta_Insert( $a, $b, $version, $scope, $key, $value = null/*, $timestamp = null*/ ) {
//	if ( $timestamp ) {
//		return db_QueryInsert(
//			"INSERT IGNORE INTO ".SH_TABLE_PREFIX.SH_TABLE_NODE_META." (
//				a,
//				b,
//				version,
//				scope,
//				`key`,
//				`value`,
//				timestamp
//			)
//			VALUES (
//				?,
//				?,
//				?,
//				?,
//				?,
//				?,
//				?
//			)
//			ON DUPLICATE KEY UPDATE
//				version=VALUES(version),
//				scope=VALUES(scope),
//				`value`=VALUES(`value`),
//				timestamp=VALUES(timestamp)
//			;",
//			$a,
//			$b,
//			$version,
//			$scope,
//			$key,
//			$value,
//			$timestamp
//		);
//	}

	// We can't rely on "NOW()" here, so we have to do this
//	if ( !$timestamp )
//		$timestamp = (new DateTime())->format('Y-m-d H:i:s');

	return db_QueryInsert(
		"INSERT IGNORE INTO ".SH_TABLE_PREFIX.SH_TABLE_NODE_META." (
			a,
			b,
			version,
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
			?,
			NOW()
		)
		ON DUPLICATE KEY UPDATE
			version=VALUES(version),
			scope=VALUES(scope),
			`value`=VALUES(`value`),
			timestamp=NOW()
		;",
		$a,
		$b,
		$version,
		$scope,
		$key,
		$value
	);
}

// NOTE: Do not use directly! Use _nodeMeta_Add instead!
function __nodeMeta_Update( $a, $b, $version, $scope, $key, $value = null/*, $timestamp = null*/, $b_constraint = true ) {
	// We can't rely on "NOW()" here, so we have to do this
	//if ( !$timestamp )
	//	$timestamp = (new DateTime())->format('Y-m-d H:i:s');

	// If no b_constraint, then we only want to constrain by `a` and `key`
	if ( !$b_constraint ) {
		return db_QueryUpdate(
			"UPDATE ".SH_TABLE_PREFIX.SH_TABLE_NODE_META."
			SET
				b=?,
				version=?,
				scope=?,
				`value`=?,
				timestamp=NOW()
			WHERE
				a=? AND `key`=?
			;",
			// SET
			$b,
			$version,
			$scope,
			$value,
			// WHERE
			$a,
			$key
		);
	}

	// Regular update (a, b, key constraints)
	return db_QueryUpdate(
		"UPDATE ".SH_TABLE_PREFIX.SH_TABLE_NODE_META."
		SET
			version=?,
			scope=?,
			`value`=?,
			timestamp=NOW()
		WHERE
			a=? AND b=? AND `key`=?
		;",
		// SET
		$version,
		$scope,
		$value,
		// WHERE
		$a,
		$b,
		$key
	);
}


function _nodeMeta_Add( $a, $b, $version, $scope, $key, $value = null/*, $timestamp = null*/, $b_constraint = true ) {
	if ( $ret = __nodeMeta_Update($a, $b, $version, $scope, $key, $value/*, $timestamp*/, $b_constraint) ) {
		return $ret;
	}
	// $b_constraint constraining only applies to updating
	return __nodeMeta_Insert($a, $b, $version, $scope, $key, $value/*, $timestamp*/);
}


function nodeMeta_Add( $a, $b, $scope, $key, $value = null, $b_constraint = true ) {
	$version = _nodeMetaVersion_Add($a, $b, $scope, $key, $value);
	return _nodeMeta_Add($a, $b, $version, $scope, $key, $value/*, null*/, $b_constraint);
}
// NOTE: Doesn't actually remove, but adds an "ignore-me" entry
// ALSO: It calls nodeMeta_Add directly, so to correctly create history
function nodeMeta_Remove( $a, $b, $scope, $key, $value = null, $b_constraint = true ) {
	return nodeMeta_Add($a, $b, $scope^-1, $key, $value, $b_constraint);
}


// Orphaned Metedata is metadata without versions (history)
function nodeMeta_AddOrphan( $a, $b, $scope, $key, $value = null ) {
	return _nodeMeta_Add($a, $b, 0, $scope, $key, $value);
}
function nodeMeta_RemoveOrphan( $a, $b, $scope, $key, $value = null ) {
	return nodeMeta_AddOrphan($a, $b, $scope^-1, $key, $value);
}


function nodeMeta_GetAuthors( $node_id ) {
	$authorlinks = nodeMeta_GetByKeyNode('author', $node_id);
	$authors = [];
	foreach($authorlinks as $link) {
		// MK TODO: Verify if this logic is correct (I think you only need one of these)
		if ( $link['a'] == $node_id ) {
			$authors[] = $link['b'];
		}
		if ( $link['b'] == $node_id ) {
			$authors[] = $link['a'];
		}
	}
	return $authors;
}
