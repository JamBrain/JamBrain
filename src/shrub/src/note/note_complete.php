<?php

function noteComplete_GetByNode( $node ) {
	$notes = note_GetByNode($node);
	
	$loves = noteLove_CountByNode($node);
	
	// Populate Love
	foreach ( $notes as &$note ) {
		$note['love'] = 0;

		foreach ( $loves as $love ) {
			if ( $note['id'] === $love['note'] ) {
				$note['love'] = $love['count'];
				$note['love-timestamp'] = $love['timestamp'];
			}
		}
	}
	
	return $notes;
}
