<?php
require_once __DIR__."/../config.php";

include_once __DIR__."/".CONFIG_PATH."config.php";
require_once __DIR__."/".SHRUB_PATH."api.php";
require_once __DIR__."/".SHRUB_PATH."node/node.php";
require_once __DIR__."/".SHRUB_PATH."theme/theme.php";

function GetActiveEvent() {
	$root = nodeCache_GetById(1);
	if ( $root && isset($root['meta']) && isset($root['meta']['featured']) ) {
		return nodeCache_GetById(intval($root['meta']['featured']));
	}
	return null;
}

api_Exec([
["homework/get", API_GET | API_AUTH, API_CHARGE_1, function(&$RESPONSE) {
	$event = GetActiveEvent();
	$user_id = userAuth_GetID();
	
	$mode = intval($event['meta']['theme-mode']);
	$making_what = substr(strrchr($event['meta']['can-create'], '/'), 1);

	//$RESPONSE['ev'] = $event;
	
	$RESPONSE['homework'] = [];

	// task: brief description of task
	// detail: detailed description of task
	// link: a URL we should recommend for doing the task
	// complete: if task is complete
	// user: if task is something the user decides they've finished
	// children: tasks that are grouped under this task

	// Pre-Event Tasks that you can do any time during the pre-event, that should come before per-round tasks
	if ( ($mode >= 1) && ($mode <= 5) ) {
		$RESPONSE['homework'][] = [
			'task' => "Join event",
			'link' => $event['path'],
			'complete' => true,
		];
	}
	
	// Pre-Event Tasks that are per-round
	if ( $mode == 1 ) {
		$ideas_required = isset($event['meta']['theme-idea-limit']) ? intval($event['meta']['theme-idea-limit']) : 3;

		$ideas = themeIdea_Get($event['id'], $user_id);
		$idea_count = count($ideas);

		$RESPONSE['homework'][] = [
			'task' => "Suggest ".$ideas_required." themes",
			'detail' => $idea_count." of ".$ideas_required,
			'link' => $event['path'].'/theme',
			'complete' => ($idea_count >= $ideas_required),
		];
	}

	// Pre-Event Tasks that you can do any time during the pre-event, that should come after per-round tasks
	if ( ($mode >= 1) && ($mode <= 5) ) {
		// TODO: group these under a parent task "submit a warmup game"
		$RESPONSE['homework'][] = [
			'task' => "Decide what tools you are going to use",
			'user' => true,		// the user decides when they are done
		];
		
		// TODO: detect when the user has submitted a warmup game		
		$submitted_warmup = false;
		$completed_warmup = $submitted_warmup;
		
		$RESPONSE['homework'][] = [
			'task' => "Make a warmup ".$making_what,
			'children' => [
				[
					'task' => "Make something with your tools",
					'detail' => "A quick warmup just to be sure your tools work as expected.",
					'user' => true,		// the user decides when they are done
				],
				[
					'task' => "Package up a download that others can try",
					'detail' => "We don't host downloads, so it's wise to figure out where you're going to do that.",
					'link' => '/events/ludum-dare/hosting-guide',
					'user' => true,		// the user decides when they are done
				],
				[
					'task' => "Submit your warmup ".$making_what,
					'detail' => "Submitting a warmup is not required. If this is your first event, it's a good idea to familiarize yourself with how submissions work.",
					'link' => $event['path'].'/warmup',
					'complete' => $submitted_warmup,
				],
			],
			'complete' => $completed_warmup,
		];
	}

	// Post-Event Tasks

}],
]);


