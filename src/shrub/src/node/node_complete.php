<?php
require_once __DIR__."/../comment/comment_core.php";
require_once __DIR__."/../grade/grade_core.php";

const F_NODE_ALL = 0xFFFFFF;			// NOTE: 24bit. Bits above 24bit must be explicitly included

const F_NODE_META = 0x1;
const F_NODE_LINK = 0x2;
const F_NODE_PATH = 0x4;
//const F_NODE_ = 0x8;
const F_NODE_LOVE = 0x10;
const F_NODE_COMMENT = 0x20;
const F_NODE_COUNT = 0x40;
//const F_NODE_ = 0x80;
const F_NODE_GRADE = 0x100;
const F_NODE_MAGIC = 0x200;
//const F_NODE_ = 0x400;
//const F_NODE_ = 0x800;

const F_NODE_NO_BODY = 0x01000000;		// Get the node without the body
const F_NODE_NO_LINKVALUE = 0x02000000;	// Get links without value

function nodeComplete_GetById( $ids, $flags = F_NODE_ALL ) {
	$multi = is_array($ids);
	if ( !$multi )
		$ids = [$ids];

	// Fetch nodes
	if ( $flags & F_NODE_NO_BODY )
		$nodes = node_GetNoBodyById($ids);
	else
		$nodes = node_GetById($ids);

	if ( !$nodes )
		return null;

	// Populate Metadata
	if ( $flags & F_NODE_META ) {
		$metas = nodeMeta_ParseByNode($ids);//, !($flags & F_NODE_NO_LINKVALUE));
		foreach ( $nodes as &$node ) {
			// Store Public Metadata
			if ( isset($metas[$node['id']][0][SH_SCOPE_PUBLIC]) ) {
				$node['meta'] = $metas[$node['id']][0][SH_SCOPE_PUBLIC];
//				$node['refs'] = $metas[$node['id']][0][SH_SCOPE_PUBLIC];
			}
			else {
				$node['meta'] = [];
//				$node['refs'] = [];
			}
		}
	}

//	// Populate Links (NOTE: Links come in Pairs)
//	if ( $flags & F_NODE_LINK ) {
//		$links = nodeLink_ParseByNode($ids, !($flags & F_NODE_NO_LINKVALUE));
//		foreach ( $nodes as &$node ) {
//			if ( isset($links[$node['id']][0][SH_SCOPE_PUBLIC]) ) {
//				$node['link'] = $links[$node['id']][0][SH_SCOPE_PUBLIC];
//			}
//			else {
//				$node['link'] = [];
//			}
//
//			// TODO: Store Protected and Private Metadata
//		}
//	}

	// Populate paths ** NOTE: Multiple queries!
	if ( $flags & F_NODE_PATH ) {
		foreach ( $nodes as &$node ) {
			// Walk paths
			$paths = nodeCache_GetPathById($node['id'], 1);	// 1 = root node
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
		$comments = comment_CountByNode($ids);
		foreach ( $nodes as &$node ) {
			// Check if comment data is public for this Node type
			if ( comment_IsCommentPublicByNode($node) ) {
				$node['notes'] = 0;

				foreach ( $comments as $comment ) {
					if ( $node['id'] === $comment['node'] ) {
						$node['notes'] = $comment['count'];
						$node['notes-timestamp'] = $comment['timestamp'];
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

	// Populate Magic
	if ( $flags & F_NODE_MAGIC ) {
		$magics = nodeMagic_GetByNode($ids);
		foreach ( $nodes as &$node ) {
			foreach ( $magics as $key => &$magic ) {
				if ( $node['id'] === $key ) {
					$node['magic'] = $magic;
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
//	$author_links = nodeLink_GetByKeyNode("author", $id);
	$author_links = nodeMeta_GetByKeyNode("author", $id);

	// Populate a list of things I authored
	$author_ids = [];
	foreach( $author_links as &$link ) {
		// We only care about public (for now)
		if ( $link['scope'] == SH_SCOPE_PUBLIC ) {
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
	$public_metas = nodeMeta_GetByKey("can-create", null, '='.SH_SCOPE_PUBLIC);

	// Add public nodes
	foreach( $public_metas as &$meta ) {
		if ( !isset($ret[$meta['value']]) ) {
			$ret[$meta['value']] = [];
		}

		$ret[$meta['value']][] = $meta['a'];
	}


	// Scan for things I am the author of
	$authored_ids = nodeComplete_GetAuthored($id);
	if ( !empty($authored_ids) ) {
		// Scan for shared nodes I authored
		$shared_metas = nodeMeta_GetByKeyNode("can-create", $authored_ids, '='.SH_SCOPE_SHARED);

		// Add shared nodes
		foreach( $shared_metas as &$meta ) {
			if ( in_array($meta['a'], $authored_ids) ) {
				if ( !isset($ret[$meta['value']]) ) {
					$ret[$meta['value']] = [];
				}

				$ret[$meta['value']][] = $meta['a'];
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
//		if ( $meta['scope'] == SH_SCOPE_PUBLIC ) {
//			if ( !isset($ret[$meta['value']]) ) {
//				$ret[$meta['value']] = [];
//			}
//
//			$ret[$meta['value']][] = $meta['a'];
//		}
//		// Add shared nodes (primarily authored nodes)
//		else if ( $meta['scope'] == SH_SCOPE_SHARED ) {
//			if ( in_array($meta['a'], $node_ids) ) {
//				if ( !isset($ret[$meta['value']]) ) {
//					$ret[$meta['value']] = [];
//				}
//
//				$ret[$meta['value']][] = $meta['a'];
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

// Legacy function. The new one returns the actual items
function nodeComplete_GetWhatIdsIdHasAuthoredByParent( $id, $parent ) {
	$node_ids = nodeComplete_GetAuthored($id);
	if ( !empty($node_ids) ) {
		$nodes = nodeCache_GetById($node_ids);

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

// Modern function returns the actual nodes
function nodeComplete_GetWhatIdHasAuthoredByParent( $id, $parent ) {
	$node_ids = nodeComplete_GetAuthored($id);
	if ( !empty($node_ids) ) {
		$nodes = nodeCache_GetById($node_ids);

		$authored = [];
		foreach ( $nodes as &$node ) {
			if ( $node['parent'] == $parent ) {
				$authored[] = $node;
			}
		}

		return $authored;
	}
	return [];
}
