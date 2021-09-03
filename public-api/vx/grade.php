<?php
require_once __DIR__."/../config.php";

include_once __DIR__."/".CONFIG_PATH."config.php";
require_once __DIR__."/".SHRUB_PATH."api.php";
require_once __DIR__."/".SHRUB_PATH."node/node.php";
require_once __DIR__."/".SHRUB_PATH."grade/grade.php";

json_Begin();

// ********************* //

function GetGradeNames( $node ) {
	$ret = [];
	if ( isset($node['meta']) ) {
		foreach ( $node['meta'] as $key => &$value ) {
			$parts = explode('-', $key);
			if ( count($parts) == 2 ) {
				if ( $parts[0] == 'grade' )
					$ret[] = $key;
			}
		}
	}

	return $ret;
}

// ********************* //

// Do Actions
$action = json_ArgShift();
switch ( $action ) {
	case 'add': //grade/add/:node_id/:grade/:score
	case 'remove': //grade/remove/:node_id/:grade
		json_ValidateHTTPMethod('GET');

		// Authenticate User
		$user_id = userAuth_GetId();
		if ( !$user_id )
			json_EmitFatalError_Permission(null, $RESPONSE);

		$node_id = intval(json_ArgShift());
		if ( !$node_id )
			json_EmitFatalError_BadRequest("Unspecified node", $RESPONSE);

		$grade = coreSlugify_Name(json_ArgShift());
		if ( !$grade )
			json_EmitFatalError_BadRequest("No grade", $RESPONSE);

		$score = json_ArgShift();
		if ( is_null($score) && $action == 'add' )
			json_EmitFatalError_BadRequest("No score", $RESPONSE);
		$score = floatval($score);

		if ( $score < 0.0 || $score > 5.0 )
			json_EmitFatalError_BadRequest("Score out of range [0-5]: $score", $RESPONSE);
		if ( $score*2.0 != intval($score*2.0) )
			json_EmitFatalError_BadRequest("Score has bad fraction: $score", $RESPONSE);

		// Load Node
		$node = nodeCache_GetById($node_id);
		$parent_id = $node['parent'];

		if ( !$parent_id )
			json_EmitFatalError_BadRequest("Node is an orphan", $RESPONSE);

		// Load the Parent Node
		$parent = nodeCache_GetById($parent_id);

		if ( !isset($parent['meta']) || !isset($parent['meta']['can-grade']) )
			json_EmitFatalError_BadRequest("Parent is not accepting grades", $RESPONSE);

		// Determine the user's game in the referenced event.
		$published_game = false;
		$authored_ids = nodeComplete_GetWhatIdsIdHasAuthoredByParent($user_id, $parent_id);
		if ( !empty($authored_ids) ) {
			$authored_list = nodeCache_GetById($authored_ids);
			foreach ( $authored_list as $authored ) {
				// Don't allow user to vote on a game they're the author of
				if ( $authored['id'] == $node_id ) {
					json_EmitFatalError_BadRequest("Not allowed to vote on a game you authored", $RESPONSE);
				}

				// Check whether the user has a published game.
				if ( $authored['published'] ) {
					$published_game = true;
				}
			}
		}

		// Sanity check in case author tag is missing - Don't allow user to vote if they are the author of this node.
		if ( $node['author'] == $user_id ) {
			json_EmitFatalError_BadRequest("Not allowed to vote on a game you authored", $RESPONSE);
		}

		// Don't allow user to vote if their game is not published.
		if ( !$published_game ) {
			json_EmitFatalError_BadRequest("Not allowed to vote if you did not publish a game", $RESPONSE);
		}

		$grades = GetGradeNames($parent);

		if ( !in_array($grade, $grades) )
			json_EmitFatalError_BadRequest("Invalid grade: $grade", $RESPONSE);

		if ( $score )
			$RESPONSE['id'] = grade_AddByNodeAuthorName($node_id, $parent_id, $user_id, $grade, $score);
		else
			$RESPONSE['changed'] = grade_RemoveByNodeAuthorName($node_id, $user_id, $grade);

//		$RESPONSE['cache'] = nodeCache_GetStats();

		break; // case 'upload': //grade/add/:node_id/:grade/:score

	case 'getmy': //grade/getmy/:node_id
		json_ValidateHTTPMethod('GET');

		// Authenticate User
		$user_id = userAuth_GetId();
		if ( !$user_id )
			json_EmitFatalError_Permission(null, $RESPONSE);

		$node_id = intval(json_ArgShift());
		if ( !$node_id )
			json_EmitFatalError_BadRequest("Unspecified node", $RESPONSE);

		$RESPONSE['grade'] = grade_GetByNodeAuthor($node_id, $user_id);

		break; // case 'getmy': //grade/getmy/:node_id

	case 'getallmy': //grade/getallmy/:event_id
		json_ValidateHTTPMethod('GET');

		// Authenticate User
		$user_id = userAuth_GetId();
		if ( !$user_id )
			json_EmitFatalError_Permission(null, $RESPONSE);

		$node_id = intval(json_ArgShift());
		if ( !$node_id )
			json_EmitFatalError_BadRequest("Unspecified node", $RESPONSE);

		$RESPONSE['grade'] = grade_GetByAuthorParent($user_id, $node_id);

		break; // case 'getallmy': //grade/getallmy/:event_id

	case 'getmylist': //grade/getmylist[/:event_id]
		json_ValidateHTTPMethod('GET');

		// Authenticate User
		$user_id = userAuth_GetId();
		if ( !$user_id )
			json_EmitFatalError_Permission(null, $RESPONSE);

		$parent_id = 0;
		if ( json_ArgCount() > 0 ) {
			$parent_id = intval(json_ArgShift());
		}
		else {
			// Get current featured event as the default value
			$rootnode = nodeCache_GetById(1);
			if ( isset($rootnode['meta']) && isset($rootnode['meta']['featured']) ) {
				$parent_id = intval($rootnode['meta']['featured']);
			}
		}

		if ( !$parent_id )
			json_EmitFatalError_BadRequest("Unspecified event", $RESPONSE);

		$RESPONSE['event_id'] = $parent_id;
		$RESPONSE['items'] = grade_GetNodeIdByAuthorParent($user_id, $parent_id);

		break; // case 'getmylist': //grade/getmylist[/:event_id]
/*
	case 'get': //grade/get/:node_id
		json_ValidateHTTPMethod('GET');

		$node_id = intval(json_ArgShift());
		if ( !$node_id )
			json_EmitFatalError_BadRequest("Unspecified node", $RESPONSE);

		// Data
		$RESPONSE['grade'] = grade_CountByNode($node_id);

		// Results

		break; // case 'get': //grade/get/:node_id
*/
	default:
		json_EmitFatalError_Forbidden(null, $RESPONSE);
		break; // default
};

json_End();
