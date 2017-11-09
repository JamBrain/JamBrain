<?php
require_once __DIR__."/../config.php";

include_once __DIR__."/".CONFIG_PATH."config.php";
require_once __DIR__."/".SHRUB_PATH."api.php";
require_once __DIR__."/".SHRUB_PATH."node/node.php";

const CACHE_TTL = 60+30;

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

$stats = null;

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
		$CACHE_KEY = '!API!STATS!'.$node['id'];
		
		if ( $stats = cache_Fetch($CACHE_KEY) ) {
			$RESPONSE['cached'] = [$node['id']];
		}
		else {
			$stats = [];
			$stats['signups'] = node_CountByParentAuthorType(
				$node['id'], null, null,
				'item', null, null,
				null
			);
			$stats['authors'] = nodeMeta_CountByABKeyScope(
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
			$stats['demo'] = node_CountByParentAuthorType(
				$node['id'], null, null,
				'item', 'demo', null
			);
	//		$stats['other'] = node_CountByParentAuthorType(
	//			$node['id'], null, null,
	//			'item', 'other', null
	//		);
	//		$stats['media'] = node_CountByParentAuthorType(
	//			$node['id'], null, null,
	//			'item', 'media', null
	//		);
	
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
			$stats['late'] = node_CountByParentAuthorType(
				$node['id'], null, null,
				'item', null, 'late'
			);
			$stats['release'] = node_CountByParentAuthorType(
				$node['id'], null, null,
				'item', null, 'release'
			);
			$stats['unfinished'] = node_CountByParentAuthorType(
				$node['id'], null, null,
				'item', null, 'unfinished'
			);
	
			$stats['grade-20-plus'] = nodeMagic_CountByParentName($node['id'], 'grade', '>=20');
			$stats['grade-15-20'] = nodeMagic_CountByParentName($node['id'], 'grade', '>=15') - ($stats['grade-20-plus']);
			$stats['grade-10-15'] = nodeMagic_CountByParentName($node['id'], 'grade', '>=10') - ($stats['grade-20-plus'] + $stats['grade-15-20']);
			$stats['grade-5-10'] = nodeMagic_CountByParentName($node['id'], 'grade', '>=5') - ($stats['grade-20-plus'] + $stats['grade-15-20'] + $stats['grade-10-15']);
			$stats['grade-0-5'] = nodeMagic_CountByParentName($node['id'], 'grade', '<5');
			$stats['grade-0-only'] = nodeMagic_CountByParentName($node['id'], 'grade', '=0');
	
			$stats['timestamp'] = str_replace('+00:00', 'Z', date(DATE_W3C, time()));
			
			cache_Store($CACHE_KEY, $stats, CACHE_TTL);
		}
		
		break;
	}
};

$RESPONSE['stats'] = $stats;
//$RESPONSE['timestamp'] = str_replace('+00:00', 'Z', date(DATE_W3C, time()));

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
