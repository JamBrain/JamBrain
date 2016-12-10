<?php

function nodeComplete_GetById( $ids, $scope = 0 ) {
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

