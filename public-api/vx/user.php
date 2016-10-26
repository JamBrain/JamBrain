<?php
const CONFIG_PATH = "../../src/shrub/";
const SHRUB_PATH = "../../src/shrub/src/";

include_once __DIR__."/".CONFIG_PATH."config.php";
require_once __DIR__."/".SHRUB_PATH."api.php";
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
	case 'create':
		json_ValidateHTTPMethod('POST');

		if ( isset($_POST['mail']) ) {
			$mail = filter_var($_POST['mail'], FILTER_SANITIZE_EMAIL);
		}
		else {
			json_EmitFatalError_BadRequest("'mail' not found in POST", $RESPONSE);
		}
		
		$RESPONSE['mail'] = $mail;
		
		if ( !filter_var($mail, FILTER_VALIDATE_EMAIL) ) {
			json_EmitFatalError_BadRequest("Bad e-mail address", $RESPONSE);
		}
		
		// If you find a match, fail to create //
		if ( user_CountByMail($mail) ) {
			json_EmitFatalError_Server("Unavailable", $RESPONSE);
		}
		else {
			$user = user_Add($mail);
			if ( $user ) {
				sendMail_UserAdd($user['id'], $mail, $user['auth_key']);
				
				$RESPONSE['user'] = $user;
				json_RespondCreated();
			}
			else {
				json_EmitFatalError_Server(null, $RESPONSE);
			}
		}

		break;
	case 'activate':
		json_ValidateHTTPMethod('POST');

		

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
