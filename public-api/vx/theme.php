<?php
require_once __DIR__."/../config.php";

include_once __DIR__."/".CONFIG_PATH."config.php";
require_once __DIR__."/".SHRUB_PATH."api.php";
require_once __DIR__."/".SHRUB_PATH."theme/theme.php";
require_once __DIR__."/".SHRUB_PATH."node/node.php";

json_Begin();

const CACHE_KEY_PREFIX = "SH!THEME!";
const CACHE_TTL = 60;

function GetEventNodes() {
	$cache_key = CACHE_KEY_PREFIX."GetEventNodes";

	$ret = cache_Fetch($cache_key);
	if ( !isset($ret) ) {
		$ret = node_GetIdByType(SH_NODE_TYPE_EVENT);
		cache_Store($cache_key, $ret, CACHE_TTL);
	}
	return $ret;
}

function validateEvent( $event_id, $optional = false ) {
	global $RESPONSE;

	if ( $event_id !== 0 ) {
		/// Check if $event_id is on the master list of event nodes.
		if ( !in_array($event_id, GetEventNodes()) ) {
			json_EmitFatalError_NotFound("Invalid Event", $RESPONSE);
		}
	}
	else {
		if ( !$optional )
			json_EmitFatalError_BadRequest(null, $RESPONSE);
		$event_id = 0;
	}

	$event = nodeComplete_GetById($event_id);

	if ( !$event ) {
		json_EmitFatalError_Server(null, $RESPONSE);
	}

	return $event;
}

function doThemeIdeaVote( $value ) {
	global $RESPONSE;

	json_ValidateHTTPMethod('GET');
	$idea_id = intval(json_ArgGet(0));

	if ( $idea_id ) {
		$idea = themeIdea_GetById($idea_id);
		if ( isset($idea) && isset($idea['node']) ) {
			if ( $event = validateEvent($idea['node']) ) {
				if ( isset($event['meta']) && isset($event['meta']['theme-mode']) && intval($event['meta']['theme-mode']) === 2 ) {
					$author_id = userAuth_GetId();
					if ( $author_id ) {
						$RESPONSE['id'] = themeIdeaVote_Add($idea['node'], $idea_id, $author_id, $value);
						$RESPONSE['value'] = $value;
					}
					else {
						json_EmitFatalError_Permission(null, $RESPONSE);
					}
				}
				else {
					json_EmitFatalError_BadRequest("Event is not Slaughtering", $RESPONSE);
				}
			}
		}
		else {
			json_EmitFatalError_Server(null, $RESPONSE);
		}
	}
	else {
		json_EmitFatalError_BadRequest(null, $RESPONSE);
	}
}


/// Internal version used to extract pages from the raw queries
function _getListPages( $list ) {
	$pages = [];

	foreach ( $list as &$item ) {
		$page = intval($item['page']);
		if ( !in_array($page, $pages) ) {
			$pages[] = $page;
		}
	}

	return $pages;
}

function getLists( $event_id, $can_see_scores = false ) {
	$list = themeList_GetByNode($event_id);

	if ( !isset($list) ) {
		return null;
	}

	// Given our list, figure out what pages we have
	$pages = _getListPages($list);

	// Make arrays for each page
	$lists = [];
	foreach ( $pages as &$page_id ) {
		$lists[$page_id] = [];
	}

	// Populate the pages
	foreach ( $list as &$item ) {
		$lists[$item['page']][] = [
			'id' => $item['id'],
			'node' => $item['node'],
			'idea' => $item['idea'],
			'theme' => $item['theme']
		];

		if ( $can_see_scores ) {
			$lists[$item['page']]['score'] = $item['score'];
		}
	}
	return $lists;
}

function getListPages( $lists ) {
	if ( !isset($lists) ) {
		return [];
	}

	return array_keys($lists);
}

