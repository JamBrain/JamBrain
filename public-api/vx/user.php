<?php
const CONFIG_PATH = "../../src/shrub/";
const SHRUB_PATH = "../../src/shrub/src/";

include_once __DIR__."/".CONFIG_PATH."config.php";
require_once __DIR__."/".SHRUB_PATH."api.php";
require_once __DIR__."/".SHRUB_PATH."plugin.php";
require_once __DIR__."/".SHRUB_PATH."user/user.php";

json_Begin();

const SH_MAILER_RETURN = "error@jammer.vg";

const SH_MAILER = "Jammer <no-reply@jammer.vg>";
const SH_SITE = "Jammer";
const SH_DOMAIN = "ldjam.com";
const SH_URL_SITE = "https://".SH_DOMAIN;
const SH_URL_ACTIVATE = "https://".SH_DOMAIN."/#user-activate";

const CRLF = "\r\n";

function sendMail_UserAdd( $id, $mail, $key ) {
	$subject = "[".SH_SITE."] Confirming your e-mail address";
	$headers = [
		"MIME-Version: 1.0",
		"Content-type: text/plain; charset=iso-8859-1",
		"From: ".SH_MAILER,
//		"Reply-To: ".SH_MAILER,
//		"Return-Path: ".SH_MAILER_RETURN,
	];
	$message = [
		"Hello!",
		"",
		"This is a confirmation e-mail for you! Hooray!!",
		"",
		"Your next step is to visit this link, and create your ".SH_SITE." account:",
		"",
		SH_URL_ACTIVATE."?id=$id&key=$key",
		"",
		"Confused? Someone entered your e-mail address here:",
		"",
		SH_URL_SITE,
		"",
		"If that wasn't you then oops! Sorry! Someone made a mistake."
	];
	
	return mail($mail, $subject, implode(CRLF, $message), implode(CRLF, $headers));
}

// Do Actions //
switch ( $REQUEST[0] ) {
	// Create a new user activation attempt
	case 'create':
		json_ValidateHTTPMethod('POST');

		if ( isset($_POST['mail']) )
			$mail = filter_var(trim($_POST['mail']), FILTER_SANITIZE_EMAIL);
		else
			json_EmitFatalError_BadRequest("'mail' not found in POST", $RESPONSE);
		
		$RESPONSE['mail'] = $mail;
		
		if ( !filter_var($mail, FILTER_VALIDATE_EMAIL) ) {
			json_EmitFatalError_BadRequest("Bad e-mail address", $RESPONSE);
		}
		
		if ( user_CountByMail($mail) ) {
			json_EmitFatalError_Server("Unavailable", $RESPONSE);
		}
		else {
			$user = user_Add($mail);
			if ( $user ) {
				$RESPONSE['id'] = $user['id'];
				$RESPONSE['key'] = $user['auth_key'];
				$RESPONSE['sent'] = intval(sendMail_UserAdd($user['id'], $mail, $user['auth_key']));
				
				// Successfully Created.
				json_RespondCreated();
			}
			else {
				json_EmitFatalError_Server(null, $RESPONSE);
			}
		}

		break;
	// Fully activate a user
	case 'activate':
		json_ValidateHTTPMethod('POST');

		if ( isset($_POST['id']) )
			$id = intval(trim($_POST['id']));
		else
			json_EmitFatalError_BadRequest("'id' not found in POST", $RESPONSE);

		if ( isset($_POST['key']) )
			$key = filter_var(trim($_POST['key']), FILTER_SANITIZE_STRING);
		else
			json_EmitFatalError_BadRequest("'key' not found in POST", $RESPONSE);

		// @todo sanitize username
		if ( isset($_POST['name']) )
			$name = filter_var(trim($_POST['name']), FILTER_SANITIZE_STRING);
		else
			$name = "";

		// @todo sanitize password
		if ( isset($_POST['pw']) )
			$pw = filter_var(trim($_POST['pw']), FILTER_SANITIZE_STRING);
		else
			$pw = "";


		if ( $id && strlen($key) ) {
			$user = user_GetById($id);
			// Confirm lookup succedded, and user has a non-empty auth_key (auto 
			if ( isset($user) && strlen($user['auth_key']) ) {
				if ( $key == $user['auth_key'] ) {
					/// @todo Success! Set last_auth to NOW()
					
					// If Node is already non-zero, bail. Don't double activate!
					if ( $user['node'] ) {
						json_EmitFatalError_Server(null, $RESPONSE);
					}
					// Node is Zero. We can continue.
					else {
						// If name is too short, that's okay. Just bail.
						if ( strlen($name) < 3 ) {
							$RESPONSE['message'] = "Name is too short (minimum 3)";
							break;
						}

						// If password is too short, that's okay. Just bail.
						if ( strlen($pw) < 8 ) {
							$RESPONSE['message'] = "Password is too short (minimum 8)";
							break;
						}
						
						// @todo Continue! Now we need to confirm the name is available.

//						// Successfully Created.
//						json_RespondCreated();
					}
				}
				else {
					/// @todo Erase auth key (an attempt was made to authenticate with an incorrect key)
					
					json_EmitFatalError_Permission(null, $RESPONSE);
				}
			}
			else {
				json_EmitFatalError_Permission(null, $RESPONSE);
			}
		}
		else {
			json_EmitFatalError_BadRequest(null, $RESPONSE);
		}

		break;
	case 'get':
		json_ValidateHTTPMethod('GET');
		
		$RESPONSE['user'] = user_GetByNode(0);
		
//
//		if ( user_AuthIsAdmin() ) {
//			$RESPONSE['global'] = $SH;
//		}
//		else {
//			json_EmitFatalError_Permission(null, $RESPONSE);
//		}
		break;
	default:
		json_EmitFatalError_Forbidden(null, $RESPONSE);
		break;
};

json_End();
