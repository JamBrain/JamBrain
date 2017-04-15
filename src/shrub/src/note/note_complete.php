<?php

function noteComplete_GetByNode( $node ) {
	$notes = note_GetByNode($node);
	
	$loves = noteLove_CountByNode($node);
	
	// Populate Love
	foreach ( $notes as &$note ) {
		$note['love'] = 0;

		foreach ( $loves as $love ) {
			if ( $note['id'] === $love['note'] ) {
				$note['love'] = $love['count'];
				$note['love-timestamp'] = $love['timestamp'];
			}
		}
	}
	
	return $notes;
	
/*
	$multi = is_array($ids);
	if ( !$multi )
		$ids = [$ids];
	
	$nodes = node_GetById($ids);
	if ( !$nodes )
		return null;
		
	$metas = nodeMeta_ParseByNode($ids);
	$links = nodeLink_ParseByNode($ids);

	$loves = nodeLove_GetByNode($ids);
	
	$notes = note_CountByNode($ids);
	
	$games = node_IdToIndex(node_CountByAuthorType($ids, false, 'item', 'game'));
	$articles = node_IdToIndex(node_CountByAuthorType($ids, false, 'page', 'article'));
	$posts = node_IdToIndex(node_CountByAuthorType($ids, false, 'post'));

	// Populate Metadata
	foreach ( $nodes as &$node ) {
		// Walk paths
		$node['path'] = node_WalkById($node['id']);
		
		if ( $node['type'] == 'user' ) {
			$node['games'] = isset($games[$node['id']]) ? $games[$node['id']]['count'] : 0;
			$node['articles'] = isset($articles[$node['id']]) ? $articles[$node['id']]['count'] : 0;
			$node['posts'] = isset($posts[$node['id']]) ? $posts[$node['id']]['count'] : 0;
		}
		
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
	
	// Populate Note (comment) Count
	foreach ( $nodes as &$node ) {
		// Check if note data is public for this Node type
		if ( note_IsNotePublicByNode($node) ) {
			$node['notes'] = 0;

			foreach ( $notes as $note ) {
				if ( $node['id'] === $note['node'] ) {
					$node['notes'] = $note['count'];
					$node['notes-timestamp'] = $note['timestamp'];
				}
			}
		}
	}


	if ($multi)
		return $nodes;
	else
		return $nodes[0];
		
	*/
}
