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

function noteInComplete_GetByAuthor( $node ) {
	$notes = note_GetByAuthor($node);
	
	/*
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
	*/
	// it's a shame to do this, but this is how I need the data client side :(
	return array_values($notes);
}
