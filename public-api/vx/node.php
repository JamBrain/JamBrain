<?php
const CONFIG_PATH = "../../src/shrub/";
const SHRUB_PATH = "../../src/shrub/src/";

include_once __DIR__."/".CONFIG_PATH."config.php";
require_once __DIR__."/".SHRUB_PATH."api.php";
require_once __DIR__."/".SHRUB_PATH."node/node.php";

json_Begin();

const THINGS_I_CAN_LOVE = [
	'post',
	'item'
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

			$subtypes = json_ArgShift();
			if ( !empty($subtypes) ) {
				$RESPONSE['subtypes'] = $subtypes;
			}

			$RESPONSE['feed'] = node_GetFeedByNodeMethodType( $root, $methods, $types, $subtypes );
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
		
		// if not logged in, where will be blank
		if ( $user_id = userAuth_GetID() ) {
			$RESPONSE['where'] = nodeComplete_GetWhereIdCanCreate($user_id);
		}
		else {
			json_EmitFatalError_Permission(null, $RESPONSE);
		}
		break; //case 'where': //node/where

	case 'what': //node/what
		json_ValidateHTTPMethod('GET');
		
		// if not logged in, where will be blank
		if ( $user_id = userAuth_GetID() ) {
			$parent = intval(json_ArgShift());
			if ( $parent ) {
				$RESPONSE['what'] = nodeComplete_GetWhatIdHasAuthoredByParent($user_id, $parent);
			}
			else {
				json_EmitFatalError_BadRequest(null, $RESPONSE);
			}
		}
		else {
			json_EmitFatalError_Permission(null, $RESPONSE);
		}
		break; //case 'what': //node/what
		
	case 'add': //node/add/:parent/:type/:subtype/:subsubtype
		json_ValidateHTTPMethod('POST');
//		json_ValidateHTTPMethod('GET');
		
		// NOTE: This doesn't actually need POST, but it uses the method for safety
		
		if ( $user_id = userAuth_GetID() ) {
			$parent = intval(json_ArgShift());
			$type = coreSlugify_Name(json_ArgShift());
			$subtype = coreSlugify_Name(json_ArgShift());
			$subsubtype = coreSlugify_Name(json_ArgShift());

			if ( empty($parent) || empty($type) ) {
				json_EmitFatalError_BadRequest(null, $RESPONSE);
			}
			
			$where = nodeComplete_GetWhereIdCanCreate($user_id);
			
			if ( !isset($where[$type]) || !in_array($parent, $where[$type]) ) {
				json_EmitFatalError_BadRequest(null, $RESPONSE);
			}
			
			switch ( $type ) {
				case 'item':
					// TODO: Rollback
				
					// For now we only support game items, so hardcode game
					$new_node = node_Add($parent, $user_id, $type, "game", "", null, "", "");
					if ( $new_node ) {
						nodeMeta_AddByNode($new_node, SH_NODE_META_SHARED, 'can-create', 'post');
						nodeLink_AddbyNode($new_node, $user_id, SH_NODE_META_PUBLIC, 'author');
					}
					else {
						json_EmitFatalError_ServerError(null, $RESPONSE);
					}
					
					$RESPONSE['id'] = $new_node;
					break;
					
//				case 'post':
//					break;

				default:
					break;
			};
		}
		else {
			json_EmitFatalError_Permission(null, $RESPONSE);
		}
		break; //case 'add': //node/add

	case 'update': //node/update/:node
		json_ValidateHTTPMethod('POST');

		if ( $user_id = userAuth_GetID() ) {
			$node_id = intval(json_ArgShift());
			if ( empty($node_id) ) {
				json_EmitFatalError_BadRequest(null, $RESPONSE);
			}
			
			// Parse POST
			if ( isset($_POST['name']) )
				$name = coreSanitize_String(substr($_POST['name'], 0, 96));
			else
				json_EmitFatalError_BadRequest("'name' not found in POST", $RESPONSE);
				
			if ( isset($_POST['body']) )
				$body = coreSanitize_String(substr($_POST['body'], 0, 32768));
			else
				json_EmitFatalError_BadRequest("'body' not found in POST", $RESPONSE);

			if ( isset($_POST['tag']) )
				$version_tag = coreSanitize_Slug(substr($_POST['tag'], 0, 32));
			else
				$version_tag = "";

			// Fetch Node			
			$node = nodeComplete_GetById($node_id);
			$authors = nodeList_GetAuthors($node);
			
			// If you are authorized to edit
			if ( in_array($user_id, $authors) ) {
				$RESPONSE['updated'] = node_Edit(
					$node_id,
					$node['parent'], $node['author'], 
					$node['type'], $node['subtype'], $node['subsubtype'],
					$node['slug'],
					$name,
					$body,
					$version_tag);
			}
			else {
				json_EmitFatalError_Permission(null, $RESPONSE);
			}
		}
		else {
			json_EmitFatalError_Permission(null, $RESPONSE);
		}
		break; //case 'update': //node/update

	case 'drafts': //node/drafts
	
		break; //case 'drafts': //node/drafts

	case 'publish': //node/publish
		json_ValidateHTTPMethod('POST');
		
		if ( $user_id = userAuth_GetID() ) {
			$node_id = intval(json_ArgShift());
			if ( empty($node_id) ) {
				json_EmitFatalError_BadRequest(null, $RESPONSE);
			}
			
			// Parse POST
			if ( isset($_POST['event']) )
				$event = coreSanitize_String(substr($_POST['event'], 0, 24));
			else
				json_EmitFatalError_BadRequest("'event' not found in POST", $RESPONSE);

			if ( $event === 'compo' || $event === 'jam' ) {
			}
			else {
				json_EmitFatalError_BadRequest("Unsupported 'event'", $RESPONSE);
			}

			// Fetch Node			
			$node = nodeComplete_GetById($node_id);
			$authors = nodeList_GetAuthors($node);

			// If you are authorized to edit
			if ( in_array($user_id, $authors) ) {
				$slug = coreSlugify_Name($node['name']);
				if ( in_array($slug, $SH_NAME_RESERVED) ) {
					json_EmitFatalError_BadRequest("Title is a reserved word", $RESPONSE);
				}
				
				$new_slug = node_GetUniqueSlugByParentSlug($node['parent'], $slug);
			
				if ( strlen($new_slug) < 3 ) {
					json_EmitFatalError_BadRequest("Title is too short (minumum 3 characters)", $RESPONSE);
				}
				
				$RESPONSE['edit'] = node_Edit(
					$node_id,
					$node['parent'], $node['author'], 
					$node['type'], $node['subtype'], $event,
					$new_slug,
					$node['name'],
					$node['body'],
					"!PUBLISH");
				
				$RESPONSE['publish'] = node_Publish(
					$node_id
				);
			}
			else {
				json_EmitFatalError_Permission(null, $RESPONSE);
			}
		}
		else {
			json_EmitFatalError_Permission(null, $RESPONSE);
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
