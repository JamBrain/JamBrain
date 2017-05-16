<?php
require_once __DIR__."/../config.php";

include_once __DIR__."/".CONFIG_PATH."config.php";
require_once __DIR__."/".SHRUB_PATH."api.php";
require_once __DIR__."/".SHRUB_PATH."node/node.php";

json_Begin();

$node_id = intval(json_ArgShift());

if ( !$node_id ) {
	json_EmitFatalError_Forbidden(null, $RESPONSE);
}

$node = node_GetById($node_id);

if ( !$node ) {
	json_EmitFatalError_NotFound(null, $RESPONSE);
}

if ( $node['id'] )
	$RESPONSE['id'] = $node['id'];
	
if ( $node['type'] )
	$RESPONSE['type'] = $node['type'];
if ( $node['subtype'] )
	$RESPONSE['subtype'] = $node['subtype'];
if ( $node['subsubtype'] )
	$RESPONSE['subsubtype'] = $node['subsubtype'];

$stats = [];
switch ( $node['type'] ) {
	case 'post': {
		break;
	}

	case 'item': {
		switch ( $node['subtype'] ) {
			case 'game':
				// Games Only
				
				break;
		};
		
		// Items Only

		break;
	}

	case 'event': {
		// TODO: Cache
		
		$stats['signups'] = node_CountByParentAuthorType(
			$node['id'], null, null,
			'item', null, null,
			null
		);
		$stats['authors'] = nodeLink_CountByABKeyScope(
			$node['id'], null, null, 'author'
		);
		
		$stats['unpublished'] = node_CountByParentAuthorType(
			$node['id'], null, null,
			'item', null, null,
			false
		);
		
		// Item Types
		$stats['game'] = node_CountByParentAuthorType(
			$node['id'], null, null,
			'item', 'game', null
		);
		$stats['craft'] = node_CountByParentAuthorType(
			$node['id'], null, null,
			'item', 'craft', null
		);
		$stats['tool'] = node_CountByParentAuthorType(
			$node['id'], null, null,
			'item', 'tool', null
		);

		// Item SubTypes
		$stats['jam'] = node_CountByParentAuthorType(
			$node['id'], null, null,
			'item', null, 'jam'
		);
		$stats['compo'] = node_CountByParentAuthorType(
			$node['id'], null, null,
			'item', null, 'compo'
		);
		$stats['warmup'] = node_CountByParentAuthorType(
			$node['id'], null, null,
			'item', null, 'warmup'
		);
		$stats['release'] = node_CountByParentAuthorType(
			$node['id'], null, null,
			'item', null, 'release'
		);
		$stats['unfinished'] = node_CountByParentAuthorType(
			$node['id'], null, null,
			'item', null, 'unfinished'
		);

		$stats['grade-20'] = nodeMagic_CountByParentName($node['id'], 'grade', '>=20');
		$stats['grade-15'] = nodeMagic_CountByParentName($node['id'], 'grade', '>=15') - $stats['grade-20'];
		$stats['grade-10'] = nodeMagic_CountByParentName($node['id'], 'grade', '>=15') - $stats['grade-20'] - $stats['grade-15'];
		
		break;
	}
};

$RESPONSE['stats'] = $stats;

// Do Actions
//$action = json_ArgShift();
//switch ( $action ) {
//	case 'stats': //grade/stats
//		json_ValidateHTTPMethod('GET');
//		//$event_id = intval(json_ArgGet(0));
//
//	default:
//		
//		
//		break; // default
//};

json_End();
