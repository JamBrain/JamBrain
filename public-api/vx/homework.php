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

	//$RESPONSE['ev'] = $event;
	
	// Homework are tasks that we can detect when you're done
	$RESPONSE['homework'] = [];
	
	// Extras are tasks that a user decides when they are done, or not to do them at all
	$RESPONSE['extras'] = [];



	// Pre-Event Tasks that you can do any time during the pre-event, that should come before per-round tasks
	if ( ($mode >= 1) && ($mode <= 5) ) {
		$RESPONSE['homework'][] = [
			'task' => "Join event",
			'complete' => true,
			'link' => $event['path'],
		];
	}
	
	// Pre-Event Tasks that are per-round
	if ( $mode == 1 ) {
		$ideas_required = isset($event['meta']['theme-idea-limit']) ? intval($event['meta']['theme-idea-limit']) : 3;

		$ideas = themeIdea_Get($event['id'], $user_id);
		$idea_count = count($ideas);

		$RESPONSE['homework'][] = [
			'task' => "Suggest ".$ideas_required." themes",
			'complete' => ($idea_count >= $ideas_required),
			'detail' => $idea_count." of ".$ideas_required,
			'link' => $event['path'].'/theme',
		];
	}

	// Pre-Event Tasks that you can do any time during the pre-event, that should come after per-round tasks
	if ( ($mode >= 1) && ($mode <= 5) ) {
		$RESPONSE['extras'][] = [
			'task' => "Decide what tools you are going to use",
		];
		$RESPONSE['extras'][] = [
			'task' => "Make something with your tools",
			'detail' => "A quick warmup just to be sure your tools work as expected.",
		];
		$RESPONSE['extras'][] = [
			'task' => "Package up a download that others can try",
			'detail' => "We don't host downloads, so it's wise to figure out where you're going to do that.",
			'link' => '/events/ludum-dare/hosting-guide',
		];
		$RESPONSE['extras'][] = [
			'task' => "Submit it as a warmup submission",
			'detail' => "Submitting a warmup is not required. If this is your first event, it's a good idea to familiarize yourself with how submissions work.",
			'link' => $event['path'].'/warmup',
		];
	}

	// Post-Event Tasks

}],
]);


