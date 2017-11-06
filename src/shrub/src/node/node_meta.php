<?php

// This isn't what you want. You don't care about Metadata Ids. You want Node Ids.
// No scope check required, as this function is explicit
function nodeMeta_GetById( $ids ) {
	if ( is_integer($ids) ) {
		if ( intval($ids) == 0 )
			return null;

		return db_QueryFetch(
			"SELECT a, b, scope, `key`, `value`
			FROM ".SH_TABLE_PREFIX.SH_TABLE_NODE_META."
			WHERE id=?;",
			$ids
		);

//		return db_QueryFetch(
//			"SELECT node, scope, `key`, `value`
//			FROM ".SH_TABLE_PREFIX.SH_TABLE_NODE_META."
//			WHERE id=?;",
//			$ids
//		);
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
			"SELECT a, b, scope, `key`, `value`
			FROM ".SH_TABLE_PREFIX.SH_TABLE_NODE_META."
			WHERE id IN ($ids_string);"
		);

//		return db_QueryFetch(
//			"SELECT node, scope, `key`, `value`
//			FROM ".SH_TABLE_PREFIX.SH_TABLE_NODE_META."
//			WHERE id IN ($ids_string);"
//		);
	}

	return null;
}


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
		FROM ".SH_TABLE_PREFIX.SH_TABLE_NODE_META."
		WHERE $where_string;",
		...$ARGS
	);

//	return db_QueryFetch(
//		"SELECT node, scope, `key`, `value`
//		FROM ".SH_TABLE_PREFIX.SH_TABLE_NODE_META."
//		WHERE $where_string AND id IN (
//			SELECT MAX(id) FROM ".SH_TABLE_PREFIX.SH_TABLE_NODE_META." GROUP BY node, `key`
//		);",
//		...$ARGS
//	);
}

// Please sanitize before calling
function nodeMeta_GetByKeyNode( $keys, $nodes, $scope_check = ">=0", $scope_check_values = null ) {
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
		$WHERE[] = "a=?";
		$ARGS[] = $nodes;
	}
	else if ( is_array($nodes) ) {
		$WHERE[] = 'a IN ('.implode(',', $nodes).')';
	}

	$where_string = implode(' AND ', $WHERE);

	return db_QueryFetch(
		"SELECT a, b, scope, `key`, `value`
		FROM ".SH_TABLE_PREFIX.SH_TABLE_NODE_META."
		WHERE $where_string;",
		...$ARGS
	);

//	return db_QueryFetch(
//		"SELECT node, scope, `key`, `value`
//		FROM ".SH_TABLE_PREFIX.SH_TABLE_NODE_META."
//		WHERE $where_string AND id IN (
//			SELECT MAX(id) FROM ".SH_TABLE_PREFIX.SH_TABLE_NODE_META." GROUP BY node, `key`
//		);",
//		...$ARGS
//	);
}


/// NOTE: By default, this ignores any node with a scope less than 0 (that is how deleting works)
/// Pass $scope_check as null to get everything, or "=64" to get specific
function nodeMeta_GetByNode( $nodes, $scope_check = ">=0", $all_null_values = false ) {
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

		// Allows you to get all null's for values, for a slight performance boost
		if ( $all_null_values ) {
			$ret = db_QueryFetch(
				"SELECT a, b, scope, `key`, null AS `value`
				FROM ".SH_TABLE_PREFIX.SH_TABLE_NODE_META."
				WHERE $scope_check_string (a IN ($node_string) OR b IN ($node_string));"
			);
		}
		else {
			$ret = db_QueryFetch(
				"SELECT a, b, scope, `key`, `value`
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

		if ( $multi )
			return $ret;
		else
			return $ret ? $ret[0] : null;
	}

	return null;
}


function nodeMeta_ParseByNode( $node_ids, $get_values = true ) {
	$multi = is_array($node_ids);
	if ( !$multi )
		$node_ids = [$node_ids];

	$metas = nodeMeta_GetByNode($node_ids, ">=0", !$get_values);

	$ret = [];

	// Populate Metadata (NOTE: This is a full-scan per node requested. Could be quicker)
	foreach ( $node_ids as $node_id ) {
//		$raw_meta = [];
		$raw_a = [];
		$raw_b = [];

		foreach ( $metas as $meta ) {
			// If 'b' is zero, it's regular solo metedata
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

	if ($multi)
		return $ret;
	else
		return $ret[$node_ids[0]];
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


function _nodeMetaVersion_Add( $a, $b, $scope, $key, $value ) {
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

function _nodeMeta_Add( $a, $b, $version, $scope, $key, $value, $timestamp = null ) {
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
			".($timestamp ? '?' : 'NOW()')."
		);",
		$a,
		$b,
		$version,
		$scope,
		$key,
		$value,
		$timestamp
	);
}

function nodeMeta_Add( $a, $b, $scope, $key, $value ) {
	$version = _nodeMetaVersion_Add($a, $b, $scope, $key, $value);
	return _nodeMeta_Add($a, $b, $version, $scope, $key, $value);
}
// NOTE: Doesn't actually remove, but adds an "ignore-me" entry
function nodeMeta_Remove( $a, $b, $scope, $key, $value ) {
	return nodeMeta_Add($a, $b, $scope^-1, $key, $value);
}

// Orphaned Metedata is metadata without versions (history)
function nodeMeta_AddOrphan( $a, $b, $scope, $key, $value ) {
	return _nodeMeta_Add($a, $b, 0, $scope, $key, $value);
}
function nodeMeta_RemoveOrphan( $a, $b, $scope, $key, $value ) {
	return nodeMeta_AddOrphan($a, $b, $scope^-1, $key, $value);
}
