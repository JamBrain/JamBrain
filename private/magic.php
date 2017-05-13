<?php
const CONFIG_PATH = "../src/shrub";
const SHRUB_PATH = "../src/shrub/src";

include_once __DIR__."/".CONFIG_PATH."/config.php";
require_once __DIR__."/".SHRUB_PATH."/cron.php";
require_once __DIR__."/".SHRUB_PATH."/node/node.php";
require_once __DIR__."/".SHRUB_PATH."/note/note.php";
require_once __DIR__."/".SHRUB_PATH."/grade/grade.php";

// This is a CRON job that regularly updates magic
const COOL_MAX_ITEMS_TO_ADD = 250;
const COOL_MAX_ITEMS_TO_CALC = 250;

// TODO: Adjust the maximum effectiveness as the weeks go by. Start with like 50 initially (more than enough), but let it go up after.
const COOL_MAX_GRADES = 50;//100;
const COOL_GRADES_PER_NODE = 8.0;
const COOL_MAX_FEEDBACK = 50;
const COOL_FEEDBACK_PER_NOTE = 1.0;

// Get the root node
$root = nodeComplete_GetById(1);

// Get current featured event
$featured_id = null;
if ( isset($root['meta']['featured']) )
	$featured_id = $root['meta']['featured']|0;

// As long as an event is featured, do coolness calculation
if ( $featured_id ) {
	$featured = nodeComplete_GetById($featured_id);
	
	// TODO: freak out if featured_id's don't match?
	
	// ** Find a bunch of games that don't yet have cool magic **
	{
		// Get all items with cool magic
		$cool_nodes = nodeMagic_GetNodeIdByParentName($featured_id, 'cool');
		
		// Get all published item ids
		$node_ids = node_GetIdByParentTypePublished($featured_id, 'item');
		
		$diff = array_diff($node_ids, $cool_nodes);
		
		$new_nodes = array_slice($diff, 0, COOL_MAX_ITEMS_TO_ADD);
		
		foreach ( $new_nodes as $key => &$value ) {
			$node = node_GetById($value);
			if ( $node ) {
				nodeMagic_Add(
					$node['id'],
					$node['parent'],
					$node['superparent'],
					$node['author'],
					0,	// score
					'cool'
				);
			}
		}
	}
	
	
	// ** Find a bunch of the oldest games with cool magic **
	{
		$cool = nodeMagic_GetOldestByParentName($featured_id, 'cool', COOL_MAX_ITEMS_TO_CALC);
		
		$db->begin_transaction();
		
		// Calculate their scores
		foreach ( $cool as &$magic ) {
			$node = nodeComplete_GetById($magic['node']);

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

			$score = 0;
			if ( $node ) {
				$authors = $node['link']['author'];

				// ** Calculate Grades **
				$team_grades = grade_CountByNotNodeAuthor($node['id'], $authors);				
				$given_grades = grade_CountByNodeNotAuthor($node['id'], $authors);

				$team_grades = max(0, min(COOL_MAX_GRADES, $team_grades / COOL_GRADES_PER_NODE));
				$given_grades = max(0, min(COOL_MAX_GRADES, $given_grades / COOL_GRADES_PER_NODE));		// historically there's a -1 here
				
				// Will be up to 1000 points (so long as the max is 100
				$grade = sqrt($team_grades * 100.0 / max(1.0, $given_grades)) * 100.0 / 10.0;

//				echo $magic['node']." $team_grades $given_grades: $grade\n";


				// ** Calculate Feedback Score **
				$team_feedback = noteLove_CountBySuperNotNodeAuthor($node['parent'], $node['id'], $authors);
				$given_feedback = noteLove_CountBySuperNodeNotAuthor($node['parent'], $node['id'], $authors);

				$team_feedback = max(0, min(COOL_MAX_FEEDBACK, $team_feedback / COOL_FEEDBACK_PER_NOTE));
				$given_feedback = max(0, min(COOL_MAX_FEEDBACK, $given_feedback / COOL_FEEDBACK_PER_NOTE));

				$feedback = sqrt($team_feedback * 100.0 / max(1.0, $given_feedback)) * 100.0 / 10.0;

				
				// Final
				$score = $grade + $feedback;
			}

			// Prefer $magic['node'] to $node['id'] in case it fails to load
			$updated = nodeMagic_Update($magic['node'], $magic['name'], $score);
		}

		$db->commit();
	}
}

