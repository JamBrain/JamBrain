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

// Retrieve session, store UID
user_start();
$response['uid'] = user_getId();

// Retrieve Action and Arguments
$arg = api_parseActionURL();
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
		api_emitErrorAndExit(); 
	}
}
else if ( $arg_count === 1 ) {
	if ( $action === 'uid' ) {
		$response['uid'] = intval($arg[0]);
	}
	else if ( $action === 'remove' || $action === 'uid' ) {
		$response['item'] = intval($arg[0]);
	}
	else if ( $action === 'me' ) {
		$offset = intval($arg[0]);
	}
	else { 
		api_emitErrorAndExit(); 
	}
}
else if ( $arg_count === 2 ) {
	if ( $action === 'uid' ) {
		$response['uid'] = intval($arg[0]);
		$offset = intval($arg[1]);
	}
	else { 
		api_emitErrorAndExit(); 
	}
}
else {
	api_emitErrorAndExit();
}


// If no UID specified, exit
if ( $response['uid'] === 0 ) {
	api_emitErrorAndExit();
}


// Table
$table_name = "cmw_star";

// On 'add' Action, insert in to the database
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
// On 'remove' Action, remove from the database
else if ( $action === 'remove' ) {
	db_connect();

	db_query( 
		"DELETE FROM `" . $table_name . "` WHERE ".
			"`node`=" . $response['item'] . " AND " .
			"`user`=" . $response['uid'] .
		";");

	$response['success'] = empty(db_affectedRows()) ? false : true;
}
// On 'uid' or 'me' Action, get a list of favourites 
else if ( $action === 'me' || $action === 'uid' ) {
	db_connect();

	$response['result'] = db_fetchSingle( 
		"SELECT `node` FROM `" . $table_name . "` WHERE ".
			"`user`=" . $response['uid'] . " " .
		"LIMIT " . $limit . " OFFSET " . $offset . ";");

	$response['success'] = true;	
}
else {
	api_emitErrorAndExit();
}

api_emitJSON($response);
?>
