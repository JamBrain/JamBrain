<?php
require_once __DIR__."/../config.php";

include_once __DIR__."/".CONFIG_PATH."config.php";
require_once __DIR__."/".SHRUB_PATH."api.php";

json_Begin();

// Do Actions
$action = json_ArgShift();
switch ( $action ) {
	case 'get': //feature/get
		json_ValidateHTTPMethod('GET');
		
		$root = nodeCache_GetById(1);
		
		if ( isset($root['meta']) && isset($root['meta']['featured']) ) {
			$featured = nodeCache_GetById(intval($root['meta']['featured']));
			
			//$RESPONSE['no'] = $featured;
			$RESPONSE['id'] = $featured['id'];
			$RESPONSE['slug'] = $featured['slug'];
			$RESPONSE['name'] = $featured['name'];
			$RESPONSE['path'] = $featured['path'];
			
			if ( isset($featured['meta']['theme-mode']) ) {
				$mode = intval($featured['meta']['theme-mode']);
				if ( $mode == 0 ) {
					$RESPONSE['state'] = "Inactive";
				}
				else if ( $mode == 1 ) {
					$RESPONSE['state'] = "Theme Suggestions";
				}
				else if ( $mode == 2 ) {
					$RESPONSE['state'] = "Theme Slaughter";
				}
				else if ( $mode == 3 ) {
					$RESPONSE['state'] = "Theme Fusion";
				}
				else if ( $mode == 4 ) {
					$RESPONSE['state'] = "Theme Voting";
				}
			}
		}
		else {
			$RESPONSE['state'] = "No active event";
		}

		break; //case 'get': //feature/get

	default:
		json_EmitFatalError_Forbidden(null, $RESPONSE);
		break; // default
};

json_End();
