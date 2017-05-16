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
		$QUERY[] = "`$id_name` IN (".implode(',', $ids).")";
	}
	else if ( is_integer($ids) ) {
		$QUERY[] = "`$id_name`=?";
		$ARGS[] = $ids;
	}
	else {
		return null;
	}
	return true;
}
function dbQuery_MakeNotId( $ids, $id_name, &$QUERY, &$ARGS ) {
	if ( is_array($ids) && count($ids) ) {
		$QUERY[] = "`$id_name` NOT IN (".implode(',', $ids).")";
	}
	else if ( is_integer($ids) ) {
		$QUERY = "`$id_name`!=?";
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
		$QUERY[] = '`'.$item_name.'` IN ("'.implode('","', $items).'")';
	}
	else if ( is_string($items) ) {
		$QUERY[] = '`'.$item_name.'`=?';
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
		$QUERY[] = '`'.$item_name.'` NOT IN ("'.implode('","', $items).'")';
	}
	else if ( is_string($items) ) {
		$QUERY[] = '`'.$item_name.'`!=?';
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

function dbQuery_MakeQuery( &$QUERY ) {
	return count($QUERY) ? 'WHERE '.implode(' AND ', $QUERY) : '';
}

function dbQuery_MakeLimit( $offset, $limit, &$ARGS ) {
	$QUERY = [];
	if ( is_integer($limit) && $limit > 0 ) {
		$QUERY[] = 'LIMIT ?';
		$ARGS[] = $limit;
	}
	if ( is_integer($offset) && $offset >= 0 ) {
		$QUERY[] = 'OFFSET ?';
		$ARGS[] = $offset;
	}

	return implode(' ', $QUERY);
}


function dbQuery_MakeOp( $name, $op, $array, &$QUERY, &$ARGS ) {
	if ( is_numeric($array) || is_string($array) ) {
		$QUERY[] = '`'.$name.'`'.$op.'?';
		$ARGS[] = $array;

		return true;
	}
	else if ( is_array($array) ) {
		if ( count($array) ) {
			switch ( $op ) {
				case '=':
					$op = 'IN';
					break;

				case '!=':
					$op = 'NOT IN';
					break;

				default: {
					global $RESPONSE;
					json_EmitFatalError_Server("Invalid Op passed to ".__FUNCTION__, $RESPONSE);
					break;
				}
			}
			
			if ( is_numeric($array) ) {
				$QUERY[] = '`'.$name.'` '.$op.' ('.implode(',', $array).')';
				return true;
			}
			else if ( is_string($array) ) {
				$QUERY[] = '`'.$name.'` '.$op.' ("'.implode('","', $array).'")';
				return true;
			}
		}
		else {
			global $RESPONSE;
			json_EmitFatalError_Server("Empty array passed to ".__FUNCTION__, $RESPONSE);
		}
	}
	return null;
}

function dbQuery_MakeEq( $name, $array, &$QUERY, &$ARGS ) {
	return dbQuery_MakeOp($name, '=', $array, $QUERY, $ARGS);
}
function dbQuery_MakeNotEq( $name, $array, &$QUERY, &$ARGS ) {
	return dbQuery_MakeOp($name, '!=', $array, $QUERY, $ARGS);
}
