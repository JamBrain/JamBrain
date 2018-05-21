<?php
require_once __DIR__."/../core/cache.php";

$CACHE_HIT = 0;
$CACHE_MISS = 0;
$CACHE_SKIP = 0;

function nodeCache_GetStats() {
	global $CACHE_HIT, $CACHE_MISS, $CACHE_SKIP;

	return [
		'hit' => $CACHE_HIT,
		'miss' => $CACHE_MISS,
		'skip' => $CACHE_SKIP,
	];
}

const SH_NODE_CACHE_TTL = 3*60;
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
function nodeCache_GetById( $ids, &$cached_store = null ) {
	global $CACHE_HIT, $CACHE_MISS;

	$multi = is_array($ids);
	if ( !$multi )
		$ids = [$ids];

	$nodes = _nodeCache_GetCached($ids);
	$cached_ids = nodeList_GetIds($nodes);

	$CACHE_HIT += count($cached_ids);

	$uncached_ids = array_values(array_diff($ids, $cached_ids));

	if ( is_array($cached_store) ) {
		$cached_store = array_merge($cached_store, $cached_ids);
	}

	if ( count($uncached_ids) ) {
		$CACHE_MISS += count($uncached_ids);
		if ( $uncached = nodeComplete_GetById($uncached_ids) ) {
			_nodeCache_CacheNodes($uncached);

			$nodes = array_merge($nodes, $uncached);
		}
	}

	if ($multi)
		return $nodes;
	else
		return $nodes[0];
}


/// Overwrites the cache with fresh copies of these nodes
function nodeCache_CacheById( $ids ) {
	global $CACHE_SKIP;

	$multi = is_array($ids);
	if ( !$multi )
		$ids = [$ids];

	$CACHE_SKIP += count($ids);
	$nodes = nodeComplete_GetById($ids);

	_nodeCache_CacheNodes($nodes);

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

// Variation of Edit that purges and recaches the cache copy
function nodeCache_Edit( $node, $parent, $author, $type, $subtype, $subsubtype, $slug, $name, $body, $tag = "" ) {
	$ret = node_Edit($node, $parent, $author, $type, $subtype, $subsubtype, $slug, $name, $body, $tag);
	nodeCache_CacheById($node);
	return $ret;
}



const SH_NODE_PARENTBYID_CACHE_TTL = 5*60;
function nodeCache_GetParentById( $id ) {
	global $CACHE_HIT, $CACHE_MISS;

	$key = "!SH!NODE!PARENTBYID!".$id;
	$parent = cache_Fetch($key);

	if ( $parent !== null ) {
		$CACHE_HIT++;
		return $parent;
	}
	$CACHE_MISS++;

	$parent = node_GetParentById($id);
	cache_Store($key, $parent !== null ? $parent : 0, SH_NODE_PARENTBYID_CACHE_TTL);

	return $parent;
}



const SH_NODE_IDBYPARENTSLUG_CACHE_TTL = 5*60;
function nodeCache_GetIdByParentSlug( $parent, $slug ) {
	global $CACHE_HIT, $CACHE_MISS;

	$key = "!SH!NODE!IDBYPARENTSLUG!".$parent."!".$slug;
	$id = cache_Fetch($key);

	if ( $id !== null ) {
		$CACHE_HIT++;
		return $id;
	}
	$CACHE_MISS++;

	$id = node_GetIdByParentSlug($parent, $slug);
	cache_Store($key, $id !== null ? $id : 0, SH_NODE_IDBYPARENTSLUG_CACHE_TTL);

	return $id;
}


const SH_NODE_PARENTSLUGBYID_CACHE_TTL = 5*60;
function nodeCache_GetParentSlugById( $id ) {
	global $CACHE_HIT, $CACHE_MISS;

	$key = "!SH!NODE!PARENTSLUGBYID!".$id;
	$parentslug = cache_Fetch($key);

	if ( $parentslug !== null ) {
		$CACHE_HIT++;
		return $parentslug;
	}
	$CACHE_MISS++;

	$parentslug = node_GetParentSlugById($id);
	if ( $parentslug !== null )
		cache_Store($key, $parentslug, SH_NODE_PARENTSLUGBYID_CACHE_TTL);

	return $parentslug;
}



// Modified version from node_core //
function _nodeCache_GetPathById( $id, $top = 0, $timeout = 10 ) {
	if ( !$id )
		return '';

	$tree = [];
	do {
		$data = nodeCache_GetParentSlugById($id);
		$tree[] = $data;
		$id = $data['parent'];
	} while ( $id > 0 && ($data['parent'] !== $top) && ($timeout--) );

	return $tree;
}
function nodeCache_GetPathById( $id, $top = 0, $timeout = 10 ) {
	$tree = _nodeCache_GetPathById($id, $top, $timeout);

	$path = '';
	$parent = [];
	foreach( $tree as &$leaf ) {
		$path = '/'.($leaf['slug']).$path;
		array_unshift($parent, $leaf['parent']);
	}

	return [ 'path' => $path, 'parent' => $parent ];
}
