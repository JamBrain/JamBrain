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


// Retrieve session
user_start();
$uid = user_getId();

$response = [];

// If not logged in, exit
if ( $uid === 0 ) {
	api_emitJSON($response);
	exit();
}

if ( isset($_GET['add']) ) {
	// Connect to database
	db_connect();
	$response['uid'] = $uid;

	// if action == add
	//    add/overwrite the star for id,user
	//    return success/failure
	
	$success = true;

	$response['add'] = $success;
}
else if ( isset($_GET['remove']) ) {
	// Connect to database
	db_connect();
	$response['uid'] = $uid;

	// if action == remove
	//    remove star for id,user
	//    return success/failure

	$success = true;

	$response['remove'] = $success;
}

api_emitJSON($response);
?>