function doThemeListVote( $value ) {
	global $RESPONSE;

	json_ValidateHTTPMethod('GET');
	$theme_id = intval(json_ArgGet(0));

	if ( $theme_id ) {
		$item = themeList_GetById($theme_id);
		//$RESPONSE['item'] = $item;
		if ( isset($item) && isset($item['node']) ) {
			if ( $event = validateEvent($item['node']) ) {
				// TODO: Check Page activity too
				$page = $item['page'];
				//$RESPONSE['event'] = $event;
				if ( isset($event['meta']) && isset($event['meta']['theme-mode']) && intval($event['meta']['theme-mode']) === 4 ) {
					if ( isset($event['meta']["theme-page-mode-$page"]) && intval($event['meta']["theme-page-mode-$page"]) === 1 ) {
						$author_id = userAuth_GetId();
						if ( $author_id ) {
							$RESPONSE['id'] = themeListVote_Add($item['node'], $author_id, $theme_id, $value) ? $theme_id : 0;
							$RESPONSE['value'] = $value;
						}
						else {
							json_EmitFatalError_Permission(null, $RESPONSE);
						}
					}
					else {
						json_EmitFatalError_BadRequest("Round is not Voting", $RESPONSE);
					}
				}
				else {
					json_EmitFatalError_BadRequest("Event is not Voting", $RESPONSE);
				}
			}
		}
		else {
			json_EmitFatalError_Server(null, $RESPONSE);
		}
	}
	else {
		json_EmitFatalError_BadRequest(null, $RESPONSE);
	}
}



