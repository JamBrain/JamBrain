<?php
const CONFIG_PATH = "../../src/shrub/";
const SHRUB_PATH = "../../src/shrub/src/";

include_once __DIR__."/".CONFIG_PATH."config.php";
require_once __DIR__."/".SHRUB_PATH."api.php";
require_once __DIR__."/".SHRUB_PATH."node/node.php";

json_Begin();

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

						// TODO: Check if node exists
						
						$RESPONSE['id'] = nodeLove_AddByNode($node_id, $user_id);
						
						$RESPONSE['love'] = nodeLove_GetByNode($node_id);
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

						// TODO: Check if node exists
						
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

	default:
		json_EmitFatalError_Forbidden(null, $RESPONSE);
		break; // default
};

json_End();
