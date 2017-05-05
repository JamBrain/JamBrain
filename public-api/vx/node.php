<?php
require_once __DIR__."/../config.php";

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

const VALID_META = [
	'item' => [
		'author-name' => ['length' => 64],
		'cover' => ['length' => 256],
		'grade-01-out' => ['length' => 1],
		'grade-02-out' => ['length' => 1],
		'grade-03-out' => ['length' => 1],
		'grade-04-out' => ['length' => 1],
		'grade-05-out' => ['length' => 1],
		'grade-06-out' => ['length' => 1],
		'grade-07-out' => ['length' => 1],
		'grade-08-out' => ['length' => 1],
	],
	'user' => [
		'real-name' => ['length' => 64],
		'avatar' => ['length' => 256],
	],
	'post' => [
	],
];

const VALID_LINK = [
	'item' => [
		'user' => [
			'author' => ['empty' => true],
		],
	],
	'user' => [
	],
	'post' => [
	],
];

const VALID_TRANSFORMS = [
	'item/game' => [
		'item/game/jam',
		'item/game/compo',
		'item/craft/jam',
	],
	'item/game/compo' => [
		'item/game/jam',
		'item/craft/jam',
	],
	'item/game/jam' => [
		'item/game/compo',
		'item/craft/jam',
	],
	'item/craft/jam' => [
		'item/game/jam',
		'item/game/compo',
	],
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
			if ( count($node_ids) > 250 ) {
				json_EmitFatalError_BadRequest("Too many nodes", $RESPONSE);
			}
			
			$RESPONSE['cached'] = true;
			
//			$nodes = nodeComplete_GetById($node_ids);
			$nodes = nodeCache_GetById($node_ids, $RESPONSE['cached']);

			// TODO: Determine if we're allowed to view the requested nodes
			
			$out = [];
			if ( $nodes ) {
				foreach( $nodes as &$node ) {
					// TODO: a better check than this
					// MK: This might not be doing anything!! That should explain why users were able to see unpublished content
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

	case 'feed': //node/feed/:node_id/:methods[]/:type/[:subtype]/[:subsubtype]
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
				
				$allowed_methods = ['parent','superparent','author','authors','all','unpublished','cool'];
				foreach ( $methods as &$method ) {
					if ( $method == 'all' ) {
						if ( count($methods) > 1 ) {
							json_EmitFatalError_BadRequest("Can't combine methods with all", $RESPONSE);
						}
						// totally fine, let it fall through
					}
					if ( $method == 'authors' ) {
						if ( count($methods) > 1 ) {
							json_EmitFatalError_BadRequest("Can't combine methods with authors", $RESPONSE);
						}
						else {
							json_EmitFatalError_BadRequest("Sorry. authors method not yet supported", $RESPONSE);
							// TODO: totally fine, let it fall through
						}
					}
					else if ( !in_array($method, $allowed_methods) ) {
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
				//$subtypes = array_map("coreSlugify_Name", explode('+', $subtypes));
				$subtypes = coreSlugify_Name($subtypes);
				
				$RESPONSE['subtypes'] = $subtypes;
			}

			$subsubtypes = json_ArgShift();
			if ( !empty($subsubtypes) ) {
				//$subsubtypes = array_map("coreSlugify_Name", explode('+', $subsubtypes));
				$subsubtypes = coreSlugify_Name($subsubtypes);
				
				$RESPONSE['subsubtypes'] = $subsubtypes;
			}
			
			$RESPONSE['offset'] = 0;
			$RESPONSE['limit'] = 10;

			if ( isset($_GET['offset']) ) {
				$RESPONSE['offset'] = intval($_GET['offset']);
			}
			if ( isset($_GET['limit']) ) {
				$RESPONSE['limit'] = intval($_GET['limit']);
				if ( $RESPONSE['limit'] < 1 )
					$RESPONSE['limit'] = 1;
				if ( $RESPONSE['limit'] > 50 )
					$RESPONSE['limit'] = 50;
			}

			$RESPONSE['feed'] = nodeFeed_GetByNodeMethodType( $root, $methods, $types, $subtypes, $subsubtypes, null, $RESPONSE['limit'], $RESPONSE['offset'] );
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

	// Where can I create content?
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

	// Get what a list of everything I authored under this node
	case 'what': //node/what/:node_id
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

		// NOTE: This doesn't actually use POST data

		if ( $user_id = userAuth_GetID() ) {
			$parent = intval(json_ArgShift());
			$type = coreSlugify_Name(json_ArgShift());
			$subtype = coreSlugify_Name(json_ArgShift());
			$subsubtype = coreSlugify_Name(json_ArgShift());

			$fulltype = $type;
			if ( $subtype )
				$fulltype .= '/'.$subtype;
			if ( $subsubtype )
				$fulltype .= '/'.$subsubtype;

			if ( empty($parent) || empty($type) ) {
				json_EmitFatalError_BadRequest(null, $RESPONSE);
			}

			// MK: This is a potential place you'll need to fix things once users are restricted from posting under other people's `can-create` nodes
			// MK: oh. after a quick glance it might be fine, but you should check it out again.
			$where = nodeComplete_GetWhereIdCanCreate($user_id);
			//$RESPONSE['where'] = $where;
			
			if ( !isset($where[$fulltype]) || !in_array($parent, $where[$fulltype]) ) {
				json_EmitFatalError_BadRequest("Can't create a $fulltype under this node", $RESPONSE);
			}
			
			// Default create limits
			$create_limits = [
				'item/game' => 1,
				'item/game/jam' => 1,
				'item/game/compo' => 1,
				'item/game/warmup' => 1,
				'item/game/incomplete' => 1,
				'item/game/release' => -1,	// i.e. unlimited

				'item/craft' => 0,			// i.e. can't create
				'item/craft/jam' => 0,		// i.e. can't create
				
				'post' => -25,				// i.e. unlimited
				'post/news' => 0,			// i.e. can't create
			];
			
			// TODO: Do things that modify limits here
			$true_limit = 2;	// TODO: up this as a user becomes more trustworthy.


			// Check if you haven't exceeded the limit
			$RESPONSE['limit'] = isset($create_limits[$fulltype]) ? $create_limits[$fulltype] : 0;
			
			if ( $RESPONSE['limit'] === 0 ) {
				json_EmitFatalError_Permission("You don't have permission to create a $fulltype here", $RESPONSE);
			}
			
			// Negatives are a pseudolimit
			if ( $RESPONSE['limit'] < 0 ) {
				$RESPONSE['limit'] = $true_limit * (-$RESPONSE['limit']);
			}
			

			// Check how many you have
			$RESPONSE['count'] = node_CountByParentAuthorType($parent, $user_id, $type, $subtype, $subsubtype);
//			if ( isset($RESPONSE['count']) && count($RESPONSE['count']) == 0 ) {
//				$RESPONSE['count'] = 0;
//			}
//			else if ( isset($RESPONSE['count']) && count($RESPONSE['count']) > 0 && isset($RESPONSE['count'][0]['count']) ) {
//				$RESPONSE['count'] = $RESPONSE['count'][0]['count'];
//			}
//			else {
//				json_EmitFatalError_BadRequest("Problem", $RESPONSE);
//			}
			
			if ( $RESPONSE['count'] >= $RESPONSE['limit'] ) {
				json_EmitFatalError_Permission("You don't have permission to create any more $fulltype's here", $RESPONSE);
			}

			switch ( $fulltype ) {
				case 'item/game':
					// TODO: Rollback

					$new_node = node_Add($parent, $user_id, $type, $subtype, "", null, "", "");
					if ( $new_node ) {
						// Allow posts under the game
						nodeMeta_AddByNode($new_node, SH_NODE_META_SHARED, 'can-create', 'post');
						// Add yourself as an author of the game
						nodeLink_AddbyNode($new_node, $user_id, SH_NODE_META_PUBLIC, 'author');
					}
					else {
						json_EmitFatalError_ServerError(null, $RESPONSE);
					}
					
					nodeCache_InvalidateById($new_node);
					
					$RESPONSE['type'] = $type;
					$RESPONSE['path'] = node_GetPathById($new_node, 1)['path']; // Root node
					$RESPONSE['count']++;
					$RESPONSE['id'] = $new_node;
					break;
					
				case 'post':
					$new_node = node_Add($parent, $user_id, $type, $subtype, "", null, "", "");
					if ( $new_node ) {
					}
					else {
						json_EmitFatalError_ServerError(null, $RESPONSE);
					}

					nodeCache_InvalidateById($new_node);

					$RESPONSE['type'] = $type;
					$RESPONSE['path'] = node_GetPathById($new_node, 1)['path']; // Root node
					$RESPONSE['count']++;
					$RESPONSE['id'] = $new_node;
					break;

				default:
					break;
			};
		}
		else {
			json_EmitFatalError_Permission(null, $RESPONSE);
		}
		break; //case 'add': //node/add

	case 'update': //node/update/:node_id
		json_ValidateHTTPMethod('POST');

		if ( $user_id = userAuth_GetID() ) {
			$node_id = intval(json_ArgShift());
			if ( empty($node_id) ) {
				json_EmitFatalError_BadRequest(null, $RESPONSE);
			}
			
			$changes = 0;

			// Fetch Node
			$node = nodeComplete_GetById($node_id);
			//$authors = nodeList_GetAuthors($node);
			
			if ( !$node )
				json_EmitFatalError_BadRequest("Problem fetching node", $RESPONSE);
			
			// Parse POST
			if ( isset($_POST['name']) ) {
				$name = coreSanitize_String(substr($_POST['name'], 0, 96));
				if ( $name !== $node['name'] )
					$changes++;
			}
			else {
				$name = $node['name'];
			}
				
			if ( isset($_POST['body']) ) {
				$body = coreSanitize_Body(substr($_POST['body'], 0, 32768));
				if ( $body !== $node['body'] )
					$changes++;
			}
			else {
				$body = $node['body'];
			}

			if ( isset($_POST['tag']) ) {
				$version_tag = coreSlugify_Name(substr($_POST['tag'], 0, 32));
				if ( !empty($version_tag) )
					$changes++;
			}
			else {
				$version_tag = "";
			}
				
			// If you are authorized to edit
//			if ( $user_id === $node_id || $user_id === $node['author'] || in_array($user_id, $authors) ) {
			if ( node_IsAuthor($node, $user_id) ) {		// NEEDS links!
				if ( $changes === 0 ) {
					$RESPONSE['updated'] = 0;
					$RESPONSE['message'] = "No changes";
				}
				else {
					$RESPONSE['updated'] = node_Edit(
						$node_id,
						$node['parent'], $node['author'], 
						$node['type'], $node['subtype'], $node['subsubtype'],
						$node['slug'],
						$name,
						$body,
						$version_tag
					);

					nodeCache_InvalidateById($node_id);
				}
			}
			else {
				json_EmitFatalError_Permission(null, $RESPONSE);
			}
		}
		else {
			json_EmitFatalError_Permission(null, $RESPONSE);
		}
		break; //case 'update': //node/update

	// Changes a node's type from one to another
	case 'transform': //node/transform/:node_id/:type/[:subtype]/[:subsubtype]
		json_ValidateHTTPMethod('POST');

		$node_id = intval(json_ArgShift());
		$user_id = userAuth_GetID();

		if ( $node_id && $user_id ) {
			if ( $node = nodeComplete_GetById($node_id) ) {
				if ( !node_IsAuthor($node, $user_id) ) { // NEEDS LINKS!
					json_EmitFatalError_Forbidden("Forbidden: You don't have permission to transform this", $RESPONSE);
				}
				
				$old_type = $node['type'];
				if ( $node['subtype'] )
					$old_type .= '/'.$node['subtype'];
				if ( $node['subsubtype'] )
					$old_type .= '/'.$node['subsubtype'];
				
				$RESPONSE['id'] = $node_id;
				$RESPONSE['before'] = $old_type;
				
				$type = json_ArgShift();
				$subtype = json_ArgShift();
				$subsubtype = json_ArgShift();
				
				$type = $type ? coreSlugify_Name($type) : $type;
				$subtype = $subtype ? coreSlugify_Name($subtype) : $subtype;
				$subsubtype = $subsubtype ? coreSlugify_Name($subsubtype) : $subsubtype;
				
				$new_type = $type;
				if ( $subtype )
					$new_type .= '/'.$subtype;
				if ( $subsubtype )
					$new_type .= '/'.$subsubtype;
				
				$RESPONSE['after'] = $new_type;
				
				if ( $new_type == $old_type ) {
					$RESPONSE['changed'] = 0;
				}
				else if ( in_array($new_type, VALID_TRANSFORMS[$old_type]) ) {
					$RESPONSE['changed'] = node_SetType($node_id, $type ? $type : "", $subtype ? $subtype : "", $subsubtype ? $subsubtype : "");
					
					nodeCache_InvalidateById($node_id);
				}
				else {
					json_EmitFatalError_Forbidden("Not a valid transform '$old_type' to '$new_type'", $RESPONSE);
				}
			}
		}
		else {
			json_EmitFatalError_Permission(null, $RESPONSE);
		}

		break; //case 'transform': //node/transform

	case 'publish': //node/publish/:node_id
		json_ValidateHTTPMethod('POST');
		
		if ( $user_id = userAuth_GetID() ) {
			$node_id = intval(json_ArgShift());
			if ( empty($node_id) ) {
				json_EmitFatalError_BadRequest(null, $RESPONSE);
			}
			
			// Parse POST
//			if ( isset($_POST['parent']) )
//				$parent = intval($_POST['parent']);
//			else
//				json_EmitFatalError_BadRequest("'parent' not found in POST", $RESPONSE);

//			if ( $event === 'compo' || $event === 'jam' ) {
//			}
//			else {
//				json_EmitFatalError_BadRequest("Unsupported 'event'", $RESPONSE);
//			}

			// Fetch Node			
			$node = nodeComplete_GetById($node_id);
			if ( $node['published'] ) {
				json_EmitFatalError_BadRequest("Already published", $RESPONSE);
			}
			
			$authors = nodeList_GetAuthors($node);

			// If you are authorized to edit
			if ( node_IsAuthor($node, $user_id) ) {
				$slug = coreSlugify_Name($node['name']);
				if ( in_array($slug, $SH_NAME_RESERVED) ) {
					json_EmitFatalError_BadRequest("Name is a reserved word", $RESPONSE);
				}
				
				$new_slug = node_GetUniqueSlugByParentSlug($node['parent'], $slug);
			
				if ( strlen($new_slug) < 3 ) {
					json_EmitFatalError_BadRequest("Name is too short (minumum 3 characters)", $RESPONSE);
				}
				
				$RESPONSE['edit'] = node_Edit(
					$node_id,
					$node['parent'], $node['author'], 
					$node['type'], $node['subtype'], $node['subsubtype'],
					$new_slug,
					$node['name'],
					$node['body'],
					"!PUBLISH");

				nodeCache_InvalidateById($node_id);
				
				$RESPONSE['publish'] = node_Publish(
					$node_id
				);
				
				if ( $RESPONSE['publish'] ) {
					$RESPONSE['path'] = node_GetPathById($node_id, 1)['path']; // Root node
				}
			}
			else {
				json_EmitFatalError_Permission(null, $RESPONSE);
			}
		}
		else {
			json_EmitFatalError_Permission(null, $RESPONSE);
		}
		break; //case 'publish': //node/publish

	case 'love': //node/love/...
		$old_action = $action;
		$action = json_ArgShift();
		switch ( $action ) {
			case 'get': //node/love/get/:node_id[]
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

			case 'add': //node/love/add/:node_id
				json_ValidateHTTPMethod('GET');
				
				if ( json_ArgCount() ) {
					$node_id = intval(json_ArgGet(0));
					
					if ( $node_id ) {
						// NOTE: You are allowed to LOVE anonymously (it's just not fetchable)
						$user_id = userAuth_GetID();

						if ( $node = node_GetById($node_id) ) {
							if ( in_array($node['type'], THINGS_I_CAN_LOVE) ) {
								$RESPONSE['id'] = nodeLove_AddByNode($node_id, $user_id);
								if ( $RESPONSE['id'] ) {
									nodeCache_InvalidateById($node_id);
								}
								
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

			case 'remove': //node/love/remove/:node_id
				json_ValidateHTTPMethod('GET');

				if ( json_ArgCount() ) {
					$node_id = intval(json_ArgGet(0));
					
					if ( $node_id ) {
						// NOTE: You are allowed to LOVE anonymously (it's just not fetchable)
						$user_id = userAuth_GetID();

						if ( $node = node_GetById($node_id) ) {
							if ( in_array($node['type'], THINGS_I_CAN_LOVE) ) {
								$RESPONSE['removed'] = nodeLove_RemoveByNode($node_id, $user_id);
								if ( $RESPONSE['removed'] ) {
									nodeCache_InvalidateById($node_id);
								}
								
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

	case 'star': //node/star/...
		$old_action = $action;
		$action = json_ArgShift();
		switch ( $action ) {
			case 'add': //node/star/add/:node_id
				json_ValidateHTTPMethod('GET');
				
				if ( json_ArgCount() ) {
					$node_id = intval(json_ArgGet(0));
					$user_id = userAuth_GetID();
					
					if ( $node_id && $user_id ) {
						if ( $node = node_GetById($node_id) ) {
							if ( in_array($node['type'], THINGS_I_CAN_STAR) ) {
								// TODO: Check if this exact value isn't the newest

								$RESPONSE['id'] = nodeLink_AddByNode($user_id, $node_id, SH_NODE_META_SHARED, 'star');
								if ( $RESPONSE['id'] ) {
									nodeCache_InvalidateById($node_id);
								}
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

			case 'remove': //node/star/remove/:node_id
				json_ValidateHTTPMethod('GET');

				if ( json_ArgCount() ) {
					$node_id = intval(json_ArgGet(0));
					$user_id = userAuth_GetID();
					
					if ( $node_id && $user_id ) {
						if ( $node = node_GetById($node_id) ) {
							if ( in_array($node['type'], THINGS_I_CAN_STAR) ) {
								// TODO: Check if this exact value isn't the newest
								
								$RESPONSE['id'] = nodeLink_RemoveByNode($user_id, $node_id, SH_NODE_META_SHARED, 'star');
								if ( $RESPONSE['id'] ) {
									nodeCache_InvalidateById($node_id);
								}
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

	case 'meta':
		$old_action = $action;
		$action = json_ArgShift();
		switch ( $action ) {
			case 'add': //node/meta/add/:node_id
			case 'remove': //node/meta/remove/:node_id
				json_ValidateHTTPMethod('POST');
				
				if ( !count($_POST) )
					json_EmitFatalError_BadRequest("No metadata set", $RESPONSE);

				$node_id = intval(json_ArgGet(0));
				$user_id = userAuth_GetID();

				if ( $node_id && $user_id ) {
					if ( $node = nodeComplete_GetById($node_id) ) {
						if ( !node_IsAuthor($node, $user_id) )
							json_EmitFatalError_Permission(null, $RESPONSE);

						if ( !isset(VALID_META[$node['type']]) )
							json_EmitFatalError_BadRequest("Can't set '".$node['type']."' metadata", $RESPONSE);
						
						// Validate that all posts are legal
						foreach ( $_POST as $key => &$value ) {
							if ( !isset(VALID_META[$node['type']][$key]) ) {
								json_EmitFatalError_BadRequest("Can't set '$key' metadata in '".$node['type']."'", $RESPONSE);
							}
						}
						
						// node, scope, key, value
						// bigint, tinyint, char32, text65535
						
						$scope = 0;
						$RESPONSE['changed'] = [];
						
						foreach ( $_POST as $key => &$value ) {
							$detail = VALID_META[$node['type']][$key];
							
							$v = $value;
							if ( isset($detail['length']))
								$v = substr($v, 0, $detail['length']);
							if ( isset($detail['empty']) && $detail['empty'] )
								$v = null;
							
							if ( $action == 'add' )
								$changed = nodeMeta_AddByNode($node_id, $scope, $key, $v);
							else if ( $action == 'remove' )
								$changed = nodeMeta_RemoveByNode($node_id, $scope, $key, $v);
							
							if ( $changed )
								$RESPONSE['changed'][$key] = $v;
						}
						if ( count($RESPONSE['changed']) ) {
							nodeCache_InvalidateById($node_id);
						}
					}
					else {
						json_EmitFatalError_NotFound(null, $RESPONSE);
					}
				}
				else {
					json_EmitFatalError_BadRequest(null, $RESPONSE);
				}
				break; // case 'add': //node/meta/add/:node
		};
		break; // case 'meta': //node/meta

	case 'link':
		$old_action = $action;
		$action = json_ArgShift();
		switch ( $action ) {
			case 'add': //node/link/add/:node_a/:node_b
			case 'remove': //node/link/remove/:node_a/:node_b
				json_ValidateHTTPMethod('POST');

				if ( !count($_POST) )
					json_EmitFatalError_BadRequest("No links set", $RESPONSE);
				
				$node_a_id = intval(json_ArgGet(0));
				$node_b_id = intval(json_ArgGet(1));
				$user_id = userAuth_GetID();

				if ( $node_a_id && $node_b_id && $user_id ) {
					$node_a = nodeComplete_GetById($node_a_id);
					$node_b = nodeComplete_GetById($node_b_id);
					if ( $node_a && $node_b ) {
						// Only an author of $node_a can change properties
						if ( !node_IsAuthor($node_a, $user_id) ) {
							json_EmitFatalError_Permission(null, $RESPONSE);
						}

						if ( !isset(VALID_LINK[$node_a['type']]) )
							json_EmitFatalError_BadRequest("Can't link '".$node_a['type']."'", $RESPONSE);

						if ( !isset(VALID_LINK[$node_a['type']][$node_b['type']]) )
							json_EmitFatalError_BadRequest("Can't link '".$node_a['type']."' to '".$node_b['type']."'", $RESPONSE);
						
						// Validate that all posts are legal
						foreach ( $_POST as $key => &$value ) {
							if ( !isset(VALID_LINK[$node_a['type']][$node_b['type']][$key]) ) {
								json_EmitFatalError_BadRequest("Can't create '$key' link between '".$node_a['type']."' and '".$node_b['type']."'", $RESPONSE);
							}
						}
						
						// a, b, scope, key, value
						// bigint, bigint, tinyint, char32, text65535
						
						$scope = 0;
						$RESPONSE['changed'] = [];
						
						foreach ( $_POST as $key => &$value ) {
							$detail = VALID_LINK[$node_a['type']][$node_b['type']][$key];
							
							$v = $value;
							if ( isset($detail['length']))
								$v = substr($v, 0, $detail['length']);
							if ( isset($detail['empty']) && $detail['empty'] )
								$v = null;
							
							if ( $action == 'add' )
								$changed = nodeLink_AddByNode($node_a_id, $node_b_id, $scope, $key, $v);
							else if ( $action == 'remove' )
								$changed = nodeLink_RemoveByNode($node_a_id, $node_b_id, $scope, $key, $v);
							
							if ( $changed )
								$RESPONSE['changed'][$key] = $v;
						}
						if ( count($RESPONSE['changed']) ) {
							nodeCache_InvalidateById($node_id);
						}

					}
					else {
						json_EmitFatalError_NotFound(null, $RESPONSE);
					}
				}
				else {
					json_EmitFatalError_BadRequest(null, $RESPONSE);
				}
				break; // case 'add': //node/meta/add/:node
		};
		break; // case 'meta': //node/meta
		
	default:
		json_EmitFatalError_Forbidden(null, $RESPONSE);
		break; // default
};

json_End();
