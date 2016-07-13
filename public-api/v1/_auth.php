<?php
require_once __DIR__."/../../api.php"; 	// Included by action.php

if ( basename(__FILE__) == basename($_SERVER["SCRIPT_FILENAME"]) ) {
	json_EmitError();
}


function auth_CookieEncode($user) {
//	$ret = 
}


/**
 * @api {POST} /login Log user in, set cookie
 * @apiName Loginooo
 * @apiGroup Login
 * @apiPermission Everyone
 * @apiVersion 0.1.0
 *
 * @apiParam {String} l Login (e-mail address or user name).
 * @apiParam {String} p Unhashed password.
 * @apiParam {String} [tf] Optional two-factor authentication key for this moment.
 *
 * @apiSuccess {String} id Id of the user successfully authenticated.
 * @apiSuccess (HTTP Cookies) {String} cmwauth Authentication cookie.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     Set-Cookie: cmwauth=some_authentication_key;
 *     {
 *       "id": 1234
 *     }
*/
/* For reference
 *
 * @apiError UserNotFound The User was not found.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "UserNotFound"
 *     }
*/
function auth_Login($args) {
	$response = [];
	$user_auth = [];
		
	// Get login, password and two-factor key (if set) //
	if ( isset($_POST['l']) && isset($_POST['p']) ) {
		$user_auth['login'] = trim($_POST['l']);
		$user_auth['password'] = trim($_POST['p']);
		$user_auth['twofactor'] = "";
		
		if ( isset($_POST['tf']) ) {
			$user_auth['twofactor'] = trim($_POST['tf']);
		}
		
		//$response['post'] = $_POST;
	}
	else {
		json_EmitError();
	}
	
	
	
//	$cookie_str = auth_CookieEncode($user_auth);
//	
//	$response['cookie'] = $cookie_str;
		
	json_Emit($response);
}

/**
 * @api {POST} /logout Log user out, remove cookie
 * @apiName Logout
 * @apiGroup Logout
 * @apiPermission Everyone
 * @apiVersion 0.1.0
 *
 * @apiSuccess {String} id Id of the user successfully logged out.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     Set-Cookie: cmwauth=; expires=Thu, 01 Jan 1970 00:00:00 GMT
 *     {
 *       "id": 1234
 *     }
*/
function auth_Logout($args) {
	json_Emit(["id" => 0]);
}

function auth_Register($args) {
	json_Emit(["register" => 0]);
}

function auth_VerifyEmail($args) {
	json_Emit(["verify-email" => 0]);
}

