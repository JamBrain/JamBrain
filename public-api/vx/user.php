<?php
const CONFIG_PATH = "../../src/shrub/";
const SHRUB_PATH = "../../src/shrub/src/";

include_once __DIR__."/".CONFIG_PATH."config.php";
require_once __DIR__."/".SHRUB_PATH."api.php";
require_once __DIR__."/".SHRUB_PATH."plugin.php";
require_once __DIR__."/".SHRUB_PATH."user/user.php";

json_Begin();

const SH_MAIL_DOMAIN = "jammer.vg";
const SH_MAILER_RETURN = "error@".SH_MAIL_DOMAIN;

const SH_SITE = "Jammer";
const SH_MAILER = SH_SITE." <no-reply@".SH_MAIL_DOMAIN.">";
//const SH_DOMAIN = "ldjam.com";
define('SH_URL_SITE', isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : 'http://ludumdare.org');
//define('SH_URL_SITE', (isset($_SERVER['HTTPS']) ? "https://" : "http://").SH_DOMAIN);
const SH_ACTIVATE = "#user-activate";
const SH_ARGS = "alpha&";//"";

const CRLF = "\r\n";

const USERNAME_MIN_LENGTH = 3;
const PASSWORD_MIN_LENGTH = 8;

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
		"Here is your confirmation e-mail.",
		"",
		"The next step is to visit this link to create your account:",
		"",
		SH_URL_SITE."?".SH_ARGS."id=$id&key=$key".SH_ACTIVATE,
		"",
		"Confused?",
		"",
		"Someone signed up on ".SH_URL_SITE." using your e-mail address.",
		"",
		"If that wasn't you then oops! Feel free to ignore this e-mail."
	];
	
	return mail($mail, $subject, implode(CRLF, $message), implode(CRLF, $headers));
}

//Access-Control-Allow-Origin

