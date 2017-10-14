<?php
require_once __DIR__."/../config.php";

include_once __DIR__."/".CONFIG_PATH."config.php";
require_once __DIR__."/".SHRUB_PATH."api.php";
require_once __DIR__."/".SHRUB_PATH."node/node.php";

json_Begin();

// Do Actions
$action = json_ArgShift();
switch ( $action ) {
	case 'get': //randomgames/get[/compo|jam]
		json_ValidateHTTPMethod('GET');	
		$filter = null;
		if ( json_ArgCount() > 0 ) {
			$filter = json_ArgShift();
		}
		
		$count = 5;
		if ( isset($_GET['count']) )
			$count = intval($_GET['count']);
		
		
		// Future: Rate limiting so users / ips cannot easily collect enough data from this call to produce statistically significant conclusions about which games are ahead.
		
		
		// If there is a user id, find the user's games and exclude them
		$excludegames = [];
		if ( $user_id = userAuth_GetID() ) {		
			$userauthoredlinks = nodeLink_GetByKeyNode("author", $user_id);
			foreach( $userauthoredlinks as $authorlink ) {
				// This will only go one way, but guard anyway.
				if ( $authorlink['b'] == $user_id ) { $excludegames[] = $authorlink['a']; }
			}
		}
		

		$gamelist = nodeRandomGames_GetGames($count, $excludegames, $filter);
		
		$RESPONSE['votingenabled'] = ($gamelist != null); 
		$RESPONSE['games'] = ($gamelist != null) ? $gamelist : []; 

		break; //case 'get': //randomgames/get[/compo|jam]

	default:
		json_EmitFatalError_Forbidden(null, $RESPONSE);
		break; // default
};

json_End();
