<?php
require_once __DIR__."/../config.php";

include_once __DIR__."/".CONFIG_PATH."config.php";
require_once __DIR__."/".SHRUB_PATH."api.php";
require_once __DIR__."/".SHRUB_PATH."comment/comment.php";
require_once __DIR__."/".SHRUB_PATH."notification/notification.php";
require_once __DIR__."/".SHRUB_PATH."node/node.php";

json_Begin();

const CACHE_KEY_PREFIX = "SH!NOTE!";
const CACHE_TTL = 60;


// Do Actions
$action = json_ArgShift();
switch ( $action ) {
	case 'get': //comment/get
		json_ValidateHTTPMethod('GET');

		$ids = explode('+', json_ArgGet(0));

		// Limit number of comments
		if ( count($ids) > 250 ) {
			json_EmitFatalError_BadRequest("Too many comments", $RESPONSE);
		}

		$RESPONSE['note'] = commentFlags_Filter(commentComplete_Get($ids), userAuth_GetID());

		break; //case 'get': //comment/get

	case 'getbynode': //comment/getbynode
		json_ValidateHTTPMethod('GET');

		$ids = explode('+', json_ArgGet(0));

		if ( count($ids) !== 1 ) {
			json_EmitFatalError_BadRequest(null, $RESPONSE);
		}

		$RESPONSE['note'] = commentFlags_Filter(commentComplete_GetByNode($ids[0]), userAuth_GetID());

		break; //case 'getbynode': //comment/getbynode


	case 'getmylistbyparentnode': //comment/getmylistbyparentnode
		json_ValidateHTTPMethod('GET');

		if ( !($user_id = userAuth_GetID()) ) {
			json_EmitFatalError_Forbidden(null, $RESPONSE);
		}

		$ids = explode('+', json_ArgGet(0));

		if ( count($ids) !== 1 ) {
			json_EmitFatalError_BadRequest(null, $RESPONSE);
		}

		$RESPONSE['comment'] = comment_GetNodeIdBySuperNodeAuthor($ids[0], $user_id);

		break; //case 'getmylistbyparentnode': //comment/getmylistbyparentnode

	case 'add': //comment/add
		json_ValidateHTTPMethod('POST');

		if ( $user_id = userAuth_GetID() ) {
			$node_id = intval(json_ArgShift());
			if ( empty($node_id) ) {
				json_EmitFatalError_BadRequest(null, $RESPONSE);
			}

			$author = $user_id;
			$flags = 0;

			if ( !isset($_POST['parent']) )
				json_EmitFatalError_BadRequest("No parent", $RESPONSE);
			$parent = intval($_POST['parent']);

			if ( !isset($_POST['body']) )
				json_EmitFatalError_BadRequest("No body", $RESPONSE);
			$body = coreSanitize_Body(substr($_POST['body'], 0, 4096));

			$version_tag = "";
			if ( isset($_POST['tag']) )
				$version_tag = coreSlugify_Name($_POST['tag']);

			$parent = intval($_POST['parent']);

			// Load Node
			$node = node_GetById($node_id);


			if ( isset($_POST['anonymous']) && $_POST['anonymous'] ) {
				// Only allow anonymous comments to be posted if the node has "allow-anonymous-comments" meta set.

				$meta = nodeMeta_GetByKeyNode('allow-anonymous-comments',$node_id);
				if ( count($meta) == 0 || !$meta[0]['value'] ) {
					json_EmitFatalError_BadRequest("Cannot post anonymous comment: Node doesn't allow anonymous comments.", $RESPONSE);
				}

				$flags |= SH_COMMENT_FLAG_ANONYMOUS;
			}

			// Check if you have permission to add comment to node
			if ( comment_IsCommentPublicByNode($node) ) {
				// hack for now
				if ( $parent !== 0 )
					json_EmitFatalError_Permission("Temporary: No children", $RESPONSE);

				$RESPONSE['note'] = comment_AddByNode($node['id'], $node['parent'], $author, $parent, $body, $version_tag, $flags);

				// Add notifications for users watching this thread
				if ( $RESPONSE['note'] ) {
					$mentions = notification_GetMentionedUsers($body);
					notification_AddForComment($node['id'], $RESPONSE['note'], $author, $mentions);
				}

				// Invalidate the cache for the containing node so we recompute the comment count immediately on the site.
				nodeCache_InvalidateById($node['id']);
			}
			else {
				json_EmitFatalError_Permission(null, $RESPONSE);
			}
		}
		else {
			json_EmitFatalError_Permission(null, $RESPONSE);
		}

		break; //case 'add': //comment/add

	case 'update': //comment/update
		json_ValidateHTTPMethod('POST');

		if ( $user_id = userAuth_GetID() ) {
			$comment_id = intval(json_ArgShift());
			if ( empty($comment_id) ) {
				json_EmitFatalError_BadRequest(null, $RESPONSE);
			}

			$author = $user_id;

			if ( !isset($_POST['node']) )
				json_EmitFatalError_BadRequest("No node", $RESPONSE);
			$node_id = intval($_POST['node']);
			if ( empty($node_id) ) {
				json_EmitFatalError_BadRequest(null, $RESPONSE);
			}

			if ( !isset($_POST['body']) )
				json_EmitFatalError_BadRequest("No body", $RESPONSE);
			$body = coreSanitize_Body(substr($_POST['body'], 0, 4096));

			$version_tag = "";
			if ( isset($_POST['tag']) )
				$version_tag = coreSlugify_Name($_POST['tag']);

			// Load Comment
			$comment = comment_GetById($comment_id);
			if ( $comment['node'] !== $node_id )
				json_EmitFatalError_Permission("Invalid node", $RESPONSE);

			if ( $comment['author'] !== $author )
				json_EmitFatalError_Permission("Not allowed to edit other people's comments.", $RESPONSE);


			// Are bodies different?
			if ( $body !== $comment['body'] ) {
				// Load Node
				$node = node_GetById($node_id);

				// Check if you have permission to add comment to node
				if ( comment_IsCommentPublicByNode($node) ) {
					$RESPONSE['updated'] = comment_SafeEdit($comment_id, $author, $body, $version_tag, $comment['flags']);

					// Add mention notifications for at-mentions of users that were added in this edit.
					$newmentions = notification_GetMentionedUsers($body, $comment['body']);
					notification_AddForEdit($node_id, $comment_id, $author, $newmentions);
				}
				else {
					json_EmitFatalError_Forbidden("This node type does now allow comments (yet)", $RESPONSE);
				}
			}
			else {
				$RESPONSE['updated'] = 0;
				$RESPONSE['message'] = "No changes";
			}
		}
		else {
			json_EmitFatalError_Permission(null, $RESPONSE);
		}
		break; //case 'update': //comment/update

/*
	case 'count': //comment/count
		json_ValidateHTTPMethod('GET');

		if ( json_ArgCount() ) {
			$node_ids = explode('+', json_ArgGet(0));

			// Sanitize
			foreach ( $node_ids as &$id ) {
				$id = intval($id);

				if ( !$id ) {
					json_EmitFatalError_BadRequest("Invalid ID requested", $RESPONSE);
				}
			}
			sort($node_ids);

			// Validate
//			$nodes = nodeCache_GetById($node_ids);



			$RESPONSE['comments'] = comment_CountByNode($node_ids);
		}
		else {
			json_EmitFatalError_BadRequest(null, $RESPONSE);
		}
		break; // case 'count': //comment/count
*/

	case 'love': //comment/love
		$old_action = $action;
		$action = json_ArgShift();
		switch ( $action ) {
//			case 'getmy': //comment/love/getmy
//				json_ValidateHTTPMethod('GET');
//
//				if ( $user_id = userAuth_GetID() ) {
//					// Limit to last 500 love?
//
//					$RESPONSE['my-love'] = commentLove_GetByAuthor($user_id);
//				}
//				else {
//					json_EmitFatalError_Permission(null, $RESPONSE);
//				}
//				break; // case 'getmy': //comment/love/getmy

			case 'add': //comment/love/add
				json_ValidateHTTPMethod('GET');

				if ( json_ArgCount() ) {
					$comment_id = intval(json_ArgGet(0));

					if ( $comment_id ) {
						// NOTE: You are allowed to LOVE anonymously (it's just not fetchable)
						$user_id = userAuth_GetID();

						if ( $comment = comment_GetById($comment_id) ) {
							if ( $comment['id'] ) {

//							if ( in_array($node['type'], THINGS_I_CAN_LOVE) ) {
								$RESPONSE['id'] = commentLove_AddByComment($comment_id, $user_id, $comment['node'], $comment['supernode'], $comment['author'] );

//								$RESPONSE['love'] = commentLove_GetByNode($node_id);
//							}
//							else {
//								json_EmitFatalError_BadRequest("Can't love ".$node['type'], $RESPONSE);
//							}
							}
						}
						else {
							json_EmitFatalError_NotFound(null, $RESPONSE);
						}
					}
					else {
						json_EmitFatalError_BadRequest(null, $RESPONSE);
					}
				}
				else {
					json_EmitFatalError_BadRequest(null, $RESPONSE);
				}
				break; // case 'add': //comment/love/add

			case 'remove': //comment/love/remove
				json_ValidateHTTPMethod('GET');

				if ( json_ArgCount() ) {
					$comment_id = intval(json_ArgGet(0));

					if ( $comment_id ) {
						// NOTE: You are allowed to LOVE anonymously (it's just not fetchable)
						$user_id = userAuth_GetID();

						if ( $comment = comment_GetById($comment_id) ) {
//							if ( in_array($node['type'], THINGS_I_CAN_LOVE) ) {
								$RESPONSE['removed'] = commentLove_RemoveByComment($comment_id, $user_id);

//								$RESPONSE['love'] = nodeLove_GetByNode($node_id);
//								if ( !isset($RESPONSE['love']) )
//									$RESPONSE['love'] = [
//										'id' => $node_id,
//										'count' => 0,
//										'timestamp' => "0000-00-00T00:00:00Z"
//									];
//							}
//							else {
//								json_EmitFatalError_BadRequest("Can't love ".$node['type'], $RESPONSE);
//							}
						}
						else {
							json_EmitFatalError_NotFound(null, $RESPONSE);
						}
					}
					else {
						json_EmitFatalError_BadRequest(null, $RESPONSE);
					}
				}
				else {
					json_EmitFatalError_BadRequest(null, $RESPONSE);
				}
				break; // case 'remove': //comment/love/remove

				case 'getmy': //comment/love/remove
					json_ValidateHTTPMethod('GET');

					if ( json_ArgCount() ) {
						$node_id = intval(json_ArgGet(0));

						if ( $node_id ) {
							$user_id = userAuth_GetID();

							$RESPONSE['my-love'] = commentLove_GetByAuthor($user_id, $node_id);
						}
						else {
							json_EmitFatalError_BadRequest(null, $RESPONSE);
						}
					}
					else {
						json_EmitFatalError_BadRequest(null, $RESPONSE);
					}
					break; // case 'remove': //comment/love/remove
			default:
			json_EmitFatalError_Forbidden(null, $RESPONSE);
				break; // default
		};
		break; // case 'love': //comment/love

	default:
		json_EmitFatalError_Forbidden(null, $RESPONSE);
		break; // default
};

json_End();
