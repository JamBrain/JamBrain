<?php
const CONFIG_PATH = "../../src/shrub/";
const SHRUB_PATH = "../../src/shrub/src/";

include_once __DIR__."/".CONFIG_PATH."config.php";
require_once __DIR__."/".SHRUB_PATH."api.php";
require_once __DIR__."/".SHRUB_PATH."node/node.php";

json_Begin();

const THINGS_I_CAN_LOVE = [
	'post'
];

const THINGS_I_CAN_STAR = [
	'user'
];

// Do Actions
$action = json_ArgShift();
switch ( $action ) {
	case 'get': //node/get
		json_ValidateHTTPMethod('GET');
		
		if ( json_ArgCount() ) {
			// Extract requests
			$node_ids = explode('+', json_ArgGet(0));

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

			// TODO: Determine if we're allowed to view the requested nodes
			
			$out = [];
			if ( $nodes ) {
				foreach( $nodes as &$node ) {
					// TODO: a better check than this
					if ( $node['published'] === "0000-00-00T00:00:00Z" ) {
						$user_id = userAuth_GetId();
	
						// Bad Id
						if ( $user_id == 0 )
							continue;
						
						// Not the author
						if ( $user_id != $node['author'] ) {
							// Not on the author list
							if ( !isset($node['b']['author']) || !in_array($user_id, $node['b']['author']) ) {
								// Not an admin
								if ( !userAuth_IsAdmin() ) {
									continue;
								}
							}
						}
					}
					
					// If we get here, we're allowed to view the node
					$out[] = $node;
				}
			}

			$RESPONSE['node'] = $out;
		}
		else {
			json_EmitFatalError_BadRequest(null, $RESPONSE);
		}
		break; // case 'get': //node/get

	case 'walk': //node/walk
		json_ValidateHTTPMethod('GET');

		if ( json_ArgCount() ) {
			$root = intval(json_ArgShift());
			$RESPONSE['root'] = $root;
			
			$parent = $root;
			$RESPONSE['path'] = [];
			$RESPONSE['extra'] = [];
			
			foreach ( json_ArgGet() as $slug ) {
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
		break; // case 'walk': //node/walk

	case 'feed': //node/feed
		json_ValidateHTTPMethod('GET');

		if ( json_ArgCount() ) {
			$root = intval(json_ArgShift());
			$RESPONSE['root'] = $root;

			$types = [];
			if ( json_ArgCount() ) {
				$types = explode('+', json_ArgGet(0));
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
		break; // case 'feed': //node/feed

	case 'getmy': //node/getmy
		json_ValidateHTTPMethod('GET');

		if ( $user_id = userAuth_GetID() ) {
			$metas = nodeMeta_ParseByNode($user_id);
			$meta_out = array_merge([], 
				isset($metas[SH_NODE_META_SHARED]) ? $metas[SH_NODE_META_SHARED] : [],
				isset($metas[SH_NODE_META_PROTECTED]) ? $metas[SH_NODE_META_PROTECTED] : []
			);

			$links = nodeLink_ParseByNode($user_id);
			$link_out = array_merge([], 
				isset($links[0][SH_NODE_META_SHARED]) ? $links[0][SH_NODE_META_SHARED] : [],
				isset($links[0][SH_NODE_META_PROTECTED]) ? $links[0][SH_NODE_META_PROTECTED] : []
			);
			$refs_out = array_merge([], 
				isset($links[1][SH_NODE_META_PUBLIC]) ? $links[1][SH_NODE_META_PUBLIC] : [],
				isset($links[1][SH_NODE_META_SHARED]) ? $links[1][SH_NODE_META_SHARED] : []
			);
				
			$RESPONSE['id'] = $user_id;
			$RESPONSE['meta'] = $meta_out;
			$RESPONSE['link'] = $link_out;
			$RESPONSE['refs'] = $refs_out;
		}
		else {
			json_EmitFatalError_Permission(null, $RESPONSE);
		}
		break; // case 'getmy': //node/getmy

	case 'love': //node/love
		$old_action = $action;
		$action = json_ArgShift();
		switch ( $action ) {
			case 'get': //node/love/get
				json_ValidateHTTPMethod('GET');
				
				if ( json_ArgCount() ) {
					$node_ids = explode('+', json_ArgGet(0));
		
					// Sanitize
					foreach ( $node_ids as &$id ) {
						$id = intval($id);
						
						if ( !$id ) {
							json_EmitFatalError_BadRequest("Invalid ID requested", $RESPONSE);
						}
					}
					sort($node_ids);
					
					$RESPONSE['love'] = nodeLove_GetByNode($node_ids);
				}
				else {
					json_EmitFatalError_BadRequest(null, $RESPONSE);
				}
				break; // case 'get': //node/love/get
				
			case 'getmy': //node/love/getmy
				json_ValidateHTTPMethod('GET');
				
				if ( $user_id = userAuth_GetID() ) {
					// Limit to last 500 love?

					$RESPONSE['my-love'] = nodeLove_GetByAuthor($user_id);
				}
				else {
					json_EmitFatalError_Permission(null, $RESPONSE);
				}
				break; // case 'getmy': //node/love/getmy

			case 'add': //node/love/add
				json_ValidateHTTPMethod('GET');
				
				if ( json_ArgCount() ) {
					$node_id = intval(json_ArgGet(0));
					
					if ( $node_id ) {
						// NOTE: You are allowed to LOVE anonymously (it's just not fetchable)
						$user_id = userAuth_GetID();

						if ( $node = node_GetById($node_id) ) {
							if ( in_array($node['type'], THINGS_I_CAN_LOVE) ) {
								$RESPONSE['id'] = nodeLove_AddByNode($node_id, $user_id);
								
								$RESPONSE['love'] = nodeLove_GetByNode($node_id);
							}
							else {
								json_EmitFatalError_BadRequest("Can't love ".$node['type'], $RESPONSE);
							}
						}
						else {
							json_EmitFatalError_NotFound(null, $RESPONSE);
						}
					}
					else {
						json_EmitFatalError_BadRequest(null, $RESPONSE);
					}
				}
				else {
					json_EmitFatalError_BadRequest(null, $RESPONSE);
				}
				break; // case 'add': //node/love/add

			case 'remove': //node/love/remove
				json_ValidateHTTPMethod('GET');

				if ( json_ArgCount() ) {
					$node_id = intval(json_ArgGet(0));
					
					if ( $node_id ) {
						// NOTE: You are allowed to LOVE anonymously (it's just not fetchable)
						$user_id = userAuth_GetID();

						if ( $node = node_GetById($node_id) ) {
							if ( in_array($node['type'], THINGS_I_CAN_LOVE) ) {
								$RESPONSE['removed'] = nodeLove_RemoveByNode($node_id, $user_id);
								
								$RESPONSE['love'] = nodeLove_GetByNode($node_id);
								if ( !isset($RESPONSE['love']) )
									$RESPONSE['love'] = [
										'id' => $node_id,
										'count' => 0,
										'timestamp' => "0000-00-00T00:00:00Z"
									];
							}
							else {
								json_EmitFatalError_BadRequest("Can't love ".$node['type'], $RESPONSE);
							}
						}
						else {
							json_EmitFatalError_NotFound(null, $RESPONSE);
						}
					}
					else {
						json_EmitFatalError_BadRequest(null, $RESPONSE);
					}
				}
				else {
					json_EmitFatalError_BadRequest(null, $RESPONSE);
				}
				break; // case 'remove': //node/love/remove
				
			default:
			json_EmitFatalError_Forbidden(null, $RESPONSE);
				break; // default
		};
		break; // case 'love': //node/love

	case 'star': //node/star
		$old_action = $action;
		$action = json_ArgShift();
		switch ( $action ) {
			case 'add': //node/star/add
				json_ValidateHTTPMethod('GET');
				
				if ( json_ArgCount() ) {
					$node_id = intval(json_ArgGet(0));
					$user_id = userAuth_GetID();
					
					if ( $node_id && $user_id ) {
						if ( $node = node_GetById($node_id) ) {
							if ( in_array($node['type'], THINGS_I_CAN_STAR) ) {
								// TODO: Check if this exact value isn't the newest

								$RESPONSE['id'] = nodeLink_AddByNode($user_id, $node_id, SH_NODE_META_SHARED, 'star');
							}
							else {
								json_EmitFatalError_BadRequest("Can't star ".$node['type'], $RESPONSE);
							}
						}
						else {
							json_EmitFatalError_NotFound(null, $RESPONSE);
						}
					}
					else {
						json_EmitFatalError_BadRequest(null, $RESPONSE);
					}
				}
				else {
					json_EmitFatalError_BadRequest(null, $RESPONSE);
				}
				break; // case 'add': //node/love/add

			case 'remove': //node/star/remove
				json_ValidateHTTPMethod('GET');

				if ( json_ArgCount() ) {
					$node_id = intval(json_ArgGet(0));
					$user_id = userAuth_GetID();
					
					if ( $node_id && $user_id ) {
						if ( $node = node_GetById($node_id) ) {
							if ( in_array($node['type'], THINGS_I_CAN_STAR) ) {
								// TODO: Check if this exact value isn't the newest
								
								$RESPONSE['id'] = nodeLink_RemoveByNode($user_id, $node_id, SH_NODE_META_SHARED, 'star');
							}
							else {
								json_EmitFatalError_BadRequest("Can't star ".$node['type'], $RESPONSE);
							}
						}
						else {
							json_EmitFatalError_NotFound(null, $RESPONSE);
						}
					}
					else {
						json_EmitFatalError_BadRequest(null, $RESPONSE);
					}
				}
				else {
					json_EmitFatalError_BadRequest(null, $RESPONSE);
				}
				break; // case 'remove': //node/star/remove
				
			default:
			json_EmitFatalError_Forbidden(null, $RESPONSE);
				break; // default
		};
		break; // case 'star': //node/star

	default:
		json_EmitFatalError_Forbidden(null, $RESPONSE);
		break; // default
};

json_End();
