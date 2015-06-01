<?php
require_once __DIR__ . "/../../lib.php";
require_once __DIR__ . "/../../db.php";

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

$response = api_newResponse();

// Retrieve action //
$action = api_parseActionURL();

// If no item is set, exit
if ( !isset($action[1]) ) {
	api_emitJSON(api_newError());
	exit();
}

// Store Item
$response['item'] = intval($action[1]);

// If the item has an invalid Id, exit
if ( $response['item'] === 0 ) {
	api_emitJSON(api_newError());
	exit();
}

// Retrieve session, store UID
user_start();
$response['uid'] = user_getId();

// If not logged in, exit
if ( $response['uid'] === 0 ) {
	api_emitJSON(api_newError());
	exit();
}

// Table
$table_name = "cmw_star";

// On Add Action, insert in to the database
if ( $action[0] === 'add' ) {
	db_connect();
	
	db_query( 
		"INSERT IGNORE `" . $table_name . "` (".
			"`node`,".
			"`user`".
		") ".
		"VALUES (" .
			$response['item'] . "," .
			$response['uid'] .
		");");

	$response['success'] = empty(db_affectedRows()) ? false : true;
}
// On Remove Action, remove from the database
else if ( $action[0] === 'remove' ) {
	db_connect();

	db_query( 
		"DELETE FROM `" . $table_name . "` WHERE ".
			"`node`=" . $response['item'] . " AND " .
			"`user`=" . $response['uid'] .
		";");

	$response['success'] = empty(db_affectedRows()) ? false : true;
}

api_emitJSON($response);
?>
