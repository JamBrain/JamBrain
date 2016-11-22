<?php
const CONFIG_PATH = "../../src/shrub/";
const SHRUB_PATH = "../../src/shrub/src/";

include_once __DIR__."/".CONFIG_PATH."config.php";
require_once __DIR__."/".SHRUB_PATH."api.php";
require_once __DIR__."/".SHRUB_PATH."node/node.php";

json_Begin();

// Do Actions //
switch ( $REQUEST[0] ) {
	case 'get':
		json_ValidateHTTPMethod('GET');
		
		// Extract requests
		if ( isset($REQUEST[1]) ) {
			$nodes = explode('+', $REQUEST[1]);

			// Sanitize
			foreach ( $nodes as &$node ) {
				$id = intval($node);
				
				if ( !$id ) {
					json_EmitFatalError_BadRequest("Bad ID", $RESPONSE);
				}
				
				$node = $id;
			}
			sort($nodes);

			// Limit number of nodes
			if ( count($nodes) > 20 ) {
				json_EmitFatalError_BadRequest("Too many nodes", $RESPONSE);
			}
			
			$out = node_GetById($nodes);
			
			$RESPONSE['node'] = $out;
		}
		else {
			json_EmitFatalError_BadRequest(null, $RESPONSE);
		}
		break;
	default:
		json_EmitFatalError_Forbidden(null,$RESPONSE);
		break;
};

json_End();