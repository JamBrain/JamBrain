<?php

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

		$ret = db_QueryFetchPair(
			"SELECT node, COUNT(node)
			FROM ".SH_TABLE_PREFIX.SH_TABLE_NOTE." 
			WHERE node IN ($ids_string)
			GROUP BY node;"
		);

		if ( $multi )
			return $ret;
		else
			return $ret ? $ret[0] : null;
	}
	
	return null;
}
