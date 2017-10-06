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
	
	// it's a shame to do this, but this is how I need the data client side :(
	return array_values($notes);
}

function noteComplete_Get( $ids ) {
	$multi = is_array($ids);
	if ( !$multi )
		$ids = [$ids];
		
	$notes = note_GetById($ids);
	if ( $notes ) {
		$loves = noteLove_GetByNote($ids);
	
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
		
		if ( $multi )
			return array_values($notes);
		else
			return $notes ? $notes[0] : null;		
	}
	return null;
}
