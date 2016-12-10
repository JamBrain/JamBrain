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
		
		// TODO: Support Symlinks and HardLinks (?)

		if ( json_ArgCount() ) {
			$root = intval(json_ArgShift());
			$RESPONSE['root'] = $root;
			
			$parent = $root;
			$RESPONSE['path'] = [];
			$RESPONSE['extra'] = [];
			
			foreach ( json_ArgGet() as $slug ) {
				$slug = coreSlugify_PathName($slug);

				if ( !empty($slug) && $slug[0] == '$' ) {
					$node = intval(substr($slug, 1));

					// Validate that node's parent correct
					if ( node_GetParentById($node) !== $parent ) {
						$node = 0;
					}
				}
				else {
					$node = node_GetIdByParentSlug($parent, $slug);
				}

				if ( $node ) {
					$parent = $node;
					$RESPONSE['path'][] = $node;
				}
				else {
					if ( !empty($slug) ) {
						$RESPONSE['extra'][] = $slug;//coreSlugify_Name($slug); // already slugified
					}
					else {
						json_EmitFatalError_BadRequest(null, $RESPONSE);
					}
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

			$methods = json_ArgShift();
			if ( empty($methods) ) {
				$methods = ['parent'];
			}
			else {
				$methods = array_map("coreSlugify_Name", explode('+', $methods));
				
				$allowed_methods = ['parent','superparent','author'];
				foreach ( $methods as &$method ) {
					if ( !in_array($method, $allowed_methods) ) {
						json_EmitFatalError_BadRequest("Invalid method: $method", $RESPONSE);
					}
				}
			}
			$RESPONSE['method'] = $methods;

			$types = json_ArgShift();
			if ( empty($types) ) {
				$types = ['post'];
			}
			else {
				$types = array_map("coreSlugify_Name", explode('+', $types));

				$allowed_types = ['post','item','event'];
				foreach ( $types as &$type ) {
					if ( !in_array($type, $allowed_types) ) {
						json_EmitFatalError_BadRequest("Invalid type: $type", $RESPONSE);
					}
				}
			}
			$RESPONSE['types'] = $types;

			$RESPONSE['feed'] = node_GetFeedByNodeMethodType( $root, $methods, $types );
		}
		else {
			json_EmitFatalError_BadRequest(null, $RESPONSE);
		}
		break; // case 'feed': //node/feed

	/// This gets the extra metadata an active user has access to
	case 'getmy': //node/getmy
		json_ValidateHTTPMethod('GET');

		if ( $user_id = userAuth_GetID() ) {
			$metas = nodeMeta_ParseByNode($user_id);
			$meta_out = array_merge([],
				// Public metadata (this is already in the node)
				//isset($metas[SH_NODE_META_PUBLIC]) ? $metas[SH_NODE_META_PUBLIC] : [],
				// Shared metadata (authors??)
				isset($metas[SH_NODE_META_SHARED]) ? $metas[SH_NODE_META_SHARED] : [],
				// Protected metadata
				isset($metas[SH_NODE_META_PROTECTED]) ? $metas[SH_NODE_META_PROTECTED] : []
			);

			$links = nodeLink_ParseByNode($user_id);
			$link_out = array_merge([],
				// Public Links from me (this is already in the node)
				//isset($links[0][SH_NODE_META_PUBLIC]) ? $links[0][SH_NODE_META_PUBLIC] : [],
				// Shared Links from me
				isset($links[0][SH_NODE_META_SHARED]) ? $links[0][SH_NODE_META_SHARED] : [],
				// Procted Links from me
				isset($links[0][SH_NODE_META_PROTECTED]) ? $links[0][SH_NODE_META_PROTECTED] : []
			);
			$refs_out = array_merge([],
				// Public links to me
				isset($links[1][SH_NODE_META_PUBLIC]) ? $links[1][SH_NODE_META_PUBLIC] : [],
				// Shared links to me
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

	case 'where': //node/where
		json_ValidateHTTPMethod('GET');
		
		$RESPONSE['where'] = [];
//		$RESPONSE['where']['post'] = [];
//		$RESPONSE['where']['item'] = [];
//		$RESPONSE['where']['article'] = [];
		
		// if not logged in, where will be blank
		if ( $user_id = userAuth_GetID() ) {
			// Scan for things I am the author of
			$author_links = nodeLink_GetByKeyNode("author", $user_id);
			
			$author_ids = [];

			foreach( $author_links as &$link ) {
				// We only care about public (for now)
				if ( $link['scope'] == SH_NODE_META_PUBLIC ) {
					if ( $link['b'] == $user_id ) {
						$author_ids[] = $link['a'];
					}
				}
			}
			

			// Scan for nodes with 'cat-create' metadata
			$metas = nodeMeta_GetByKey("can-create");

			foreach( $metas as &$meta ) {
				if ( $meta['scope'] == SH_NODE_META_PUBLIC ) {
					if ( !isset($RESPONSE['where'][$meta['value']]) ) {
						$RESPONSE['where'][$meta['value']] = [];
					}
					
					$RESPONSE['where'][$meta['value']][] = $meta['node'];
				}
				else if ( $meta['scope'] == SH_NODE_META_SHARED ) {
					if ( in_array($meta['node'], $author_ids) ) {
						if ( !isset($RESPONSE['where'][$meta['value']]) ) {
							$RESPONSE['where'][$meta['value']] = [];
						}
						
						$RESPONSE['where'][$meta['value']][] = $meta['node'];
					}
				}
			}

//			// Let me post content to my own node (but we're adding ourselves last, to make it the least desirable)
//			// NOTE: Don't forge tto create sub-arrays here
//			$RESPONSE['where']['post'][] = $user_id;
//			$RESPONSE['where']['item'][] = $user_id;
//			$RESPONSE['where']['article'][] = $user_id;
		}
		break; //case 'where': //node/where
		
	case 'add': //node/add
	
	
		break; //case 'add': //node/add

	case 'update': //node/Update
	
	
		break; //case 'update': //node/update

	case 'publish': //node/publish
//		json_ValidateHTTPMethod('POST');
		
		//if ( $user_id = userAuth_GetID() ) {
		{	
//			$parent = intval(json_ArgShift());
//			$name = json_ArgShift();
//			if ( !empty($name) ) {
//				$RESPONSE['hoo'] = node_GetSlugByParentSlugLike($parent, $name."%");
//				
//				$RESPONSE['moo'] = node_GetUniqueSlugByParentSlug($parent, $name);
//			}
		
		
		}	
		break; //case 'publish': //node/publish

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
