<?php

const SH_NODERG_CACHE_TTL = 3*60;
const SH_NODERG_CACHE_KEY = "!SH!NODE!RG";

function nodeRandomGames_CurrentGamesList( ) {
	$data = cache_Fetch(SH_NODERG_CACHE_KEY);
	// Only generate data if it's not cached.
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
		// Get the game ID, game subsubtype, rating count, and game smart rating.
		// (future, also game current maximum score, to be computed in magic and stored to a side db. This is to selectively boost the chances of rating games with high scores)

		$nodes = db_QueryFetch(
			"SELECT id, subsubtype
			FROM ".SH_TABLE_PREFIX.SH_TABLE_NODE." 
			WHERE type='item' AND subtype='game' AND parent=? AND
				subsubtype IN ('compo','jam') AND published>0;",
			$featured_event
		);
		
		$gametype = [];
		foreach( $nodes as $node ) {
			$gametype[$node['id']] = $node['subsubtype'];
		}
		
		$nodeidlist = implode(",",array_keys($gametype));

		$magic = db_QueryFetchIdKeyValue(
			"SELECT
				node, name, score
			FROM
				".SH_TABLE_PREFIX.SH_TABLE_NODE_MAGIC."
			WHERE node in (" . $nodeidlist . ") AND
				name in ('smart','grade');"
		);

		// Produce a list of games that have a smart rating above some threshold, and we'll use the smart rating as a weight for random selection.
		// Future: Further boost the smart rating under some circumstances to improve the rating count for games that are receiving high marks
		$weightedgames = [];
		$weightedids = [];
		$totalweight = 0;
		$compoweight = 0;
		$jamweight = 0;
		foreach( $magic as $node => $magicdata ) {
			if ( isset($magicdata['grade']) && isset($magicdata['smart']) ) {
				$votecount = $magicdata['grade'];
				$smartrating = $magicdata['smart'];
				
				$weight = $smartrating;
				
				if ( $weight > 50 ) {
					$weightedgames[] = ['id' => $node, 'type' => $gametype[$node], 'weight' => $weight];
					$weightedids[] = $node;
					$totalweight += $weight;
					if ( $gametype[$node] == 'compo' ) {
						$compoweight += $weight;
					}
					else {
						$jamweight += $weight;
					}
				}
			}
		}
		
		$unweighted = array_diff(array_keys($gametype), $weightedids);
		$unweightedgames = [];
		foreach( $unweighted as $id ) {
			$unweightedgames[] = ['id' => $id, 'type' => $gametype[$id]];
		}
		
		// Order the weighted games by weight descending (perf)
		usort($weightedgames, function($a,$b) { if ( $a['weight'] == $b['weight'] ) { return 0; } return $a['weight'] > $b['weight'] ? -1 : 1; });
		
		$data['weightedgames'] = $weightedgames;
		$data['unweightedgames'] = $unweightedgames;
		$data['totalweight'] = $totalweight;
		$data['compoweight'] = $compoweight;
		$data['jamweight'] = $jamweight;
		
		cache_Store(SH_NODERG_CACHE_KEY, $data, SH_NODERG_CACHE_TTL);
	}
	return $data;
}

function nodeRandomGames_InvalidateCache( ) {
	cache_Delete(SH_NODERG_CACHE_KEY);
}

function nodeRandomGames_GetGames( $count, $removegames, $filter = null ) {
	$gamedata = nodeRandomGames_CurrentGamesList();
	if ( !$gamedata ) {
		// If gamedata is null, then we are not currently in a voting period. Just return an empty list.
		return [];
	}
	
	if ( $count > 50 ) {
		$count = 50;
	}
	
	$listout = [];
	$filterfunc = null;
	$totalweight = $gamedata['totalweight'];
	if ( $filter != null ) {
		$filterfunc = function($a) { return $a['type'] == $filter; };
	}
	if ( $filter == 'compo' ) {
		$totalweight = $gamedata['compoweight'];
	}
	if ( $filter == 'jam' ) {
		$totalweight = $gamedata['jamweight'];
	}
	
	$weightedlist = $gamedata['weightedgames'];
	if ( $filterfunc != null ) { 
		$weightedlist = array_filter($weightedlist, $filterfunc);
	}
	
	// Remove games in removegames list
	$removemap = [];
	foreach( $removegames as $gameid ) { $removemap[intval($gameid)] = true; }
	
	foreach( $weightedlist as $key => $game ) {
		if ( isset($removemap[$game['id']]) ) {
			$totalweight -= $game['weight'];
			unset($weightedlist[$key]);
		}
	}
	
	$retrycount = 0;
	while ( $count > 0 ) {
		// Satisfy game requests from weighted random pool, while it's possible
		if ( count($weightedlist) == 0 ) {
			break;
		}
		
		// Use 100 divisions per whole number. php doesn't provide a good mechanism to get a random floating point value, which would be better in this case.
		$value = random_int(0,$totalweight*100) / 100.0;
	
		$found = false;
		foreach( $weightedlist as $key => $game ) {
			if ( $value <= $game['weight'] ) {
				$listout[] = $game['id'];
				$totalweight -= $game['weight'];
				unset($weightedlist[$key]);
				$count--;
				$found = true;
				break;
			}
		}
		
		if ( !$found ) {
			$retrycount++;
			if ( $retrycount > 10 ) {
				// Either really unlucky, or something is wrong.
				// Adding this guard to ensure this function doesn't get stuck in an infinite loop, even if something is wrong.
				break; // We'll just fill the rest of the games with unranked ones.
			}
		}
	}

	if ( $count > 0 ) {
		// Still need games? this is not expected.
		// Satisfy game requests from unweighted random pool, when we're out of entries in the weighted list
		
		$unweightedlist = $gamedata['unweightedgames'];
		if ( $filterfunc != null ) { 			
			$unweightedlist = array_filter($unweightedlist, $filterfunc);
		}
		
		foreach( $unweightedlist as $key => $game ) {
			if ( isset($removemap[$game['id']]) ) {
				unset($unweightedlist[$key]);
			}
		}
		
		// Note: use array_values to preserve 0..n indexing.
		$unweightedlist = array_values($unweightedlist);
	
		while ( $count > 0 ) {
			if ( count($unweightedlist) == 0 ) {
				break;
			}
		
			$index = random_int(1,count($unweightedlist))-1;
			
			$listout[] = $unweightedlist[$index]['id'];
			$count--;
			
			$last = count($unweightedlist)-1;
			if ( $last != $index ) { 
				$unweightedlist[$index] = $unweightedlist[$last]; 
			}
			unset($unweightedlist[$last]);
			
		}
	}
	
	return $listout;
}

