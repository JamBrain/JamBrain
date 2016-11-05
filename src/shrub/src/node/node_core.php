<?php

/// Useful for fetching subscriptions
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

// TODO Finish me. I'm missing args
function node_Add( $slug, $name ) {
	return 5;
}


function node_GetIdByType( $type ) {
	// hack
	return [100,101];
}

// TODO: Finish me
function node_GetIdByParentAndSlug( $parent, $slug ) {
	return 0;
}

