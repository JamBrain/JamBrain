<?php
require_once __DIR__."/../core/cache.php";

const SH_NODE_CACHE_TTL = 1*60;

function _nodeCache_GenKey( $id ) {
	return "!SH!NODE!".$id;
}

/// This fetches cached nodes
function _nodeCache_GetCached( $ids ) {
	$multi = is_array($ids);
	if ( !$multi )
		$ids = [$ids];
	
	$nodes = [];
	
	foreach ( $ids as $id ) {
		$key = _nodeCache_GenKey($id);
		$node = cache_Fetch($key);
		if ( $node ) {
			$nodes[] = $node;
		}
	}
		
	if ($multi)
		return $nodes;
	else
		return $nodes[0];
}


/// This takes nodes and puts them in the cache
function _nodeCache_CacheNodes( &$nodes ) {
	foreach ( $nodes as &$node ) {
		cache_Store(_nodeCache_GenKey($node['id']), $node, SH_NODE_CACHE_TTL);
	}
}


/// This is the cache wrapped version of nodeComplete_GetById
function nodeCache_GetById( $ids ) {
	$multi = is_array($ids);
	if ( !$multi )
		$ids = [$ids];
	
	$nodes = _nodeCache_GetCached($ids);
	$cached_ids = _nodeList_GetIds($cached);
	
	$uncached_ids = array_diff($ids, $cached_ids);
	
	if ( count($uncached_ids) ) {
		$uncached = nodeComplete_GetById($uncached_ids);
		
		_nodeCache_CacheNodes($uncached);
	
		$nodes = array_merge($nodes, $uncached);
	}
	
		
	if ($multi)
		return $nodes;
	else
		return $nodes[0];
}


/// This invalidates the cache for the passed ids
function nodeCache_InvalidateById( $ids ) {
	if ( is_integer($ids) )
		$ids = [$ids];
	
	foreach ( $ids as $id ) {
		cache_Delete(_nodeCache_GenKey($id));
	}
}


//function nodeCache_GetMetaFieldById( $node, $field, $on_fail = null ) {
//	/// @todo this. Look up node in cache, index the field, and either return the value or $on_fail
//	return 0;
//}

