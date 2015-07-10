<?php
/**	@file
*	@brief Internal AJAX API for fetching Nodes
**/

require_once __DIR__ . "/../../api.php";
require_once __DIR__ . "/../../core/node.php";

$response = json_NewResponse();

user_StartEnd();

// Retrieve Action and Arguments
$arg = core_ParseActionURL();
$action = array_shift($arg);
$arg_count = count($arg);

$offset = 0;
$limit = 50;


// Confirm we have enough arguments
if ( $arg_count === 0 ) {
	if ( $action === 'get' ) {
		// do nothing //
	}
	else { 
		json_EmitError(); 
	}
}
else if ( $arg_count === 1 ) {
	if ( $action === 'get' ) {
		// do nothing //
	}
	else { 
		json_EmitError(); 
	}
}
else {
	json_EmitError();
}


/**
 * @api {GET} /a/node/get/:nodeid /a/node/get
 * @apiName GetNode
 * @apiGroup Node
 * @apiPermission Member
 * @apiVersion 0.1.0
*/
if ( $action === 'get' ) {
	if ( $arg_count === 1 ) {
		$node_id = intval($arg[0]);
		if ( $node_id <= 0 ) {
			json_EmitError();
		}
		
		$node = node_GetNodeById($node_id);
		if ( !empty($node) ) {
			$response[] = $node;
		}
	}
	else if ( $arg_count === 0 ) {
		$nodes = explode(' ', $_GET['ids']);
		foreach ( $nodes as &$node ) {
			$node = intval( $node );
		}
		//var_dump( $nodes );
		
		$response = node_GetNodesByIds( $nodes );
	}
}
// On 'remove' Action, remove from the database
/**
 * @api {GET} /a/star/remove/:nodeid /a/star/remove
 * @apiName RemoveStar
 * @apiGroup Star
 * @apiPermission Member
 * @apiVersion 0.1.0
*/
//else if ( $action === 'remove' ) {
//	$response['success'] = star_Remove($response['item'],$response['id']);
//}
// On 'id' or 'me' Action, get a list of favourites 
/**
 * @api {GET} /a/star/me[/:offset] /a/star/me
 * @apiName MyStars
 * @apiGroup Star
 * @apiPermission Member
 * @apiVersion 0.1.0
*/
/**
 * @api {GET} /a/star/id/:userid[/:offset] /a/star/id
 * @apiName UserStars
 * @apiGroup Star
 * @apiPermission Everyone
 * @apiVersion 0.1.0
*/
//else if ( $action === 'me' || $action === 'id' ) {
//	$response['result'] = star_Fetch( $response['id'], $offset, $limit );
//}
else {
	json_EmitError();
}

// Done. Output the response.
json_Emit($response);
?>
