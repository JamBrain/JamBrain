<?php

// This isn't what you want. You don't care about Metadata Ids. You want Node Ids.
// No scope check required, as this function is explicit
function nodeMeta_GetById( $ids ) {
	if ( is_integer($ids) ) {
		if ( intval($ids) == 0 )
			return null;

		return db_QueryFetch(
			"SELECT node, scope, `key`, `value`
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
			"SELECT node, scope, `key`, `value`
			FROM ".SH_TABLE_PREFIX.SH_TABLE_NODE_META." 
			WHERE id IN ($ids_string);"
		);
	}

	return null;
}


// Please sanitize before calling
function nodeMeta_GetByKey( $keys, $scope_check = ">=0" ) {
	if ( empty($scope_check) )
		$scope_check_string = "";
	else
		$scope_check_string = "scope".$scope_check." AND";
	
	if ( is_string($keys) ) {
		$keys_string = '`key`=?';

//			"SELECT node, scope, `key`, `value`
//			FROM ".SH_TABLE_PREFIX.SH_TABLE_NODE_META." 
//			WHERE $scope_check_string $keys_string,
		
		return db_QueryFetch(
			"SELECT node, scope, `key`, `value`
			FROM ".SH_TABLE_PREFIX.SH_TABLE_NODE_META." 
			WHERE $scope_check_string $keys_string AND id IN (
				SELECT MAX(id) FROM ".SH_TABLE_PREFIX.SH_TABLE_NODE_META." GROUP BY node, `key`
			);",
			$keys
		);
	}
	else if ( is_array($keys) ) {
		$keys_string = '`key` IN ("'.implode('","', $keys).'")';

//			"SELECT node, scope, `key`, `value`
//			FROM ".SH_TABLE_PREFIX.SH_TABLE_NODE_META." 
//			WHERE $scope_check_string $keys_string;"

		return db_QueryFetch(
			"SELECT node, scope, `key`, `value`
			FROM ".SH_TABLE_PREFIX.SH_TABLE_NODE_META." 
			WHERE $scope_check_string $keys_string AND id IN (
				SELECT MAX(id) FROM ".SH_TABLE_PREFIX.SH_TABLE_NODE_META." GROUP BY node, `key`
			);"
		);
	}
	
	return null;
}

/// NOTE: By default, this ignores any node with a scope less than 0 (that is how deleting works)
/// Pass $scope_check as null to get everything, or "=64" to get specific
function nodeMeta_GetByNode( $nodes, $scope_check = ">=0" ) {
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
		
		// NOTE: This query may need some work. The subquery may be doing a full table scan
		$ret = db_QueryFetch(
			"SELECT node, scope, `key`, `value`
			FROM ".SH_TABLE_PREFIX.SH_TABLE_NODE_META." 
			WHERE $scope_check_string node IN ($node_string) AND id IN (
				SELECT MAX(id) FROM ".SH_TABLE_PREFIX.SH_TABLE_NODE_META." GROUP BY node, `key`
			);"
		);
		
		if ( $multi )
			return $ret;
		else
			return $ret ? $ret[0] : null;
	}
	
	return null;
}


function nodeMeta_ParseByNode( $node_ids ) {
	$multi = is_array($node_ids);
	if ( !$multi )
		$node_ids = [$node_ids];
	
	$metas = nodeMeta_GetByNode($node_ids);

	$ret = [];

	// Populate Metadata (NOTE: This is a full-scan per node requested. Could be quicker)
	foreach ( $node_ids as $node_id ) {
		$raw_meta = [];

		foreach ( $metas as $meta ) {
			// If this item in the meta list belongs to us
			if ( $node_id === $meta['node'] ) {
				// Create Scope array (if missing)
				if ( isset($raw_meta[$meta['scope']]) && !is_array($raw_meta[$meta['scope']]) ) {
					$raw_meta[$meta['scope']] = [];
				}
				
				// Store
				$raw_meta[$meta['scope']][$meta['key']] = $meta['value'];
			}
		}
//		arsort($raw_meta);
		
		$ret[$node_id] = $raw_meta;
	}
	
	if ($multi)
		return $ret;
	else
		return $ret[$node_ids[0]];
}


function nodeMeta_AddByNode( $node, $scope, $key, $value ) {
	return db_QueryInsert(
		"INSERT IGNORE INTO ".SH_TABLE_PREFIX.SH_TABLE_NODE_META." (
			node,
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
			NOW()
		);",
		$node,
		$scope,
		$key,
		$value
	);
}

// NOTE: Doesn't actually remove, but adds an "ignore-me" entry
function nodeMeta_RemoveByNode( $node, $scope, $key, $value ) {
	return nodeMeta_AddByNode($node, $scope^-1, $key, $value);
}
