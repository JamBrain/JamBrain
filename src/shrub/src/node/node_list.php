<?php

// nodeList are helper functions for dealing with arrays of nodes

function nodeList_GetIds( $nodes ) {
	// A single node 
	if ( is_array($nodes) && isset($nodes['id']) ) {
		return $nodes['id'];
	}
	// An array of nodes
	else if ( is_array($nodes) ) {
		$ret = [];
		foreach ( $nodes as &$node ) {
			if ( isset($node['id']) ) {
				$ret[] = $node['id'];
			}
		}
		return $ret;
	}
	return null;
}
