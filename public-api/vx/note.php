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
	
		break;
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
