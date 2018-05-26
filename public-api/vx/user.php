<?php
require_once __DIR__."/../config.php";

include_once __DIR__."/".CONFIG_PATH."config.php";
require_once __DIR__."/".SHRUB_PATH."api.php";
require_once __DIR__."/".SHRUB_PATH."plugin.php";
require_once __DIR__."/".SHRUB_PATH."user/user.php";

json_Begin();

// *** Some older notes. Remove these *** //

// NOTE: Confirming an e-mail address BEFORE entering account credentials is BEST!
// This avoids the problem where you enter the wrong e-mail address as you sign up sign up.

// Create an account
//  if $mail doesn't exist
//   mail = blah@blah.com
//   node = 0
//   created = NOW()
//   auth_key = RANDOM_BYTES
//   last_auth = 0:00:00
//   do( email_Send( mail, auth_key, $redirect_url )
//
// website.com/#user-activate?id=5862&key=aeo8du8aodu8
// api.website.com/vx/user/activate [id=5862&key=aeo8du8aodu8]

// Activate an account (and partially activate an account)
//  lookup $id by id (not node)
//  does $key match?
//   no: erase auth_key, stop
//   yes: set last_auth to NOW()
//   is node 0? ***
//    no: stop
//    yes:
//    is $name set and strlen() >= 3
//     is $pw set and strlen() >= 8
//      yes:
//      is node $user available
//       yes:
//       is on reserved list
//        no: hash($pw) to hash, create a node named $user, erase auth_key
//        yes:
//        does $mail match?
//         yes: hash($pw) to hash, create a node named $user, erase auth_key
//
// api.website.com/vx/user/activate [id=5862&key=aeo8du8aodu8&name=homeboy&pw=potatoes]

// *** //

const SH_MAIL_DOMAIN = "jammer.vg";
const SH_MAILER_RETURN = "hello@".SH_MAIL_DOMAIN;

const SH_SITE = "Jammer";
const SH_MAILER = SH_SITE." <hello@".SH_MAIL_DOMAIN.">";
//const SH_DOMAIN = "ldjam.com";
define('SH_URL_SITE', isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : 'http://ludumdare.org');
//define('SH_URL_SITE', (isset($_SERVER['HTTPS']) ? "https://" : "http://").SH_DOMAIN);
const SH_ACTIVATE = "#user-activate";
const SH_PASSWORD = "#user-password";
const SH_ARGS = "";//"alpha&";//"";

const CRLF = "\r\n";

const USERNAME_MIN_LENGTH = 3;
const PASSWORD_MIN_LENGTH = 8;

function mailGen_Subject( $subject ) {
	return "[".SH_SITE."] ".$subject;
}
function mailGen_Headers() {
	return [
		"MIME-Version: 1.0",
		"Content-type: text/plain; charset=iso-8859-1",
		"From: ".SH_MAILER,
//		"Reply-To: ".SH_MAILER_RETURN,
//		"Return-Path: ".SH_MAILER_RETURN,
	];
}

function mailSend_Now( $mail, $subject, $message ) {
	$headers = mailGen_Headers();
	return mail($mail, $subject, implode(CRLF, $message), implode(CRLF, $headers), '-f '.SH_MAILER_RETURN);
}


function mailSend_UserAdd( $mail, $id, $key ) {
	$subject = mailGen_Subject("Confirming your e-mail address");
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
		"If that wasn't you then oops! Feel free to ignore this e-mail.",
		""
	];

	return mailSend_Now($mail, $subject, $message);
}

function mailSend_UserCreate( $mail, $slug ) {
	$subject = mailGen_Subject("Account created");
	$message = [
		"Your account \"$slug\" has been created!",
		"",
		"You can now log in on: ".SH_URL_SITE,
		""
	];

	return mailSend_Now($mail, $subject, $message);
}

function mailSend_UserPasswordReset( $mail, $slug, $id, $key ) {
	$subject = mailGen_Subject("Reset password");
	$message = [
		"Someone has requested a password reset for your account \"$slug\".",
		"",
		"Click the following link to change your password:",
		"",
		SH_URL_SITE."?".SH_ARGS."id=$id&key=$key".SH_PASSWORD,
		"",
		"If you do not wish to reset your password, or it was sent in error, then feel free to ignore this email.",
		""
	];

	return mailSend_Now($mail, $subject, $message);
}


