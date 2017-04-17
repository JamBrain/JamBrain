<?php
require_once __DIR__."/../config.php";

include_once __DIR__."/".CONFIG_PATH."config.php";
require_once __DIR__."/".SHRUB_PATH."api.php";
require_once __DIR__."/".SHRUB_PATH."note/note.php";
require_once __DIR__."/".SHRUB_PATH."node/node.php";

json_Begin();

const CACHE_KEY_PREFIX = "SH!NOTE!";
const CACHE_TTL = 60;


// Do Actions
$action = json_ArgShift();
switch ( $action ) {
	case 'stats': //note/stats
		json_ValidateHTTPMethod('GET');
		//$event_id = intval(json_ArgGet(0));
		
		$RESPONSE['ham'] = "true";
			
		break; // case 'stats': //note/stats
	case 'get': //note/get
		json_ValidateHTTPMethod('GET');
		
		$ids = explode('+', json_ArgGet(0));
		
		if ( count($ids) !== 1 ) {
			json_EmitFatalError_BadRequest(null, $RESPONSE);
		}
	
		$RESPONSE['note'] = noteComplete_GetByNode($ids[0]);
	
		break; //case 'get': //note/get
	case 'add': //note/add
		json_ValidateHTTPMethod('POST');

		if ( $user_id = userAuth_GetID() ) {
			$node_id = intval(json_ArgShift());
			if ( empty($node_id) ) {
				json_EmitFatalError_BadRequest(null, $RESPONSE);
			}
			
			$author = $user_id;
			
			if ( !isset($_POST['parent']) )
				json_EmitFatalError_BadRequest("No parent", $RESPONSE);
			$parent = intval($_POST['parent']);
	
			if ( !isset($_POST['body']) )
				json_EmitFatalError_BadRequest("No body", $RESPONSE);
			$body = coreSanitize_Body(substr($_POST['body'], 0, 4096));
	
			$version_tag = "";
			if ( isset($_POST['tag']) )
				$version_tag = coreSlugify_Name($_POST['tag']);
			
			// Load Node
			$node = node_GetById($node_id);
			
			// Check if you have permission to add comment to node
			if ( note_IsNotePublicByNode($node) ) {
				// hack for now
				if ( $parent !== 0 )
					json_EmitFatalError_Permission("Temporary: No children", $RESPONSE);

				$RESPONSE['note'] = note_AddByNode($node['id'], $node['parent'], $author, $parent, $body, $version_tag);
			}
			else {
				json_EmitFatalError_Permission(null, $RESPONSE);
			}
		}
		else {
			json_EmitFatalError_Permission(null, $RESPONSE);
		}

		break; //case 'add': //note/add

	case 'update': //note/update
		json_ValidateHTTPMethod('POST');

		if ( $user_id = userAuth_GetID() ) {
			$note_id = intval(json_ArgShift());
			if ( empty($note_id) ) {
				json_EmitFatalError_BadRequest(null, $RESPONSE);
			}

			$author = $user_id;
			
			if ( !isset($_POST['node']) )
				json_EmitFatalError_BadRequest("No node", $RESPONSE);
			$node_id = intval($_POST['node']);
			if ( empty($node_id) ) {
				json_EmitFatalError_BadRequest(null, $RESPONSE);
			}
	
			if ( !isset($_POST['body']) )
				json_EmitFatalError_BadRequest("No body", $RESPONSE);
			$body = coreSanitize_Body(substr($_POST['body'], 0, 4096));
	
			$version_tag = "";
			if ( isset($_POST['tag']) )
				$version_tag = coreSlugify_Name($_POST['tag']);

			// Load Note
			$note = note_GetById($note_id);
			if ( $note['node'] !== $node_id )
				json_EmitFatalError_Permission("Invalid node", $RESPONSE);

			// Are bodies different?
			if ( $body !== $note['body'] ) {
				// Load Node
				$node = node_GetById($node_id);
				
				// Check if you have permission to add comment to node
				if ( note_IsNotePublicByNode($node) ) {
					$RESPONSE['updated'] = note_SafeEdit($note_id, $author, $body, $version_tag);
				}
				else {
					json_EmitFatalError_Permission(null, $RESPONSE);
				}
			}
			else {
				$RESPONSE['updated'] = 0;
				$RESPONSE['message'] = "No changes";
			}
		}
		else {
			json_EmitFatalError_Permission(null, $RESPONSE);
		}
		break; //case 'update': //note/update
		
/*
	case 'count': //note/count
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
			
			// Validate
//			$nodes = nodeCache_GetById($node_ids);
			
			
			
			$RESPONSE['comments'] = note_CountByNode($node_ids);
		}
		else {
			json_EmitFatalError_BadRequest(null, $RESPONSE);
		}
		break; // case 'count': //note/count
*/
	default:
		json_EmitFatalError_Forbidden(null, $RESPONSE);
		break; // default
};

json_End();
