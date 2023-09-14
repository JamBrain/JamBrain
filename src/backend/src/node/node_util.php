<?php

// 	Try to mirror what's available in src/internal/lib/node.js


function node_IsAuthor( &$node, &$user_id ) {
	// Confirm non-zero
	if ( !$user_id )
		return false;
	
	// Check if you are the node's author
	if ( $node['author'] == $user_id )
		return true;
		
	// Check if you are on the list of authors (metadata)
	if ( isset($node['meta']) && isset($node['meta']['author']) && in_array($user_id, $node['meta']['author']) )
		return true;
	
	return false;
}
