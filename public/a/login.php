<?php
require_once __DIR__ . "/../../lib.php";

user_start();		// Retrieve Session //

$uid = user_getId();

// Check the APCU cache if access attempts for this IP address is > 5, deny access.

// On failure, increase the access attempt (APCU). Timeout in 5 minutes. Log attempt.


if ( $uid === 0 ) {
	// Do something? //
}

// Get e-mail and password from $_POST //

// Search user_table for a matching e-mail //

// if none found, fail

// if found, verify password against the stored hash.

//if ( user_verifyPassword($password,$hash) ) {
	// Password Success //
//	user_setId( $that_user_id );
//}
//else {
	// Password Failed //
//}


// ** Successfully Logged in ** //
// Retrieve my info //

// Retrieve my list of Favourites, and a list of most recent posts I've loved. //

api_emitJSON($response);
?>
