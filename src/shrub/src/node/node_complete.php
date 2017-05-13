<?php
require_once __DIR__."/../note/note_core.php";
require_once __DIR__."/../grade/grade_core.php";

const F_NODE_ALL = 0xFFFF;

const F_NODE_META = 0x1;
const F_NODE_LINK = 0x2;
const F_NODE_PATH = 0x4;
//const F_NODE_ = 0x8;
const F_NODE_LOVE = 0x10;
const F_NODE_COMMENT = 0x20;
const F_NODE_COUNT = 0x40;
//const F_NODE_ = 0x80;
const F_NODE_GRADE = 0x100;
//const F_NODE_ = 0x200;
//const F_NODE_ = 0x400;
//const F_NODE_ = 0x800;

function nodeComplete_GetById( $ids, $flags = F_NODE_ALL ) {
	$multi = is_array($ids);
	if ( !$multi )
		$ids = [$ids];

	// Fetch nodes	
	$nodes = node_GetById($ids);
	if ( !$nodes )
		return null;

	// Populate Metadata
	if ( $flags & F_NODE_META ) {
		$metas = nodeMeta_ParseByNode($ids);
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
	}

	// Populate Links (NOTE: Links come in Pairs)
	if ( $flags & F_NODE_LINK ) {
		$links = nodeLink_ParseByNode($ids);
		foreach ( $nodes as &$node ) {
			if ( isset($links[$node['id']][0][SH_NODE_META_PUBLIC]) ) {
				$node['link'] = $links[$node['id']][0][SH_NODE_META_PUBLIC];
			}
			else {
				$node['link'] = [];
			}
	
			// TODO: Store Protected and Private Metadata
		}
	}

	// Populate paths **
	if ( $flags & F_NODE_PATH ) {
		foreach ( $nodes as &$node ) {
			// Walk paths
			$paths = node_GetPathById($node['id'], 1);	// 1 = root node
			$node['path'] = $paths['path'];
			$node['parents'] = $paths['parent'];
		}
	}
	
	// **** //

	// Populate Love
	if ( $flags & F_NODE_LOVE ) {
		$loves = nodeLove_GetByNode($ids);
		foreach ( $nodes as &$node ) {
			$node['love'] = 0;
			
			foreach ( $loves as &$love ) {
				if ( $node['id'] === $love['node'] ) {
					$node['love'] = $love['count'];
					$node['love-timestamp'] = $love['timestamp'];
				}
			}
		}
	}

	// Populate Note (comment) Count
	if ( $flags & F_NODE_COMMENT ) {
		$notes = note_CountByNode($ids);
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
	}

	// Populate Counts
	if ( $flags & F_NODE_COUNT ) {
		$games = node_IdToIndex(node_CountByAuthorType($ids, false, 'item', 'game'));
		$articles = node_IdToIndex(node_CountByAuthorType($ids, false, 'page', 'article'));
		$posts = node_IdToIndex(node_CountByAuthorType($ids, false, 'post'));
	
		foreach ( $nodes as &$node ) {
			if ( $node['type'] == 'user' ) {
				$node['games'] = isset($games[$node['id']]) ? $games[$node['id']]['count'] : 0;
				$node['articles'] = isset($articles[$node['id']]) ? $articles[$node['id']]['count'] : 0;
				$node['posts'] = isset($posts[$node['id']]) ? $posts[$node['id']]['count'] : 0;
			}
		}
	}
	
	// **** //

	// Populate Grades
	if ( $flags & F_NODE_GRADE ) {
		$grades = grade_CountByNode($ids);
		foreach ( $nodes as &$node ) {
			foreach ( $grades as $key => &$grade ) {
				if ( $node['id'] === $key ) {
					$node['grade'] = $grade;
				}
			}
		}
	}
	
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
	if ( !empty($authored_ids) ) {
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
	if ( !empty($node_ids) ) {
		$nodes = node_GetById($node_ids);			// OPTIMIZE: Use a cached function (we only need parent)
		
		global $RESPONSE;
		$RESPONSE['_node_ids'] = $node_ids;
		$RESPONSE['_nodes'] = $nodes;
		
		$authored_ids = [];
		foreach ( $nodes as &$node ) {
			if ( $node['parent'] == $parent ) {
				$authored_ids[] = $node['id'];
			}
		}
		
		return $authored_ids;
	}
	return [];
}
