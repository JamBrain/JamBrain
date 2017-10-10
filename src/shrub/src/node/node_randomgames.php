<?php

const SH_NODERG_CACHE_TTL = 3*60;
const SH_NODERG_CACHE_KEY = "!SH!NODE!RG";

function nodeRandomGames_CurrentGamesList( ) {
	$data = cache_Fetch($key);
	if ( $data == null ) {
		// What is the current event?
		// Get root node
		$rootnode = nodeCache_GetById(1);
		$featured_event = 0;
		$data = [];
		
		if ( isset($rootnode['meta']) && isset($rootnode['meta']['featured']) ) {
			$featured_event = intval($rootnode['meta']['featured']);
		}
		else
		{
			return null;
		}

		// Are we in a voting period?
		$event = nodeCache_GetById($featured_event);
		
		if ( !(isset($event['meta']) && isset($event['meta']['can-grade']) && $event['meta']['can-grade']) ) {
			// Nope.
			return null;		
		}
		
		// Query the current game list and generate a data structure to cache.
		// Use some optimized queries because this is likely to be a lot of data.



		
		cache_Store(SH_NODERG_CACHE_KEY, $data, SH_NODERG_CACHE_TTL);
	}
	return $data;
}

function nodeRandomGames_InvalidateCache( ) {
	cache_Delete(SH_NODERG_CACHE_KEY);
}

function nodeRandomGames_GetGames( $count, $filter = null ) {
	$gamelist = nodeRandomGames_CurrentGamesList();
	if ( !$gamelist ) {
		// If gamelist is null, then we are not currently in a voting period. Just return an empty list.
		return [];
	}
	
	
}

