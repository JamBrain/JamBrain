<?php

function noteFlags_Filter( $notes, $current_user_id ) {
	$multi = is_array($notes);
	if ( !$multi )
		$notes = [$notes];
		
	foreach ( $notes as &$note ) {
		if ( $note['flags'] & SH_NOTE_FLAG_ANONYMOUS ) {
			if ( $note['author'] != $current_user_id ) {
				$note['author'] = 0;
				$note['anonymous'] = true;
			}
		}
		if ( $note['flags'] & SH_NOTE_FLAG_HIDDEN ) {
			$note['hidden'] = true;
		}
	}

	if ( $multi )
		return array_values($notes);
	else
		return $notes ? $notes[0] : null;	
}


