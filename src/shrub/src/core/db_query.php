<?php
// DB Query building functions

function & dbQuery_ArrayifyIds( &$array ) {
	if ( is_array($array) ) {
	}
	else if ( is_integer($array) )
		$array = [$array];
	else
		$array = null;
	return $array;
}
function & dbQuery_Arrayify( &$array ) {
	if ( is_array($array) ) {
	}
	else if ( is_string($array) )
		$array = [$array];
	else
		$array = null;
	return $array;
}


// Confirm that IDs are non-zero integers
function dbQuery_AreIdsValid( &$array ) {
	if ( is_array($array) && count($array) ) {
		foreach( $array as &$id ) {
			if ( !is_integer($id) || $id <= 0 ) {
				return null;
			}
		}
	}
	else if ( !is_integer($array) || $array <= 0 ) {
		return null;
	}
	return true;
}

// Build a query fragment for id checks
function dbQuery_MakeId( $ids, $id_name, &$QUERY, &$ARGS ) {
	if ( is_array($ids) && count($ids) ) {
		$QUERY[] = "$id_name IN (".implode(',', $ids).")";
	}
	else if ( is_integer($ids) ) {
		$QUERY[] = "$id_name=?";
		$ARGS[] = $ids;
	}
	else {
		return null;
	}
	return true;
}
function dbQuery_MakeNotId( $ids, $id_name, &$QUERY, &$ARGS ) {
	if ( is_array($ids) && count($ids) ) {
		$QUERY[] = "$id_name NOT IN (".implode(',', $ids).")";
	}
	else if ( is_integer($ids) ) {
		$QUERY = "$id_name!=?";
		$ARGS = $ids;
	}
	else {
		return null;
	}
	return true;
}

// Build query fragment for the string checks
function dbQuery_Make( $items, $item_name, &$QUERY, &$ARGS ) {
	// IMPORTANT: You must sanitize $items and $item_name
	
	if ( is_array($items) && count($items) ) {
		$QUERY[] = $item_name.' IN ("'.implode('","', $items).'")';
	}
	else if ( is_string($items) ) {
		$QUERY[] = $item_name.'=?';
		$ARGS[] = $items;
	}
	else if ( is_null($items) ) {
		// do nothing
	}
	else {
		return null;	// Non strings, non arrays
	}
	return true;
}
function dbQuery_MakeNot( $items, $item_name, &$QUERY, &$ARGS ) {
	// IMPORTANT: You must sanitize $items and $item_name
	
	if ( is_array($items) && count($items) ) {
		$QUERY[] = $item_name.' NOT IN ("'.implode('","', $items).'")';
	}
	else if ( is_string($items) ) {
		$QUERY[] = $item_name.'!=?';
		$ARGS[] = $items;
	}
	else if ( is_null($items) ) {
		// do nothing
	}
	else {
		return null;	// Non strings, non arrays
	}
	return true;
}
