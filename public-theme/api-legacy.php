<?php
require_once __DIR__."/../api.php";
require_once __DIR__."/../db.php";
require_once __DIR__."/../core/legacy_user.php";

// IMPORTANT: This Legacy API is intended for use with the legacy LD website. 
// *** This code will not work for you ***

$response = json_NewResponse();

// MAIN (Only accept POST requests) //
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action'])) {
	$action = trim($_POST['action']);

	if ( $action == "LOGOUT" ) {
		setcookie( "lusha", "", 0, "/", ".ludumdare.com" );
		$response['logout'] = 1;
	}
	else if ( $action == "GET_HASH" ) {
		// This is only available to whitelisted clients //
//		if (defined('IP_WHITELIST')) {
//			if ( core_OnWhitelist($_SERVER['REMOTE_ADDR'],IP_WHITELIST) ) {
{{				$id = intval($_POST['id']);
				if ( $id > 0 ) {
					$user = legacy_GetUser($id);
					// Not in Database yet
					if ( empty($user) ) {
						// Do handshake, confirm user exists //
						$result = legacy_FetchUserInfo($id);
						if ( !empty($result) ) {
							// Generate Hash //
							$user['hash'] = legacy_GenerateUserHash($id);
						}
					}
					
					if ( $user ) {
						$response['hash'] = $user['hash'];
					}
				}
			}
		}
	}
}

json_Emit($response);
