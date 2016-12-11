<?php

function nodeComplete_GetById( $ids ) {
	$multi = is_array($ids);
	if ( !$multi )
		$ids = [$ids];
	
	$nodes = node_GetById($ids);
	if ( !$nodes )
		return null;
	
	$metas = nodeMeta_ParseByNode($ids);
	$links = nodeLink_ParseByNode($ids);

	$loves = nodeLove_GetByNode($ids);

	// Populate Metadata
	foreach ( $nodes as &$node ) {
		// Store Public Metadata
		if ( isset($metas[$node['id']][SH_NODE_META_PUBLIC]) ) {
			$node['meta'] = $metas[$node['id']][SH_NODE_META_PUBLIC];
		}
		else {
			$node['meta'] = [];
		}

		// TODO: Store Protected and Private Metadata
	}

	// Populate Links (NOTE: Links come in Pairs)
	foreach ( $nodes as &$node ) {
		if ( isset($links[$node['id']][0][SH_NODE_META_PUBLIC]) ) {
			$node['link'] = $links[$node['id']][0][SH_NODE_META_PUBLIC];
		}
		else {
			$node['link'] = [];
		}

		// TODO: Store Protected and Private Metadata
	}
	
	// Populate Love
	foreach ( $nodes as &$node ) {
		$node['love'] = 0;
		
		foreach ( $loves as $love ) {
			if ( $node['id'] === $love['node'] ) {
				$node['love'] = $love['count'];
				$node['love-timestamp'] = $love['timestamp'];
			}
		}
	}
	
	// Populate Comment Count
//	foreach ( $nodes as &$node ) {
//		$node['comments'] = 0;
//		
//	}


	if ($multi)
		return $nodes;
	else
		return $nodes[0];
}


function nodeComplete_GetAuthored( $id ) {
	// Scan for things I am the author of
	$author_links = nodeLink_GetByKeyNode("author", $id);

	// Populate a list of things I authored
	$author_ids = [];
	foreach( $author_links as &$link ) {
		// We only care about public (for now)
		if ( $link['scope'] == SH_NODE_META_PUBLIC ) {
			if ( $link['b'] == $id ) {
				$author_ids[] = $link['a'];
			}
		}
	}
	
	return $author_ids;
}

function nodeComplete_GetWhereIdCanCreate( $id ) {
	$ret = [];
	
	// Scan for public nodes with 'can-create' metadata
	$public_metas = nodeMeta_GetByKey("can-create", null, '='.SH_NODE_META_PUBLIC);
	
	// Add public nodes
	foreach( $public_metas as &$meta ) {
		if ( !isset($ret[$meta['value']]) ) {
			$ret[$meta['value']] = [];
		}
		
		$ret[$meta['value']][] = $meta['node'];
	}


	// Scan for things I am the author of
	$authored_ids = nodeComplete_GetAuthored($id);
	// Scan for shared nodes I authored
	$shared_metas = nodeMeta_GetByKeyNode("can-create", $authored_ids, '='.SH_NODE_META_SHARED);

	// Add shared nodes
	foreach( $shared_metas as &$meta ) {
		if ( in_array($meta['node'], $authored_ids) ) {
			if ( !isset($ret[$meta['value']]) ) {
				$ret[$meta['value']] = [];
			}
			
			$ret[$meta['value']][] = $meta['node'];
		}
	}

	
//	// NOTE: This will get slower as the number of games increase
//
//	// Scan for nodes with 'can-create' metadata
//	$metas = nodeMeta_GetByKey("can-create");
//	
//	foreach( $metas as &$meta ) {
//		// Add public nodes
//		if ( $meta['scope'] == SH_NODE_META_PUBLIC ) {
//			if ( !isset($ret[$meta['value']]) ) {
//				$ret[$meta['value']] = [];
//			}
//			
//			$ret[$meta['value']][] = $meta['node'];
//		}
//		// Add shared nodes (primarily authored nodes)
//		else if ( $meta['scope'] == SH_NODE_META_SHARED ) {
//			if ( in_array($meta['node'], $node_ids) ) {
//				if ( !isset($ret[$meta['value']]) ) {
//					$ret[$meta['value']] = [];
//				}
//				
//				$ret[$meta['value']][] = $meta['node'];
//			}
//		}
//	}

//	// Let me post content to my own node (but we're adding ourselves last, to make it the least desirable)
//	// NOTE: Don't forge tto create sub-arrays here
//	$RESPONSE['where']['post'][] = $user_id;
//	$RESPONSE['where']['item'][] = $user_id;
//	$RESPONSE['where']['article'][] = $user_id;
	
	return $ret;
}


function nodeComplete_GetWhatIdHasAuthoredByParent( $id, $parent ) {
	$node_ids = nodeComplete_GetAuthored($id);
	$nodes = node_GetById($node_ids);			// OPTIMIZE: Use a cached function (we only need parent)
	
	$authored_ids = [];
	foreach ( $nodes as &$node ) {
		if ( $node['parent'] == $parent ) {
			$authored_ids[] = $node['id'];
		}
	}
	
	return $authored_ids;
}
