<?php
require_once __DIR__."/../config.php";

include_once __DIR__."/".CONFIG_PATH."config.php";
require_once __DIR__."/".SHRUB_PATH."api.php";
require_once __DIR__."/".SHRUB_PATH."node/node.php";
require_once __DIR__."/".SHRUB_PATH."grade/grade.php";

json_Begin();

// ********************* //

function GetGrades( $node ) {
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
	case 'stats': //grade/stats
		json_ValidateHTTPMethod('GET');
		//$event_id = intval(json_ArgGet(0));

		$RESPONSE['ham'] = "true";

		break; // case 'stats': //grade/stats
		
	case 'add': //grade/add/:node_id/:grade/:score
	case 'remove': //grade/add/:node_id/:grade
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
		$score = intval($score);

		if ( $score < 0 || $score > 5 )
			json_EmitFatalError_BadRequest("Invalid score: $score", $RESPONSE);

		// Load Node
		$node = nodeComplete_GetById($node_id);
		$parent_id = $node['parent'];
		
		if ( !$parent_id )
			json_EmitFatalError_BadRequest("Node is an orphan", $RESPONSE);
		
		// Load the Parent Node
		$parent = nodeComplete_GetById($parent_id);

		if ( !isset($parent['meta']) || !isset($parent['meta']['can-grade']) )
			json_EmitFatalError_BadRequest("Parent is not accepting grades", $RESPONSE);

		$grades = GetGrades($parent);
		
		if ( !in_array($grade, $grades) )
			json_EmitFatalError_BadRequest("Invalid grade: $grade", $RESPONSE);

		if ( $score )
			$RESPONSE['id'] = grade_AddByNodeAuthorName($node_id, $user_id, $grade, $score);
		else 
			$RESPONSE['changed'] = grade_RemoveByNodeAuthorName($node_id, $user_id, $grade);

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

	default:
		json_EmitFatalError_Forbidden(null, $RESPONSE);
		break; // default
};

json_End();
