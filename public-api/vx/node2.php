<?php
require_once __DIR__."/../config.php";

include_once __DIR__."/".CONFIG_PATH."config.php";
require_once __DIR__."/".SHRUB_PATH."api2.php";
require_once __DIR__."/".SHRUB_PATH."node/node.php";


const MAX_NODES = 250;


function nodeAPI_Filter( $nodes, &$out ) {
	// Are there any nodes to even filter?
	if ( $nodes && count($nodes) ) {
		foreach ( $nodes as &$node ) {
			// If not published, potentially reject the return for a variety of reasons
			if ( $node['published'] == 0 ) {
//				// Bad Id
//				$user_id = userAuth_GetId();
//				if ( $user_id == 0 )
//					continue;

//				// Not the author
//				if ( $user_id != $node['author'] ) {
//					// Not on the author list
//					if ( !isset($node['b']['author']) || !in_array($user_id, $node['b']['author']) ) {
//						// Not an admin
//						if ( !userAuth_IsAdmin() ) {
//							continue;
//						}
//					}
//				}
			}

			// If we get here, we're allowed to view the node
			$out[] = $node;
		}
	}
}


api_Exec([
// Get nodes by their id
/// Usage: node/get/:id[+:id+...]
/// ?author: return the author of the node(s) as well
/// ?authors: return the authors of the node(s) as well
/// ?parent: return the parent of the node(s) as well
/// ?parents: return the parents of the node(s) as well
/// ?superparent: return the superparent of the node(s) as well
["node2/get", API_GET | API_CHARGE, function(&$RESPONSE, $HEAD_REQUEST) {
	if ( !json_ArgCount() )
		json_EmitFatalError_BadRequest(null, $RESPONSE);

	$node_ids = explode('+', json_ArgGet(0));

	// Sanitize inputs
	foreach ( $node_ids as &$id ) {
		$id = intval($id);

		// Any id but zero
		if ( !$id ) {
			json_EmitFatalError_BadRequest("Bad ID: ".$id, $RESPONSE);
		}
	}
	sort($node_ids);

	// Limit number of nodes
	if ( $node_count = count($node_ids) > MAX_NODES ) {
		json_EmitFatalError_BadRequest("Too many nodes requested: ".$node_count. "(MAX: ".MAX_NODES.")", $RESPONSE);
	}

	// At this point we can bail if it's just a HEAD request
	if ( $HEAD_REQUEST )
		json_EmitHeadAndExit();

	// Fetch the nodes
	$RESPONSE['nodes_cached'] = [];
	$nodes = nodeCache_GetById($node_ids, $RESPONSE['nodes_cached']);

	// Filter the nodes (if there is a reason to omit them)
	$out = [];
	nodeAPI_Filter($nodes, $out);

	// Check if we need any more nodes
	$more_node_ids = [];
	if ( isset($_GET['author']) )
		$more_node_ids = array_merge($more_node_ids, nodeList_GetAuthor($nodes));
	if ( isset($_GET['authors']) )
		$more_node_ids = array_merge($more_node_ids, nodeList_GetAuthors($nodes));
	if ( isset($_GET['parent']) )
		$more_node_ids = array_merge($more_node_ids, nodeList_GetParent($nodes));
	if ( isset($_GET['parents']) )
		$more_node_ids = array_merge($more_node_ids, nodeList_GetParents($nodes));
	if ( isset($_GET['superparent']) )
		$more_node_ids = array_merge($more_node_ids, nodeList_GetSuperParent($nodes));

	$more_node_ids = array_unique($more_node_ids);
	$more_node_ids = array_diff($more_node_ids, $node_ids, [0]);

	// Fetch the additional nodes we need
	if ( count($more_node_ids) ) {
		$nodes = nodeCache_GetById($more_node_ids, $RESPONSE['nodes_cached']);

		nodeAPI_Filter($nodes, $out);
	}

	// Return the nodes
	$RESPONSE['node'] = $out;
}],
/// Walk a node backwards to figure out where it is
/// Usage: node/walk/:root_id/path/to/something/
["node2/walk", API_GET | API_CHARGE, function(&$RESPONSE, $HEAD_REQUEST) {
	if ( !json_ArgCount() )
		json_EmitFatalError_BadRequest(null, $RESPONSE);

	// At this point we can bail if it's just a HEAD request
	if ( $HEAD_REQUEST )
		json_EmitHeadAndExit();

	// TODO: Support Symlinks and HardLinks (?)
	// TODO: Handle circular links

	$root = intval(json_ArgShift());
	$RESPONSE['root'] = $root;

	$parent_id = $root;
	$RESPONSE['path'] = [];
	$RESPONSE['extra'] = [];

	foreach ( json_ArgGet() as $slug ) {
		$slug = coreSlugify_PathName($slug);

		if ( !empty($slug) && ($slug[0] == '$') ) {
			$node = intval(substr($slug, 1));

			// Validate that node's parent correct
			if ( nodeCache_GetParentById($node) !== $parent_id ) {
				$node = 0;
			}
		}
		else {
			$node = nodeCache_GetIdByParentSlug($parent_id, $slug);
		}

		if ( $node ) {
			$parent_id = $node;
			$RESPONSE['path'][] = $node;
		}
		else {
			if ( empty($slug) )
				json_EmitFatalError_BadRequest(null, $RESPONSE);

			$RESPONSE['extra'][] = $slug;//coreSlugify_Name($slug); // already slugified
		}
	}

	$RESPONSE['node_id'] = $parent_id;

	// Fetch walked node too
	//if ( isset($_GET['node']) ) {
		//if ( isset($_GET['author']) )
		//if ( isset($_GET['authors']) )
		//if ( isset($_GET['parent']) )
		//if ( isset($_GET['parents']) )
		//if ( isset($_GET['superparent']) )
	//}
}],
["node2/where", API_GET | API_AUTH | API_CHARGE, function(&$RESPONSE, $HEAD_REQUEST) {
	// At this point we can bail if it's just a HEAD request
	if ( $HEAD_REQUEST )
		json_EmitHeadAndExit();

	// if not logged in, where will be blank
	$RESPONSE['where'] = nodeComplete_GetWhereIdCanCreate(userAuth_GetID());
}],
["node2/what", API_GET | API_AUTH | API_CHARGE, function(&$RESPONSE, $HEAD_REQUEST) {
	$parent_id = intval(json_ArgShift());
	if ( !$parent_id )
		json_EmitFatalError_BadRequest(null, $RESPONSE);

	// At this point we can bail if it's just a HEAD request
	if ( $HEAD_REQUEST )
		json_EmitHeadAndExit();

	// if not logged in, where will be blank
	$RESPONSE['what'] = nodeComplete_GetWhatIdHasAuthoredByParent(userAuth_GetID(), $parent_id);
}],
]);