// Do Actions //
switch ( $REQUEST[0] ) {
	// Create a new user activation attempt
	case 'create':
		json_ValidateHTTPMethod('POST');

		// Sanitize
		if ( isset($_POST['mail']) )
			$mail = coreSanitize_Mail($_POST['mail']);
		else
			json_EmitFatalError_BadRequest("'mail' not found in POST", $RESPONSE);
		
		$RESPONSE['mail'] = $mail;
		
		// Is the email provided even a valid e-mail address?
		if ( !coreValidate_Mail($mail) ) {
			json_EmitFatalError_BadRequest("Invalid e-mail address", $RESPONSE);
		}
		
		/// @todo Add e-mail blacklist checking here
		
		// Is the email provided one that is allowed to create a new account?
		if ( user_CountByMail($mail) || plugin_Call('api_user_create_mail_allowed', $mail) ) {
			json_EmitFatalError_Server("Address unavailable", $RESPONSE);
		}
		else {
			$user = user_Add($mail);
			if ( $user ) {
//				// NOTE! YOU SHOULD NOT DO THIS! IT DEFEATS THE EMAIL CHECK!
//				$RESPONSE['id'] = $user['id'];
//				$RESPONSE['key'] = $user['auth_key'];
				
				// Send an e-mail
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
			$id = coreSanitize_Integer($_POST['id']);
		else
			json_EmitFatalError_BadRequest("'id' not found in POST", $RESPONSE);

		if ( isset($_POST['key']) )
			$key = coreSanitize_String($_POST['key']);
		else
			json_EmitFatalError_BadRequest("'key' not found in POST", $RESPONSE);

		if ( isset($_POST['name']) )
			$name = coreSanitize_Name($_POST['name']);
		else
			$name = "";

		if ( isset($_POST['pw']) )
			$pw = coreSanitize_Password($_POST['pw']);
		else
			$pw = "";


		// Sorry, this is complicated
		// If Non-zero $id and non-empty $key value
		if ( $id && strlen($key) ) {
			$user = user_GetById($id);
			// Confirm lookup succedded, and user has an auth_key set (can get erased, for safety)
			if ( isset($user) && strlen($user['auth_key']) ) {
				// Check if keys match
				if ( $key == $user['auth_key'] ) {
					// Success. Remember that we successfully authenticated
					user_AuthTimeSetNow($id);
					
					// If Node is already non-zero, bail. Don't double activate!
					if ( $user['node'] ) {
						json_EmitFatalError_Server(null, $RESPONSE);
					}
					// Node is Zero. We can continue.
					else {
						// If no name and password are set, that's okay. Just bail.
						if ( !strlen($name) && !strlen($pw) ) {
							$RESPONSE['mail'] = $user['mail'];
							break;
						}
						
						// If name is too short
						if ( strlen($name) < USERNAME_MIN_LENGTH ) {
							json_EmitFatalError_Permission("Name is too short (minimum ".USERNAME_MIN_LENGTH.")", $RESPONSE);
						}
						
						$slug = coreSlugify_Name($name);

						// If the name and slug aren't the same length (they need to match)
						if ( strlen($name) !== strlen($slug) ) {
							json_EmitFatalError_BadRequest("Name must be alphanumeric, may contain '_', '.', or '-', but may not start or end with them", $RESPONSE);
						}

						// If password is too short
						if ( strlen($pw) < PASSWORD_MIN_LENGTH ) {
							json_EmitFatalError_Permission("Password is too short (minimum ".PASSWORD_MIN_LENGTH." characters)", $RESPONSE);
						}
							
						// Does that name already exist?
						if ( node_GetIdByParentAndSlug(SH_NODE_ID_USERS, $slug) ) {
							json_EmitFatalError_Server("Name ($slug) already exists", $RESPONSE);
						}
						else {
							/// @TODO Check if on the reserved list
							if ( false ) {
								/// @TODO Does this e-mail address match the one on the reserve list?
								if ( false ) {
									/// @TODO: Add
								}
								else {
									json_EmitFatalError_Server("Name is reserved. Is this you? Try using your original e-mail address instead", $RESPONSE);
								}
							}
							else {
								// @TODO wrap these so we can rollback
								$user_id = userNode_Add(
									$slug,
									$name
								);
								
								if ( $user_id ) {
									// @TODO wrap these so we can rollback
									
									if ( !user_SetNode($id, $user_id) ) {
										json_EmitFatalError_Server("Unable to set node", $RESPONSE);
									}
									if ( !user_SetHash($id, userPassword_Hash($pw)) ) {
										json_EmitFatalError_Server("Unable to set password", $RESPONSE);
									}
									if ( !user_AuthKeyClear($id) ) {
										json_EmitFatalError_Server("Unable to clear key", $RESPONSE);
									}
									
									// @TODO send confirmation e-mail
									
									// Successfully Created.
									json_RespondCreated();
								}
								else {
									json_EmitFatalError_Server("Unable to add node", $RESPONSE);
								}
							}
						}
					}
				}
				else {
					// Keys don't match. This may be an attempt to hijack the account, so destroy the key.
					if ( !user_AuthKeyClear($id) ) {
						json_EmitFatalError_Server("Unable to clear key", $RESPONSE);
					}
					
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
	case 'login':
		json_ValidateHTTPMethod('POST');

		$login = null;
		$pw = null;
		$secret = null;
	
		// Confirm Arguments
		if ( isset($_POST['login']) )
			$login = coreSanitize_String($_POST['login']);
		else
			json_EmitFatalError_BadRequest("'login' not found in POST", $RESPONSE);

		if ( isset($_POST['pw']) )
			$pw = coreSanitize_String($_POST['pw']);
		else
			json_EmitFatalError_BadRequest("'pw' not found in POST", $RESPONSE);

		if ( isset($_POST['secret']) ) {
			$secret = coreSanitize_String($_POST['secret']);
		}

		// Bail if empty
		if ( empty($login) || empty($pw) ) {
			json_EmitFatalError_Permission(null, $RESPONSE);
		}
		
		$name = null;
		$mail = null;
		$user = null;
		
		// Decode the login as either an e-mail address, or a username
		if ( coreValidate_Mail($login) ) {
			$mail = coreSanitize_Mail($login);
		}
		else {
			$name = coreSlugify_Name($login);
		}
		
		// If an e-mail login attempt
		if ( $mail ) {
			$user = user_GetByMail( $mail );
		}
		// If a username login attempt
		else if ( $name ) {
			// lookup user by slug
			// lookup all addresses associated with that user
			// extract node, hash, and secret
		}
		
		// Bail if no user was found, or if their node is zero (not associated with an account)
		if ( !isset($user) || !($user['node'] > 0) ) {
			json_EmitFatalError_Permission(null, $RESPONSE);
		}
				
		// If hashes match, it's a success, so log the user in
		if ( isset($user['hash']) && userPassword_Verify($pw, $user['hash']) ) {
			// Does the user have a secret?
			
			
			// Success
			$RESPONSE['id'] = $user['node'];
			
			userSession_Start();
			$_SESSION['id'] = $user['node'];
			$_SESSION['ip'] = $_SERVER['REMOTE_ADDR'];
			userSession_End();
			
			break;
		}

		// Permission denied on fail
		json_EmitFatalError_Permission(null, $RESPONSE);
	
		break;
	case 'logout':
	
		break;
		
	case 'get':
		json_ValidateHTTPMethod('GET');
		
		$id = isset($_SESSION['id']) ? intval($_SESSION['id']) : 0;
		$RESPONSE['id'] = $id;
		
		if ( $id > 0 ) {
			$RESPONSE['node'] = node_GetById($id);
		}
//		$RESPONSE['server'] = $_SERVER;
//		$RESPONSE['method'] = $_SERVER['REQUEST_METHOD'];
//		$RESPONSE['post'] = $_POST;
//		
////
////		if ( user_AuthIsAdmin() ) {
////			$RESPONSE['global'] = $SH;
////		}
////		else {
////			json_EmitFatalError_Permission(null, $RESPONSE);
////		}
		
		break;
	default:
		json_EmitFatalError_Forbidden(null, $RESPONSE);
		break;
};

json_End();