// Do Actions
$action = json_ArgShift();
switch ( $action ) {
	case 'stats': //theme/stats
		json_ValidateHTTPMethod('GET');
		$event_id = intval(json_ArgGet(0));

		if ( $event = validateEvent($event_id) ) {
			$ret = [];

			if ( isset($event['meta']) && isset($event['meta']['theme-mode']) ) {
				if ( intval($event['meta']['theme-mode']) >= 1 ) {
					$ret['idea'] = themeIdea_GetStats($event_id);
				}
//				if ( intval($event['meta']['theme-mode']) >= 2 ) {
//					$ret['idea'] = themeIdeaVote_GetStats($event_id);
//				}
//				if ( intval($event['meta']['theme-mode']) >= 3 ) {
//					$ret['idea'] = themeIdeaCompare_GetStats($event_id);
//				}
			}

			$RESPONSE['stats'] = $ret;
		}
		break;	// case 'stats': //theme/stats

	case 'history': //theme/history
		$parent_action = $action;
		$action = json_ArgShift();
		switch ( $action ) {
			case 'get': //theme/history/get
				json_ValidateHTTPMethod('GET');

				// TODO: Cache history

				$RESPONSE['history'] = themeHistory_Get();
				break; // case 'get': //theme/history/get

			default:
				json_EmitFatalError_Forbidden(null, $RESPONSE);
				break; // default
		};
		break; // case 'history': //theme/history

	case 'get': //theme/get
		json_ValidateHTTPMethod('GET');

		$event_id = intval(json_ArgGet(0));

		// NOTE: This is a special cache. The server is going to be hit HARD by this request.

		// TODO: Build Cache Key
		// TODO: Check if it exists
		// TODO: If it exists, check if it's allowed to be shown, and return immediately

		if ( $event = validateEvent($event_id) ) {
			// If the theme is public knowledge
			if ( isset($event['meta']['event-theme']) ) {
				$RESPONSE['theme'] = $event['meta']['event-theme'];
				break; // case 'get': //theme/get
			}

			// If the event has a start time
			if ( isset($event['meta']['event-start']) ) {
				$start = strtotime($event['meta']['event-start']);
				$now = time();

				$diff = $start - $now;

				$RESPONSE['countdown'] = $diff > 0 ? $diff : 0;

				$event_priv = null;//nodeComplete_GetPrivateById($event_id);

				// TODO: Store item in cache

				if ( isset($event_priv) && isset($event_priv['event-theme']) ) {
					$RESPONSE['locked'] = true;
					if ( $diff <= 0 ) {
						$RESPONSE['theme'] = $event_priv['event-theme'];
					}
				}
				else {
					$RESPONSE['locked'] = false;
				}

				break; // case 'get': //theme/get
			}

			json_EmitFatalError_BadRequest("No theme is set", $RESPONSE);
		}
		break; // case 'get': //theme/get

	// Theme Suggestions
	case 'idea': //theme/idea
		$parent_action = $action;
		$action = json_ArgShift();
		switch ( $action ) {
			case 'getmy': //theme/idea/getmy
				json_ValidateHTTPMethod('GET');
				$event_id = intval(json_ArgGet(0));

				if ( $event = validateEvent($event_id) ) {
					$author_id = userAuth_GetId();
					if ( $author_id ) {
						$RESPONSE['ideas'] = themeIdea_Get($event_id, $author_id);
						$RESPONSE['count'] = count($RESPONSE['ideas']);
					}
					else {
						json_EmitFatalError_Permission(null, $RESPONSE);
					}
				}
				break; // case 'getmy: //theme/idea/getmy

//			case 'get': //theme/idea/get
//				json_ValidateHTTPMethod('GET');
//				$event_id = intval(json_ArgGet(0));
//
//				if ( $event_id !== 0 ) {
//					/// Broadphase: check if $event_id is on the master list of event nodes.
//					if ( in_array($event_id, GetEventNodes()) ) {
//						///	Narrowphase: Get the threshold from the node itself
//						$threshold = nodeCache_GetMetaFieldById($event_id, 'theme_threshold', null);
//						$cache_key = CACHE_KEY_PREFIX."IDEA!GET".$event_id."!".$threshold;
//
//						$RESPONSE['themes'] = cache_Fetch($cache_key);
//						if ( !isset($RESPONSE['themes']) ) {
//							$RESPONSE['themes'] = themeIdea_GetOriginal($event_id, null, $threshold);
//							cache_Store($cache_key, $RESPONSE['themes'], CACHE_TTL);
//						}
//
//						$RESPONSE['count'] = count($RESPONSE['themes']);
//					}
//					else {
//						json_EmitFatalError_NotFound("Invalid Event", $RESPONSE);
//					}
//				}
//				else {
//					json_EmitFatalError_BadRequest(null, $RESPONSE);
//				}
//				break; // case 'get': //theme/idea/get

			case 'add': //theme/idea/add
				json_ValidateHTTPMethod('POST');

				$user = userAuth_GetId();
				if ( !$user ) {
					json_EmitFatalError_Permission(null, $RESPONSE);
				}

				if ( isset($_POST['idea']) )
					$idea = coreSanitize_String($_POST['idea']);
				else
					json_EmitFatalError_BadRequest("'idea' not found in POST", $RESPONSE);

				if ( $idea !== $_POST['idea'] ) {
					json_EmitFatalError_BadRequest("'idea' is invalid", $RESPONSE);
				}

				$event_id = intval(json_ArgGet(0));
				if ( $event = validateEvent($event_id) ) {
					// Is Event Accepting Suggestions ?
					if ( isset($event['meta']) && isset($event['meta']['theme-mode']) && intval($event['meta']['theme-mode']) === 1 ) {
						$theme_limit = isset($event['meta']['theme-idea-limit']) ? intval($event['meta']['theme-idea-limit']) : 0;

						$RESPONSE['response'] = themeIdea_Add($idea, $event_id, $user, $theme_limit);

						$RESPONSE['ideas'] = themeIdea_Get($event_id, $user);
						$RESPONSE['count'] = count($RESPONSE['ideas']);

						if ( $RESPONSE['response']['id'] )
							json_RespondCreated();
					}
					else {
						json_EmitFatalError_BadRequest("Event is not accepting Theme Suggestions", $RESPONSE);
					}
				}
				break; // case 'add': //theme/idea/add

			case 'remove': //theme/idea/remove
				json_ValidateHTTPMethod('POST');

				$user = userAuth_GetId();
				if ( !$user ) {
					json_EmitFatalError_Permission(null, $RESPONSE);
				}

				if ( isset($_POST['id']) )
					$id = intval($_POST['id']);
				else
					json_EmitFatalError_BadRequest("'id' not found in POST", $RESPONSE);

				if ( !$id ) {
					json_EmitFatalError_BadRequest(null, $RESPONSE);
				}

				$event_id = intval(json_ArgGet(0));
				if ( $event = validateEvent($event_id) ) {
					// Is Event Accepting Suggestions ?
					if ( isset($event['meta']) && isset($event['meta']['theme-mode']) && intval($event['meta']['theme-mode']) === 1 ) {
						$RESPONSE['response'] = themeIdea_Remove($id, $user);

						$RESPONSE['ideas'] = themeIdea_Get($event_id, $user);
						$RESPONSE['count'] = count($RESPONSE['ideas']);

						if ( $RESPONSE['response'] )
							json_RespondCreated();
					}
					else {
						json_EmitFatalError_BadRequest("Event is not accepting Theme Suggestions", $RESPONSE);
					}
				}
				break; // case 'remove': //theme/idea/remove

			case 'vote': //theme/idea/vote
				$parent_action = $action;
				$action = json_ArgShift();
				switch ( $action ) {
					case 'get': //theme/idea/vote/get
						json_ValidateHTTPMethod('GET');
						$event_id = intval(json_ArgGet(0));

						if ( $event = validateEvent($event_id) ) {
							if ( isset($event['meta']) && isset($event['meta']['theme-mode']) && intval($event['meta']['theme-mode']) >= 1 ) {
								$author_id = userAuth_GetId();
								if ( $author_id ) {
									$threshold = 0.0;
									$RESPONSE['ideas'] = themeIdeaVote_GetIdeas($event_id, $threshold);
								}
								else {
									json_EmitFatalError_Permission(null, $RESPONSE);
								}
							}
							else {
								json_EmitFatalError_BadRequest("Event is not Slaughtering", $RESPONSE);
							}
						}
						break; // case 'get': //theme/idea/vote/get

					case 'getmy': //theme/idea/vote/getmy
						json_ValidateHTTPMethod('GET');
						$event_id = intval(json_ArgGet(0));

						if ( $event = validateEvent($event_id) ) {
							if ( isset($event['meta']) && isset($event['meta']['theme-mode']) && intval($event['meta']['theme-mode']) >= 2 ) {
								$author_id = userAuth_GetId();
								if ( $author_id ) {
									$RESPONSE['votes'] = themeIdeaVote_GetMy($event_id, $author_id);
								}
								else {
									json_EmitFatalError_Permission(null, $RESPONSE);
								}
							}
							else {
								json_EmitFatalError_BadRequest("Event is not Slaughtering", $RESPONSE);
							}
						}
						break; // case 'getmy': //theme/idea/vote/getmy

					case 'yes': //theme/idea/vote/yes
						doThemeIdeaVote(1);
						break; // case 'yes': //theme/idea/vote/yes

					case 'no': //theme/idea/vote/no
						doThemeIdeaVote(0);
						break; // case 'no': //theme/idea/vote/no

					case 'flag': //theme/idea/vote/flag
						doThemeIdeaVote(-1);
						break; // case 'flag': //theme/idea/vote/flag
				}
				break; // case 'vote': //theme/idea/vote

			default:
				json_EmitFatalError_Forbidden(null, $RESPONSE);
				break; // default
		};
		break; // case 'idea': //theme/idea

	// Theme (List) Voting
	case 'list': //theme/list
		$parent_action = $action;
		$action = json_ArgShift();
		switch ( $action ) {
//			case 'getmy': //theme/list/getmy
//				json_ValidateHTTPMethod('GET');
//				$event_id = intval(json_ArgGet(0));
//
//				if ( $event = validateEvent($event_id) ) {
//					$author_id = userAuth_GetId();
//					if ( $author_id ) {
//						$RESPONSE['ideas'] = themeList_GetMy($event_id, $author_id);
//						$RESPONSE['count'] = count($RESPONSE['ideas']);
//					}
//					else {
//						json_EmitFatalError_Permission(null, $RESPONSE);
//					}
//				}
//				break; // case 'getmy: //theme/list/getmy

			case 'get': //theme/list/get
				json_ValidateHTTPMethod('GET');
				$event_id = intval(json_ArgGet(0));

				if ( $event = validateEvent($event_id) ) {
					$page_id = json_ArgGet(1);

					// If no page specified, get everything
					if ( $page_id === '' ) {
						$page_id = null;
					}
					// Otherwise, get specific page
					else {
						$page_id = intval($page_id);

						// Pages start at 1, *NOT* zero
						if ( !$page_id ) {
							json_EmitFatalError_BadRequest("Invalid Page: $page_id", $RESPONSE);
						}
					}

					$lists = getLists($event_id);
					$pages = getListPages($lists);

					$allowed = [];
					foreach ( $pages as $page ) {
						if ( isset($event['meta']["theme-page-mode-$page"]) && $event['meta']["theme-page-mode-$page"] > 0 ) {
							$allowed[] = $page;
						}
					}

					$RESPONSE['allowed'] = $allowed;
					$RESPONSE['pages'] = count($pages);

					$RESPONSE['names'] = [];
					foreach ( $pages as $page ) {
						if ( isset($event['meta']["theme-page-name-$page"]) ) {
							$RESPONSE['names'][$page] = $event['meta']["theme-page-name-$page"];
						}
						else {
							$RESPONSE['names'][$page] = "Round $page";
						}
					}

					// So what do we want anyway?
					if ( is_null($page_id) ) {
						$request = $pages;
					}
					else if ( in_array($page_id, $pages) ) {
						$request = [$page_id];
					}
					else {
						json_EmitFatalError_BadRequest("Invalid Page: $page_id", $RESPONSE);
					}

					// Emit the list
					$RESPONSE['lists'] = [];
					foreach ( $allowed as $page ) {
						if ( in_array($page, $request) ) {
							$RESPONSE['lists'][$page] = $lists[$page];
						}
					}
				}
				break; // case 'get: //theme/list/get

			case 'vote': //theme//list/vote
				$parent_action = $action;
				$action = json_ArgShift();
				switch ( $action ) {
//					case 'get': //theme/list/vote/get
//						json_ValidateHTTPMethod('GET');
//						$event_id = intval(json_ArgGet(0));
//
//						if ( $event = validateEvent($event_id) ) {
//							if ( isset($event['meta']) && isset($event['meta']['theme-mode']) && intval($event['meta']['theme-mode']) >= 2 ) {
//								$author_id = userAuth_GetId();
//								if ( $author_id ) {
//									$threshold = 0.0;
//									$RESPONSE['ideas'] = themeIdeaVote_GetIdeas($event_id, $threshold);
//								}
//								else {
//									json_EmitFatalError_Permission(null, $RESPONSE);
//								}
//							}
//							else {
//								json_EmitFatalError_BadRequest("Event is not Slaughtering", $RESPONSE);
//							}
//						}
//						break; // case 'get': //theme/list/vote/get

					case 'getmy': //theme/list/vote/getmy
						json_ValidateHTTPMethod('GET');
						$event_id = intval(json_ArgGet(0));

						if ( $event = validateEvent($event_id) ) {
							if ( isset($event['meta']) && isset($event['meta']['theme-mode']) && intval($event['meta']['theme-mode']) >= 4 ) {
								$author_id = userAuth_GetId();
								if ( $author_id ) {
									$votes = themeListVote_GetByNodeUser($event_id, $author_id);

									$ret = [];
									foreach ( $votes as $vote ) {
										$ret[$vote['theme']] = $vote['vote'];
									}

									$RESPONSE['votes'] = $ret;
								}
								else {
									json_EmitFatalError_Permission(null, $RESPONSE);
								}
							}
							else {
								json_EmitFatalError_BadRequest("Event is not Voting", $RESPONSE);
							}
						}
						break; // case 'getmy': //theme/list/vote/getmy

					case 'yes': //theme/list/vote/yes
						doThemeListVote(1);
						break; // case 'yes': //theme/list/vote/yes

					case 'maybe': //theme/list/vote/maybe
						doThemeListVote(0);
						break; // case 'maybe': //theme/list/vote/maybe

					case 'no': //theme/list/vote/no
						doThemeListVote(-1);
						break; // case 'no': //theme/list/vote/no
				}
				break; // case 'vote': //theme/list/vote

			default:
				json_EmitFatalError_Forbidden(null, $RESPONSE);
				break; // default
		};
		break; // case 'list': //theme/list

	default:
		json_EmitFatalError_Forbidden(null, $RESPONSE);
		break; // default
};

json_End();
