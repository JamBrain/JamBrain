<?php
require_once __DIR__."/../config.php";

include_once __DIR__."/".CONFIG_PATH."config.php";
require_once __DIR__."/".SHRUB_PATH."api2.php";
require_once __DIR__."/".SHRUB_PATH."node/node.php";


const MAX_NODES = 500;


function nodeAPI_Filter( $nodes, &$more_nodes ) {
	$out = [];

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

			if ( $node['type'] == 'symlink' ) {
				$more_nodes[] = intval($node['body']);
			}

			// If we get here, we're allowed to view the node
			$out[] = $node;
		}
	}
	return $out;
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

	$out = [];
	$RESPONSE['nodes_cached'] = [];
	$more_node_ids = [];

	// Fetch the nodes, and filter them (if there is a reason to omit them)
	$nodes = nodeCache_GetById($node_ids, $RESPONSE['nodes_cached']);
	$out = array_merge($out, nodeAPI_Filter($nodes, $more_node_ids));

	// Check if we need any more nodes
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
	if ( isset($_GET['root']) )
		$more_node_ids = array_merge($more_node_ids, [1]);

	$more_node_ids = array_unique($more_node_ids);
	$more_node_ids = array_diff($more_node_ids, $node_ids, [0]);

	// Fetch the additional nodes we need
	if ( count($more_node_ids) ) {
		$even_more_node_ids = [];

		$nodes = nodeCache_GetById($more_node_ids, $RESPONSE['nodes_cached']);
		$out = array_merge($out, nodeAPI_Filter($nodes, $even_more_node_ids));
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

	// TODO: Support HardLinks (?)
	// TODO: Handle circular hardlinks

	$root = intval(json_ArgShift());
	$RESPONSE['root'] = $root;

	$parent_id = $root;
	$RESPONSE['path'] = [];
	$RESPONSE['extra'] = [];

	$searching = true;

	foreach ( json_ArgGet() as $slug ) {
		$slug = coreSlugify_PathName($slug);

		if ( $searching ) {
			// Search by specific ID (i.e. $)
			if ( !empty($slug) && ($slug[0] == '$') ) {
				$node = intval(substr($slug, 1));

				// Validate that node's parent correct
				if ( nodeCache_GetParentById($node) !== $parent_id ) {
					$node = 0;
				}
			}
			// Search by slug
			else {
				$node = nodeCache_GetIdByParentSlug($parent_id, $slug);
			}
		}

		// If a valid node was found in the search
		if ( $node ) {
			$parent_id = $node;
			$RESPONSE['path'][] = $node;
		}
		// Otherwise note the suggested node as an extra (virtual path)
		else {
			if ( empty($slug) )
				json_EmitFatalError_BadRequest(null, $RESPONSE);

			$RESPONSE['extra'][] = $slug; // already slugified

			// Stop searching for new nodes. Everything else should be considered an extra
			$searching = false;
			$node = null;
		}
	}

	// Return the last actual node found
	$RESPONSE['node_id'] = $parent_id;

	// Fetch the requested node too
	if ( isset($_GET['node']) ) {
		$out = [];
		$RESPONSE['nodes_cached'] = [];
		$more_node_ids = [];

		// One Fetch
		$nodes = nodeCache_GetById([$parent_id], $RESPONSE['nodes_cached']);
		$out = array_merge($out, nodeAPI_Filter($nodes, $more_node_ids));

		// Check if we need any more nodes
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
		if ( isset($_GET['root']) )
			$more_node_ids = array_merge($more_node_ids, [1]);

		$more_node_ids = array_unique($more_node_ids);
		$more_node_ids = array_diff($more_node_ids, [$parent_id], [0]);

		// Fetch the additional nodes we need
		if ( count($more_node_ids) ) {
			$even_more_node_ids = [];

			// Two Fetches
			$nodes = nodeCache_GetById($more_node_ids, $RESPONSE['nodes_cached']);
			$out = array_merge($out, nodeAPI_Filter($nodes, $even_more_node_ids));
		}

		// Return the nodes
		$RESPONSE['node'] = $out;
	}
}],
["node2/where", API_GET | API_AUTH | API_CHARGE, function(&$RESPONSE, $HEAD_REQUEST) {
	// At this point we can bail if it's just a HEAD request
	if ( $HEAD_REQUEST )
		json_EmitHeadAndExit();

	// if not logged in, where will be blank
	$RESPONSE['where'] = nodeComplete_GetWhereIdCanCreate(userAuth_GetID());
}],
// Figure out what event is featured, and if you are athenticated, what you made for it.
// NOTE: This is slightly different than the original behavior, but it combines several requests in to a single batch
["node2/what", API_GET | API_CHARGE, function(&$RESPONSE, $HEAD_REQUEST) {
	$root_id = intval(json_ArgShift());
	if ( !$root_id )
		json_EmitFatalError_BadRequest(null, $RESPONSE);

	// At this point we can bail if it's just a HEAD request
	if ( $HEAD_REQUEST )
		json_EmitHeadAndExit();

	// First, lookup the root node
	$root = nodeCache_GetById($root_id);
	$RESPONSE['root'] = $root;

	$focus_id = $root_id;
	$featured_id = 0;
	if ( isset($root['meta']) && isset($root['meta']['featured']) ) {
		$featured_id = intval($root['meta']['featured']);
		$focus_id = $featured_id;

		$featured = $featured_id ? nodeCache_GetById($featured_id) : null;
		$RESPONSE['featured'] = $featured;
	}
	//$featured = $featured_id ? nodeCache_GetById($featured_id) : null;
	//$RESPONSE['featured'] = $featured;

	// Authentication: rather than error out (i.e. API_AUTH) we check user_id manually here
	$user_id = userAuth_GetID();
	$RESPONSE['node'] = ($user_id && $focus_id) ? nodeComplete_GetWhatIdHasAuthoredByParent($user_id, $focus_id) : [];
}],
// If you are athenticated, return your node, and any metadata that is for your eyes only.
["node2/getmy", API_GET | API_AUTH | API_CHARGE, function(&$RESPONSE, $HEAD_REQUEST) {
	// At this point we can bail if it's just a HEAD request
	if ( $HEAD_REQUEST )
		json_EmitHeadAndExit();

	$user_id = userAuth_GetID();
	if ( $user_id ) {
		$RESPONSE['cached'] = [];
		$RESPONSE['node'] = nodeCache_GetById($user_id, $RESPONSE['cached']);
		//$RESPONSE['node']['scope'] = 'private';

		$meta = nodeMeta_ParseByNode($user_id);
		$RESPONSE['meta'] = array_merge([],
			// Public Meta from me (this is already in the node)
			//isset($meta[0][SH_SCOPE_PUBLIC]) ? $meta[0][SH_SCOPE_PUBLIC] : [],
			// Shared Meta from me
			isset($meta[0][SH_SCOPE_SHARED]) ? $meta[0][SH_SCOPE_SHARED] : [],
			// Procted Meta from me
			isset($meta[0][SH_SCOPE_PRIVATE]) ? $meta[0][SH_SCOPE_PRIVATE] : []
		);
		$RESPONSE['refs'] = array_merge([],
			// Public meta to me
			isset($meta[1][SH_SCOPE_PUBLIC]) ? $meta[1][SH_SCOPE_PUBLIC] : [],
			// Shared meta to me
			isset($meta[1][SH_SCOPE_SHARED]) ? $meta[1][SH_SCOPE_SHARED] : []
		);
	}
}],
/// IMPORTANT: Yes, this does not require auth. When auth is unavailable, the love belongs to the IP address.
///    This does make it possible for every user to give 2 loves to a thing, but overall it's way better
///    that a thing can be loved without a login than it is to force a user to create an account to love.
["node2/love/add", API_POST | API_CHARGE, function(&$RESPONSE) {
	$RESPONSE['got'] = true;
}],
]);
