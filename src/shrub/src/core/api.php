<?php
require_once __DIR__."/core.php";

/// @defgroup API
/// @brief API Framework - Accept a data structure describing API calls and dispatch the call appropriately.
/// @ingroup Core

/// @addtogroup API
/// @{

const API_GET = 		0x0001;
const API_POST = 		0x0002;
const API_AUTH = 		0x0004;


const API_CHARGE_0 = 	0;
const API_CHARGE_1 = 	1;

/// Handles an API request by dispatching it to the appropriate handler in the passed-in table.
/// The table contains the API name, flags declaring usage requirements, the rate limiting charge, and a function that will handle the API request.
/// Available flags are API_GET, API_POST, API_AUTH
/// 
/// 	api_Exec([
/// 		["/node/getmy", API_GET | API_AUTH, API_CHARGE_1, function() {
///				// Interact with $response or such
///			}],
///			... 
///		]);
/// 
/// @param List of API entries
/// @retval None
function api_Exec( $apidesc ) {

}

/// @}
