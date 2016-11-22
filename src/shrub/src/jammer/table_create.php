<?php
require_once __DIR__."/../node/node.php";

// Not tables, but nodes
function MakeKeyNode( $key, $parent, $type, $slug, $name ) {
	global $SH;
	
	if ( !isset($SH[$key]) || !$SH[$key] ) {
		$node = node_Add(
			$parent,						// parent
			0,								// author (0 = orphaned)
			$type,'','',					// type, subtype, subsubtype
			$slug,$name,					// slug, name
			''								// body
		);
		
		if ( $node && global_Set($key, $node) ) {
			echo($key." = ".$node."\n");
		}
	}
}

MakeKeyNode('SH_NODE_ID_ITEMS', SH_NODE_ID_ROOT, SH_NODE_TYPE_ITEMS, 'items', 'Items' );
MakeKeyNode('SH_NODE_ID_TAGS', SH_NODE_ID_ROOT, SH_NODE_TYPE_TAGS, 'tags', 'Tags' );
MakeKeyNode('SH_NODE_ID_EVENTS', SH_NODE_ID_ROOT, SH_NODE_TYPE_EVENTS, 'events', 'Events' );

MakeKeyNode('jammer-root', SH_NODE_ID_ROOT, SH_NODE_TYPE_SITE, 'jammer', 'Jammer' );
MakeKeyNode('ludumdare-root', SH_NODE_ID_ROOT, SH_NODE_TYPE_SITE, 'ludum-dare', 'Ludum Dare' );
MakeKeyNode('jammer.bio-root', SH_NODE_ID_ROOT, SH_NODE_TYPE_SITE, 'jammer-bio', 'Jammer.bio' );
