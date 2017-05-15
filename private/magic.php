<?php
const CONFIG_PATH = "../src/shrub";
const SHRUB_PATH = "../src/shrub/src";

include_once __DIR__."/".CONFIG_PATH."/config.php";
require_once __DIR__."/".SHRUB_PATH."/cron.php";
require_once __DIR__."/".SHRUB_PATH."/node/node.php";
require_once __DIR__."/".SHRUB_PATH."/note/note.php";
require_once __DIR__."/".SHRUB_PATH."/grade/grade.php";

// This is a CRON job that regularly updates magic
const MAX_ITEMS_TO_ADD = 500;
const MAX_ITEMS_TO_CALC = 500;

// TODO: Adjust the maximum effectiveness as the weeks go by. Start with like 50 initially (more than enough), but let it go up after.
const FEEDBACK_PER_NOTE = 4.0;
const COOL_MAX_GRADES = 30;//50;
const COOL_MAX_FEEDBACK = 50;

function AddMagic( $name, $parent ) {
	global $node_ids, $db;
	$magic_ids = nodeMagic_GetNodeIdByParentName($parent, $name);

	$diff = array_diff($node_ids, $magic_ids);
	$new_nodes = array_slice($diff, 0, MAX_ITEMS_TO_ADD);

	if ( count($new_nodes) ) {
		$nodes = node_IdToIndex(node_GetById($new_nodes));

		$db->begin_transaction();
		foreach ( $new_nodes as $key => &$value ) {
			$node = &$nodes[$value];
			if ( $node ) {
				nodeMagic_Add(
					$node['id'],
					$node['parent'],
					$node['superparent'],
					$node['author'],
					0,	// score
					$name
				);
			}
		}
		$db->commit();
	}
}

// Get the root node
$root = nodeComplete_GetById(1);

// Get current featured event
$featured_id = null;
if ( isset($root['meta']['featured']) )
	$featured_id = $root['meta']['featured']|0;

