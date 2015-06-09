<?php
/**	@file
*	@brief Internal AJAX API for managing Star's (Favourites)
**/

require_once __DIR__ . "/../../api.php";
require_once __DIR__ . "/../../core/star.php";
require_once __DIR__ . "/../../core/user.php";

// Stars are Favourites or Bookmarks. If you want to remember/save something, you Star it.
// Stars belong only to users (UID>0). You cannot Star if you are not logged in.

// Potential Exploits:
// - Multiple User Accounts

// Unlike Love, Stars will be more dynamic. Users will favourite (bookmark) things they want
//   to see later, and unfavourite once they finish. This wont be true for all users, but
//   I just want to point out it is something we will see that we wont see as much in Love.
// Speaking of "Magic", in the early days of scoring, it may be worth considering making 
//   Stars worth 2 or 3 points, and Love worth 1 point. This doesn't solve the Multiple Account
//   exploit, but it ensure that opinions of users are worth more than anyonymous people.
// To be clear: Scoring here is a sorting score, not a rating. It's how we decide to prioritize.

// TODO: Limit access to certain data to user level

$response = json_NewResponse();

// Retrieve session, store UID
user_StartSession();
$response['uid'] = user_GetId();

// Retrieve Action and Arguments
$arg = util_ParseActionURL();
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
		json_EmitError(); 
	}
}
else if ( $arg_count === 1 ) {
	if ( $action === 'uid' ) {
		$response['uid'] = intval($arg[0]);
	}
	else if ( $action === 'me' ) {
		$offset = abs(intval($arg[0]));
	}
	else if ( $action === 'add' || $action === 'remove' ) {
		$response['item'] = intval($arg[0]);
		
		if ( $response['item'] === 0 ) {
			json_EmitError(); 
		}
	}
	else { 
		json_EmitError(); 
	}
}
else if ( $arg_count === 2 ) {
	if ( $action === 'uid' ) {
		$response['uid'] = intval($arg[0]);
		$offset = abs(intval($arg[1]));
	}
	else { 
		json_EmitError(); 
	}
}
else {
	json_EmitError();
}


// If no UID specified, exit
if ( $response['uid'] === 0 ) {
	json_EmitError();
}


// On 'add' Action, insert in to the database
/**
 * @api {GET} /a/star/add/:nodeid /a/star/add
 * @apiName AddStar
 * @apiGroup Star
 * @apiPermission Member
 * @apiVersion 0.1.0
*/
if ( $action === 'add' ) {
	$response['success'] = star_Add($response['item'],$response['uid']);
}
// On 'remove' Action, remove from the database
/**
 * @api {GET} /a/star/remove/:nodeid /a/star/remove
 * @apiName RemoveStar
 * @apiGroup Star
 * @apiPermission Member
 * @apiVersion 0.1.0
*/
else if ( $action === 'remove' ) {
	$response['success'] = star_Remove($response['item'],$response['uid']);
}
// On 'uid' or 'me' Action, get a list of favourites 
/**
 * @api {GET} /a/star/me[/:offset] /a/star/me
 * @apiName MyStars
 * @apiGroup Star
 * @apiPermission Member
 * @apiVersion 0.1.0
*/
/**
 * @api {GET} /a/star/uid/:userid[/:offset] /a/star/uid
 * @apiName UserStars
 * @apiGroup Star
 * @apiPermission Everyone
 * @apiVersion 0.1.0
*/
else if ( $action === 'me' || $action === 'uid' ) {
	$response['result'] = star_Fetch( $response['uid'], $offset, $limit );
}
else {
	json_EmitError();
}

// Done. Output the response.
json_Emit($response);
?>