function getSanitizedMailFromPost( $optional = false ) {
	global $RESPONSE;
	$mail = null;
	if ( isset($_POST['mail']) ) {
		$mail = coreSanitize_Mail($_POST['mail']);

		if ( $mail !== $_POST['mail'] ) {
			json_EmitFatalError_BadRequest("E-mail contains invalid characters", $RESPONSE);
		}
		if ( strlen($mail) > 254 ) {
			json_EmitFatalError_BadRequest("E-mail too long", $RESPONSE);
		}

		// Is the email provided even a valid e-mail address?
		if ( !coreValidate_Mail($mail) ) {
			json_EmitFatalError_BadRequest("Invalid e-mail address", $RESPONSE);
		}
	}
	else {
		if ( !$optional )
			json_EmitFatalError_BadRequest("'mail' not found in POST", $RESPONSE);
		$mail = "";
	}
	return $mail;
}


// User ID (not Node ID)
function getSanitizedIdFromPost( $optional = false ) {
	global $RESPONSE;
	$id = null;
	if ( isset($_POST['id']) ) {
		$id = coreSanitize_Integer($_POST['id']);
	}
	else {
		if ( !$optional )
			json_EmitFatalError_BadRequest("'id' not found in POST", $RESPONSE);
		$id = 0;
	}
	return $id;
}


// Authentication Key
function getSanitizedKeyFromPost( $optional = false ) {
	global $RESPONSE;
	$key = null;
	if ( isset($_POST['key']) ) {
		$key = coreSanitize_String($_POST['key']);

		if ( $key !== $_POST['key'] ) {
			json_EmitFatalError_BadRequest("Key contains invalid characters", $RESPONSE);
		}
		if ( strlen($key) > 255 ) {
			json_EmitFatalError_BadRequest("Key too long", $RESPONSE);
		}
	}
	else {
		if ( !$optional )
			json_EmitFatalError_BadRequest("'key' not found in POST", $RESPONSE);
		$key = "";
	}

	return $key;
}

function getSanitizedNameFromPost( $optional = false ) {
	global $RESPONSE;
	$name = null;
	if ( isset($_POST['name']) ) {
		$name = coreSanitize_Name($_POST['name']);

		if ( $name !== $_POST['name'] ) {
			json_EmitFatalError_BadRequest("Name contains (or starts/ends) with invalid characters", $RESPONSE);
		}
		if ( strlen($name) > 32 ) {
			json_EmitFatalError_BadRequest("Name too long", $RESPONSE);
		}
	}
	else {
		if ( !$optional )
			json_EmitFatalError_BadRequest("'name' not found in POST", $RESPONSE);
		$name = "";
	}
	return $name;
}

function getSanitizedPwFromPost( $optional = false ) {
	global $RESPONSE;
	$pw = null;
	if ( isset($_POST['pw']) ) {
		$pw = coreSanitize_Password($_POST['pw']);

		if ( strlen($pw) > 255 ) {
			json_EmitFatalError_BadRequest("Password is too long", $RESPONSE);
		}
	}
	else {
		if ( !$optional )
			json_EmitFatalError_BadRequest("'pw' not found in POST", $RESPONSE);
		$pw = "";
	}
	return $pw;
}

function getSanitizedLoginFromPost( $optional = false ) {
	global $RESPONSE;
	$login = null;
	if ( isset($_POST['login']) ) {
		$login = coreSanitize_String($_POST['login']);

		if ( $login !== $_POST['login'] ) {
			json_EmitFatalError_BadRequest("Login contains invalid characters", $RESPONSE);
		}
		if ( strlen($login) > 254 ) {
			json_EmitFatalError_BadRequest("Login too long", $RESPONSE);
		}
	}
	else {
		if ( !$optional )
			json_EmitFatalError_BadRequest("'login' not found in POST", $RESPONSE);
		$login = "";
	}
	return $login;
}

