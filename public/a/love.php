<?php
require_once __DIR__ . "/../../api.php";
require_once __DIR__ . "/../../core/love.php";

// Love is Likes. If you like something, you give it a Love.
// Love either belongs to to a user, or an IP address (to allow more love).

// By design, all UIDs can give a Love an item, or if not logged in (UID=0), 1 per IP.

// Potential Exploits:
// - Multiple User Accounts
// - 2 Love (1 Love logged in, 1 Love logged out)

// The "2 Love" exploit can be avoided by setting the minimum Love that has an effect >2.
// The "Multiple Accounts" exploit is not easily avoided. One solution may be to introduce a 
//   "unique PC" cookie, but that can still be exploited with multiple devices or incogneto mode.
// There is value in giving an item a lot of Love, but what's equally important is keeping this
//   script extremely light-weight. 
// With some effort, it would possible to strengthen the impact of certain user accounts (i.e.
//   users that have participated, or that are well Loved themselves). So when it comes to scoring
//   things, the point value isn't 1:1 Love, but the sum of a number of factors including Love.
//   This will be called "Magic".
// To be clear: Scoring here is a sorting score, not a rating. It's how we decide to prioritize.

// TODO: Limit access to certain data to user level

$response = api_NewResponse();

// Retrieve session, store UID
user_StartSession();
$response['uid'] = user_GetId();

// Store IP if no UID set (That way, we don't store uniques if you change IPs)
if ( $response['uid'] === 0 ) {
	$response['ip'] = $_SERVER['REMOTE_ADDR'];
}
else {
	$response['ip'] = "0.0.0.0";
}

// Retrieve Action and Arguments
$arg = api_ParseActionURL();
$action = array_shift($arg);
$arg_count = count($arg);

$offset = 0;
$limit = 50;

// Confirm we have enough arguments
if ( $arg_count === 0 ) {
	if ( $action === 'me' ) {
		// do nothing //
	}
	else { 
		api_EmitErrorAndExit(); 
	}
}
else if ( $arg_count === 1 ) {
	if ( $action === 'uid' ) {
		$response['uid'] = intval($arg[0]);
		
		// Even though this will work, UID=0 should be an error
		if ( $response['uid'] === 0 ) {
			api_EmitErrorAndExit();
		}
	}
	else if ( $action === 'ip' ) {
		if ( filter_var($arg[0],FILTER_VALIDATE_IP) ) {
			$response['ip'] = $arg[0];
			$response['uid'] = 0;
			
			// Even though this will work, IP=0.0.0.0 should be an error
			if ( ip2long($response['ip']) === 0 ) {
				api_EmitErrorAndExit();
			}
		}
		else {
			api_EmitErrorAndExit();
		}
	}
	else if ( $action === 'me' ) {
		$offset = abs(intval($arg[0]));
	}
	else if ( $action === 'add' || $action === 'remove' ) {
		$response['item'] = intval($arg[0]);
		
		if ( $response['item'] === 0 ) {
			api_EmitErrorAndExit();
		}
	}
	else { 
		api_EmitErrorAndExit(); 
	}
}
else if ( $arg_count === 2 ) {
	if ( $action === 'uid' ) {
		$response['uid'] = intval($arg[0]);
		$offset = abs(intval($arg[1]));

		// Even though this will work, UID=0 should be an error
		if ( $response['uid'] === 0 ) {
			api_EmitErrorAndExit();
		}
	}
	else if ( $action === 'ip' ) {
		if ( filter_var($arg[0],FILTER_VALIDATE_IP) ) {
			$response['ip'] = $arg[0];
			$response['uid'] = 0;
			$offset = abs(intval($arg[1]));

			// Even though this will work, IP=0.0.0.0 should be an error
			if ( ip2long($response['ip']) === 0 ) {
				api_EmitErrorAndExit();
			}
		}
		else {
			api_EmitErrorAndExit();
		}
	}
	else { 
		api_EmitErrorAndExit();
	}
}
else {
	api_EmitErrorAndExit();
}


// On 'add' Action, insert in to the database
if ( $action === 'add' ) {
	$response['success'] = love_Add($response['item'],$response['uid'],$response['ip']);
}
// On 'remove' Action, remove from the database
else if ( $action === 'remove' ) {
	$response['success'] = love_Remove($response['item'],$response['uid'],$response['ip']);
}
else if ( $action === 'me' || $action === 'uid' || $action === 'ip' ) {
	$response['result'] = love_Fetch( $response['uid'], $response['ip'], $offset, $limit );
}
else {
	api_EmitErrorAndExit();
}

// Result optimization: Remove UID or IP if zero.
if ( $response['uid'] === 0 ) {
	unset($response['uid']);
}
else {
	unset($response['ip']);
}

// Done. Output the response.
api_EmitJSON($response);
?>