// As long as an event is featured, do coolness calculation
if ( $featured_id ) {
	$featured = nodeComplete_GetById($featured_id);
	if ( $featured && isset($featured['id']) && $featured['id'] == $featured_id ) {
		$grades = [];
		$grades_out = [];	// optimization
		foreach ( $featured['meta'] as $key => &$value ) {
			if ( strpos($key, 'grade-') === 0 ) {
				if ( count(explode('-', $key)) == 2 ) {
					$grades[] = $key;
					$grades_out[] = $key.'-out';
				}
			}
		}
		
		// ** Find items that don't have magic **
		{
			// Get all published item ids
			$node_ids = node_GetIdByParentTypePublished($featured_id, 'item');
	
			AddMagic('grade', $featured_id);
			AddMagic('given', $featured_id);
			AddMagic('feedback', $featured_id);
			AddMagic('smart', $featured_id);
			AddMagic('cool', $featured_id);
		}
		
		
		// ** Find a bunch of the oldest games with cool magic **
		{
			$magics = nodeMagic_GetOldestByParentName($featured_id, 'cool', MAX_ITEMS_TO_CALC);
			
			$node_ids = array_map(function($value) { return $value['node']; }, $magics);
			$nodes = node_IdToIndex(nodeComplete_GetById($node_ids, F_NODE_NO_BODY | F_NODE_META | F_NODE_LINK|F_NODE_NO_LINKVALUE));
	
			$scores = [];
			
			// Calculate their scores
			foreach ( $magics as &$magic ) {
				// The old Formula
				//
				//	function compo2_calc_coolness( $votes, $total ) {
				//  	$votes = max(0, min(100, $votes));
				//		$total = max(0, min(100, $total-1));
				//		$v = sqrt($votes * 100 / max(1, $total)) * 100 / 10;
				//		return intval(round($v));
				//	}
				//
				// 0, 0 = 0
				// 0, 25 = 0
				// 0, 50 = 0
				// 0, 75 = 0
				// 0, 100 = 0
				//
				// 25, 0 = 500
				// 25, 25 = 100
				// 25, 50 = 70.71
				// 25, 75 = 57.73
				// 25, 100 = 50
				//
				// 50, 0 = 707.1
				// 50, 25 = 141.42
				// 50, 50 = 100
				// 50, 75 = 81.64
				// 50, 100 = 70.71
				//
				// 75, 0 = 866.02
				// 75, 25 = 173.20
				// 75, 50 = 122.47
				// 75, 75 = 100
				// 75, 100 = 86.6
				//
				// 100, 0 = 1000
				// 100, 25 = 200
				// 100, 50 = 141.41
				// 100, 75 = 115.47
				// 100, 100 = 100
	
				$smart = 0;
				$cool = 0;
				$unbound = 0;
	
				$team_grade = 0;
				$given_grade = 0;
				$team_feedback = 0;
				$given_feedback = 0;
	
				$node = &$nodes[$magic['node']];
				if ( $node ) {
					$authors = $node['link']['author'];
					
					$node_grades_out = [];
					foreach ( $node['meta'] as $key => &$value ) {
						if ( strpos($key, 'grade-') === 0 && substr($key, strpos($key, '-out')) === '-out' ) {
							if ( count(explode('-', $key)) == 3 ) {
								$node_grades_out[] = $key;
							}
						}
					}
					$team_grade_value = count($grades);
					$given_grade_value = count(array_diff($grades_out, $node_grades_out));

	
					// ** Calculate Grades **
					$team_grades = max(0, grade_CountByNotNodeAuthor($node['id'], $authors) / $team_grade_value);
					$given_grades = max(0, grade_CountByNodeNotAuthor($node['id'], $authors) / $given_grade_value);	// historically there's a -1 here
	
					$bound_grade = sqrt(min(COOL_MAX_GRADES, $team_grades) * 100.0 / max(1.0, min(COOL_MAX_GRADES, $given_grades))) * 100.0 / 10.0;
					$unbound_grade = sqrt($team_grades * 100.0 / max(1.0, $given_grades)) * 100.0 / 10.0;
	
					// ** Calculate Feedback Score **
					$team_feedback = max(0, noteLove_CountBySuperNotNodeAuthorKnownNotAuthor($node['parent'], $node['id'], $authors) / FEEDBACK_PER_NOTE);
					$given_feedback = max(0, noteLove_CountBySuperNodeNotAuthorKnownNotAuthor($node['parent'], $node['id'], $authors) / FEEDBACK_PER_NOTE);
	
					$bound_feedback = sqrt(min(COOL_MAX_FEEDBACK, $team_feedback) * 100.0 / max(1.0, min(COOL_MAX_FEEDBACK, $given_feedback))) * 100.0 / 10.0;
					$unbound_feedback = sqrt($team_feedback * 100.0 / max(1.0, $given_feedback)) * 100.0 / 10.0;

					
					// Final
					$smart = $bound_grade;// + $bound_feedback;			// up to 1000 points
					$cool = $bound_grade + $bound_feedback;				// ratings only
//					$unbound = $unbound_grade + $unbound_feedback;		// unbound
				}
	
				// Prefer $magic['node'] to $node['id'] in case it fails to load
				$scores[] = [
					'node' => $magic['node'],
					'smart' => $smart,					// Smart Coolness
					'cool' => $cool,					// Unbound Coolness
					'grade' => $given_grades,			// How many grades received (Rescue Rangers)
					'given' => $team_grades,			// How many grades the team has given
					'feedback' => $team_feedback		// Quality of feedback team has given (i.e. people who are working hard)
				];
			}
	
			// Update scores
			$db->begin_transaction();
			foreach ( $scores as &$sc ) {
				nodeMagic_Update($sc['node'], 'smart', $sc['smart']);
				nodeMagic_Update($sc['node'], 'cool', $sc['cool']);
				nodeMagic_Update($sc['node'], 'grade', $sc['grade']);
				nodeMagic_Update($sc['node'], 'given', $sc['given']);
				nodeMagic_Update($sc['node'], 'feedback', $sc['feedback']);
			}
			$db->commit();
		}
	}
}