function validateUserWithIdKey( $id, $key ) {
	global $RESPONSE;
	$user = null;

	// If Non-zero $id and non-empty $key value
	if ( $id && strlen($key) ) {
		$user = user_GetById($id);
		// Confirm lookup succedded, and user has an auth_key set (can get erased, for safety)
		if ( isset($user) && strlen($user['auth_key']) ) {
			// Check if keys match
			if ( $key == $user['auth_key'] ) {
				// Success. Remember that we successfully authenticated
				user_AuthTimeSetNow($id);

				return $user;
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
		json_EmitFatalError_BadRequest($id.' '.$key, $RESPONSE);
	}

	return null;
}


function validateUserWithLogin( $login ) {
	global $RESPONSE;

	$name = null;
	$mail = null;
	$user = null;

	// Decode the login as either an e-mail address, or a username
	if ( coreValidate_Mail($login) ) {
		$mail = coreSanitize_Mail($login);
		$RESPONSE['mail'] = $mail;
	}
	else {
		$name = coreSlugify_Name($login);
		$RESPONSE['name'] = $name;
	}

	// If an e-mail login attempt
	if ( $mail ) {
		$user = user_GetByMail( $mail );
	}
	// If a username login attempt
	else if ( $name ) {
		$user = user_GetBySlug( $name );
	}

	// Bail if no user was found, or if their node is zero (not associated with an account)
	if ( !isset($user) || !($user['node'] > 0) ) {
		json_EmitFatalError_Permission(null, $RESPONSE);
	}

	return $user;
}


// Do Actions
$action = json_ArgShift();
switch ( $action ) {
	// Create a new user activation
	case 'create': //user/create
		json_ValidateHTTPMethod('POST');

		// NOTE: Accounts can be created while logged in. Should we do anything about that?

		$mail = getSanitizedMailFromPost();
		$RESPONSE['mail'] = $mail;

		/// Confirm it's not a blacklisted email domain (i.e. disposables)
		require_once __DIR__."/".SHRUB_PATH."email/blacklist.php";

		if ( is_disposable_email($mail) ) {
			json_EmitFatalError_Server("This address is blacklisted.", $RESPONSE);
		}
		/*|| plugin_Call('api_user_create_mail_allowed', $mail)*/

		$ex_user = user_GetByMail($mail);

		// Is the email provided one that already exists?
		if ( isset($ex_user) ) {
			if ( !$ex_user['node'] ) {
				$ex_new = user_AuthKeyGen($ex_user['id']);

				// Resend activation e-mail
				if ( isset($ex_new) ) {
					$RESPONSE['sent'] = intval(mailSend_UserAdd($mail, $ex_new['id'], $ex_new['auth_key']));
				}
				else {
					json_EmitFatalError_Server(null, $RESPONSE);
				}
			}
			else {
				json_EmitFatalError_Server("Address already registered. Did you mean to reset your password?", $RESPONSE);
			}
		}
		else {
			$user = user_Add($mail);
			if ( $user ) {
				// Send an e-mail
				$RESPONSE['sent'] = intval(mailSend_UserAdd($mail, $user['id'], $user['auth_key']));

				// Successfully Created.
				json_RespondCreated();
			}
			else {
				json_EmitFatalError_Server(null, $RESPONSE);
			}
		}
		break; // case 'create': //user/create

	// Fully activate a user
	case 'activate': //user/activate
		json_ValidateHTTPMethod('POST');

		// NOTE: Accounts can be activated while logged in. Should we do anything about that?

		$id = getSanitizedIdFromPost();
		$key = getSanitizedKeyFromPost();

		$name = getSanitizedNameFromPost(true);
		$pw = getSanitizedPwFromPost(true);

		$user = validateUserWithIdKey($id, $key);

		// If Node is already non-zero, bail. Don't double activate!
		if ( $user['node'] ) {
			json_EmitFatalError_Server(null, $RESPONSE);
		}
		// Node is Zero. We can continue.
		else {
			// If no name and password are set, that's okay. Just bail.
			if ( !strlen($name) && !strlen($pw) ) {
				$RESPONSE['mail'] = $user['mail'];
				$RESPONSE['slug'] = userReserved_GetSlugByMail(strtolower($user['mail']));
				break; // case 'activate': //user/activate
			}

			// If name is too short
			if ( strlen($name) < USERNAME_MIN_LENGTH ) {
				json_EmitFatalError_Permission("Name is too short (minimum ".USERNAME_MIN_LENGTH." alphanumeric characters)", $RESPONSE);
			}

			$slug = coreSlugify_Name($name);

			if ( in_array($slug, $SH_NAME_RESERVED) ) {
				json_EmitFatalError_BadRequest("Sorry. '$slug' is reserved", $RESPONSE);
			}

			// If password is too short
			if ( strlen($pw) < PASSWORD_MIN_LENGTH ) {
				json_EmitFatalError_Permission("Password is too short (minimum ".PASSWORD_MIN_LENGTH." characters)", $RESPONSE);
			}

			// Does that name already exist?
			if ( node_GetIdByParentSlug(SH_NODE_ID_USERS, $slug) ) {
				json_EmitFatalError_Server("Sorry. Account \"$slug\" already exists", $RESPONSE);
			}
			else {
				$reserved = userReserved_GetMailBySlug($slug);
				// Check if this slug is on the reserved list
				if ( count($reserved) ) {
					// Does this e-mail address match the one on the reserve list?
					if ( !in_array(strtolower($user['mail']), $reserved) ) {
						json_EmitFatalError_Server("Sorry. \"$slug\" is reserved. Is this you? Try using your original e-mail address", $RESPONSE);
					}
				}

				// @TODO wrap these so we can rollback
				$user_id = userNode_Add(
					$slug,
					$name
				);

				if ( $user_id ) {
					// @TODO wrap these so we can rollback

					if ( !node_SetAuthor($user_id, $user_id) ) {
						json_EmitFatalError_Server("Unable to set author", $RESPONSE);
					}

					node_Publish($user_id);

					if ( !user_SetNode($id, $user_id) ) {
						json_EmitFatalError_Server("Unable to set node", $RESPONSE);
					}
					if ( !user_SetHash($id, userPassword_Hash($pw)) ) {
						json_EmitFatalError_Server("Unable to set password", $RESPONSE);
					}
					if ( !user_AuthKeyClear($id) ) {
						json_EmitFatalError_Server("Unable to clear key", $RESPONSE);
					}

					// Send an e-mail
					$RESPONSE['sent'] = intval(mailSend_UserCreate($user['mail'], $slug));

					// Successfully Created.
					json_RespondCreated();
				}
				else {
					json_EmitFatalError_Server("Unable to add node", $RESPONSE);
				}
			}
		}
		break; // case 'activate': //user/activate

	case 'password': //user/password
		json_ValidateHTTPMethod('POST');

		// NOTE: Passwords can be reset while logged in? Is that weird?

		$id = getSanitizedIdFromPost();
		$key = getSanitizedKeyFromPost();

		$pw = getSanitizedPwFromPost(true);

		$user = validateUserWithIdKey($id, $key);

		if ( $user['node'] ) {
			$node = nodeComplete_GetById($user['node']);

			// In the unlikely situation where there is no node associated with a user
			if ( !$node && !isset($node['id']) && !isset($node['slug']) ) {
				json_EmitFatalError_Server(null, $RESPONSE);
			}

			// If no password specified, that's okay
			if ( !strlen($pw) ) {
				$RESPONSE['node'] = $node['id'];
				break; // case 'password': //user/password
			}

			// If password is too short
			if ( strlen($pw) < PASSWORD_MIN_LENGTH ) {
				json_EmitFatalError_Permission("Password is too short (minimum ".PASSWORD_MIN_LENGTH." characters)", $RESPONSE);
			}

			// OKAY! LETS DO IT!

			// Set the hash to the new password
			if ( !user_SetHash($id, userPassword_Hash($pw)) ) {
				json_EmitFatalError_Server("Unable to set password", $RESPONSE);
			}
			if ( !user_AuthKeyClear($id) ) {
				json_EmitFatalError_Server("Unable to clear key", $RESPONSE);
			}

			// Send an e-mail
			//$RESPONSE['sent'] = intval(mailSend_UserPasswordReset($user['mail'], $node['slug'], $id, $key));

			// Need to do something to inform the user the password was successfully reset
			$RESPONSE['sent'] = 1;
		}
		else {
			json_EmitFatalError_BadRequest(null, $RESPONSE);
		}
		break; // case 'password': //user/password

	case 'login': //user/login
		json_ValidateHTTPMethod('POST');

		// NOTE: You can login while logged in. Weird huh.

		$login = getSanitizedLoginFromPost();
		$pw = getSanitizedPwFromPost();
		$secret = null;

		// TODO: Secret
		if ( isset($_POST['secret']) ) {
			$secret = coreSanitize_String($_POST['secret']);
		}

		$user = validateUserWithLogin($login);

//		$name = null;
//		$mail = null;
//		$user = null;
//
//		// Decode the login as either an e-mail address, or a username
//		if ( coreValidate_Mail($login) ) {
//			$mail = coreSanitize_Mail($login);
//			$RESPONSE['mail'] = $mail;
//		}
//		else {
//			$name = coreSlugify_Name($login);
//			$RESPONSE['name'] = $name;
//		}
//
//		// If an e-mail login attempt
//		if ( $mail ) {
//			$user = user_GetByMail( $mail );
//		}
//		// If a username login attempt
//		else if ( $name ) {
//			$user = user_GetBySlug( $name );
//		}
//
//		// Bail if no user was found, or if their node is zero (not associated with an account)
//		if ( !isset($user) || !($user['node'] > 0) ) {
//			json_EmitFatalError_Permission(null, $RESPONSE);
//		}

		// If hashes match, it's a success, so log the user in
		if ( isset($user['hash']) && userPassword_Verify($pw, $user['hash']) ) {
			// Does the user have a secret?


			// Success
			$RESPONSE['id'] = $user['node'];

			userSession_Start();
			$_SESSION['id'] = $user['node'];
			$_SESSION['ip'] = $_SERVER['REMOTE_ADDR'];
			userSession_End();

			break; // case 'login': //user/login
		}

		// Permission denied on fail
		json_EmitFatalError_Permission(null, $RESPONSE);
		break; // case 'login': //user/login

	case 'logout': //user/logout
		//json_ValidateHTTPMethod('GET');

		$RESPONSE['id'] = userAuth_Logout();
		break; // case 'logout': //user/logout

	case 'reset': //user/reset
		json_ValidateHTTPMethod('POST');

		// NOTE: You can reset password while logged in.

		$login = getSanitizedLoginFromPost();

		$user = validateUserWithLogin($login);

		if ( isset($user) && isset($user['mail']) ) {
			$node = nodeComplete_GetById($user['node']);

			if ( isset($node) && isset($node['slug']) ) {
				$ex_new = user_AuthKeyGen($user['id']);

				// Send an e-mail
				$RESPONSE['sent'] = intval(mailSend_UserPasswordReset($user['mail'], $node['slug'], $ex_new['id'], $ex_new['auth_key']));
			}
			else {
				json_EmitFatalError_Server(null, $RESPONSE);
			}
		}
		else {
			json_EmitFatalError_Permission(null, $RESPONSE);
		}
		break; // case 'reset': //user/reset

	case 'have': //user/have
		json_ValidateHTTPMethod('POST');

		$mail = strtolower(getSanitizedMailFromPost(true));
		$name = getSanitizedNameFromPost();

		// TODO: If logged in, get your user, and make the current name valid

		//$user = user_GetByMail($mail);

		$slug = coreSlugify_Name($name);

		// If on the internal reserved list
		if ( in_array($slug, $SH_NAME_RESERVED) ) {
			$RESPONSE['available'] = false;
			break; // case 'have': //user/have
		}

		// If on the user reserved list.
		$reserved = userReserved_GetMailBySlug($slug);
		if ( count($reserved) ) {
			if ( !in_array($mail, $reserved) ) {
				$RESPONSE['available'] = false;
				break; // case 'have': //user/have
			}
		}

		// If user exsts
		$node = user_GetBySlug($slug);
		if ( $node ) {
			$RESPONSE['available'] = false;
			break; // case 'have': //user/have
		}

		$RESPONSE['available'] = true;
		break; // case 'have': //user/have

	case 'get': //user/get
		json_ValidateHTTPMethod('GET');

		$id = userAuth_GetId();

		if ( $id > 0 ) {
			$node = nodeComplete_GetById($id);
			if ( count($node) ) {
				$RESPONSE['node'] = $node;
			}
			else {
				$id = 0;
				$RESPONSE['stale'] = true;
			}
		}
		break; // case 'get': //user/get

//	case 'test': //user/test
//		$RESPONSE['server'] = $_SERVER;
//		$RESPONSE['method'] = $_SERVER['REQUEST_METHOD'];
//		$RESPONSE['post'] = $_POST;
//
////
////		if ( userAuth_IsAdmin() ) {
////			$RESPONSE['global'] = $SH;
////		}
////		else {
////			json_EmitFatalError_Permission(null, $RESPONSE);
////		}
//		break; // case 'test': //user/test

	default:
		json_EmitFatalError_Forbidden(null, $RESPONSE);
		break; // default
};

json_End();
