<?php
/**
 * Reserved
 *
 * @file
 */
 
$__reserved_words = [
	'a',	// Action URL //
	'api',
	'static',
	'tv',
	'admin','admins',
	'administrator','administrators',
	'moderator','moderators',
	'staff',
	'root',
	'feed','feeds',
	'user','users',
	'team','teams',
	'media',
	'game','games',
	'play',
	'save','load',
	'add','remove','insert','delete',
];

function isReservedWord( &$word ) {
	global $__reserved_words;
	return in_array($word,$__reserved_words);
}

?>
