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
			"SELECT node, COUNT(node) AS count, ".DB_FIELD_DATE('MAX(created)','timestamp')."
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


function note_FetchTree( $ids ) {
/*	$multi = is_array($ids);
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
			"SELECT node, COUNT(node) AS count, ".DB_FIELD_DATE('MAX(created)','timestamp')."
			FROM ".SH_TABLE_PREFIX.SH_TABLE_NOTE." 
			WHERE node IN ($ids_string)
			GROUP BY node".($multi?';':' LIMIT 1;')
		);
		
		

		if ( $multi )
			return $ret;
		else
			return $ret ? $ret[0] : null;
	}
	
	return null;*/
}
