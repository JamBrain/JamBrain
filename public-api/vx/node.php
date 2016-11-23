<?php
const CONFIG_PATH = "../../src/shrub/";
const SHRUB_PATH = "../../src/shrub/src/";

include_once __DIR__."/".CONFIG_PATH."config.php";
require_once __DIR__."/".SHRUB_PATH."api.php";
require_once __DIR__."/".SHRUB_PATH."node/node.php";

json_Begin();

// Do Actions //
switch ( array_shift($REQUEST) ) {
	case 'get':
		json_ValidateHTTPMethod('GET');
		
		// Extract requests
		if ( isset($REQUEST[0]) ) {
			$node_ids = explode('+', $REQUEST[0]);

			// Sanitize
			foreach ( $node_ids as &$id ) {
				$id = intval($id);
				
				if ( !$id ) {
					json_EmitFatalError_BadRequest("Bad ID", $RESPONSE);
				}
			}
			sort($node_ids);

			// Limit number of nodes
			if ( count($node_ids) > 20 ) {
				json_EmitFatalError_BadRequest("Too many nodes", $RESPONSE);
			}
			
			$nodes = nodeComplete_GetById($node_ids);
			
//			$nodes = node_GetById($node_ids);
//			
//			$metas = nodeMeta_GetByNode($node_ids);
//			$links = nodeLink_GetByNode($node_ids);
//				
//			// Populate Links		
//			foreach ( $nodes as &$node ) {
//				$node['a'] = [];
//				$node['b'] = [];
//				
//				foreach ( $links as $link ) {
//					if ( $node['id'] === $link['a'] ) {
//						if ( isset($node['a'][$link['type']]) ) {
//							$node['a'][$link['type']][] = $link['b'];
//						}
//						else {
//							$node['a'][$link['type']] = [$link['b']];
//						}
//					}
//					else if ( $node['id'] === $link['b'] ) {
//						if ( isset($node['b'][$link['type']]) ) {
//							$node['b'][$link['type']][] = $link['a'];
//						}
//						else {
//							$node['b'][$link['type']] = [$link['a']];
//						}
//					}
//				}
//			}
//
//			// Determine what we can see about the node
//
//			$scope = 0;
//			
//			// Populate Metadata
//			foreach ( $nodes as &$node ) {
//				$node['meta'] = [];
//				
//				foreach ( $metas as $meta ) {
//					if ( $node['id'] === $meta['node'] ) {
//						if ( $meta['scope'] <= $scope ) {
//							$node['meta'][$meta['key']] = $meta['value'];
//						}
//					}
//				}
//				//sort($node['meta']);
//			}

			// TODO: Determine if we're allowed to view the requested nodes
			
			$out = [];
			foreach( $nodes as &$node ) {
				// TODO: a better check than this
				if ( $node['published'] === "0000-00-00T00:00:00Z" ) {
					$user_id = user_AuthUser();

					// Bad Id
					if ( $user_id == 0 )
						continue;
					
					// Not the author
					if ( $user_id != $node['author'] ) {
						// Not on the author list
						if ( !isset($node['b']['author']) || !in_array($user_id, $node['b']['author']) ) {
							// Not an admin
							if ( !user_AuthIsAdmin() ) {
								continue;
							}
						}
					}
				}
				
				// If we get here, we're allowed to view the node
				$out[] = $node;
			}

			$RESPONSE['node'] = $out;
			
//			$RESPONSE['node'] = $nodes;
//			$RESPONSE['meta'] = $metas;
//			$RESPONSE['link'] = $links;
		}
		else {
			json_EmitFatalError_BadRequest(null, $RESPONSE);
		}
		break;
	case 'walk':
		json_ValidateHTTPMethod('GET');

		if ( count($REQUEST) > 0 ) {
			$root = intval(array_shift($REQUEST));
			$RESPONSE['root'] = $root;
			
			$parent = $root;
			$RESPONSE['path'] = [];
			$RESPONSE['extra'] = [];
			
			foreach ( $REQUEST as $slug ) {
				$node = node_GetIdByParentSlug($parent, coreSlugify_Name($slug));
				if ( $node ) {
					$parent = $node;
					$RESPONSE['path'][] = $node;
				}
				else {
					$RESPONSE['extra'][] = coreSlugify_Name($slug);
				}
			}
			
			$RESPONSE['node'] = $parent;
		}
		else {
			json_EmitFatalError_BadRequest(null, $RESPONSE);
		}
		break;
	case 'feed':
		json_ValidateHTTPMethod('GET');

		if ( count($REQUEST) > 0 ) {
			$root = intval(array_shift($REQUEST));
			$RESPONSE['root'] = $root;

			$types = [];
			if ( isset($REQUEST[0]) ) {
				$types = explode('+', $REQUEST[0]);
			}
			$RESPONSE['types'] = $types;

//			foreach ( $REQUEST as $slug ) {
//				$types[] = coreSlugify_Name($slug);
//			}
			
			$RESPONSE['feed'] = node_GetPublishedIdModifiedByParentType($root, $types);
		}
		else {
			json_EmitFatalError_BadRequest(null, $RESPONSE);
		}
		break;
	default:
		json_EmitFatalError_Forbidden(null, $RESPONSE);
		break;
};

json_End();
