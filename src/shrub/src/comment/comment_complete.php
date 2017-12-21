<?php

function commentComplete_GetByNode( $node ) {
	$comments = comment_GetByNode($node);

	$loves = commentLove_CountByNode($node);

	// Populate Love
	foreach ( $comments as &$comment ) {
		$comment['love'] = 0;

		foreach ( $loves as $love ) {
			if ( $comment['id'] === $love['note'] ) {
				$comment['love'] = $love['count'];
				$comment['love-timestamp'] = $love['timestamp'];
			}
		}
	}

	// it's a shame to do this, but this is how I need the data client side :(
	return array_values($comments);
}

function commentComplete_Get( $ids ) {
	$multi = is_array($ids);
	if ( !$multi )
		$ids = [$ids];

	$comments = comment_GetById($ids);
	if ( $comments ) {
		$loves = commentLove_GetByComment($ids);

		// Populate Love
		foreach ( $comments as &$comment ) {
			$comment['love'] = 0;

			foreach ( $loves as $love ) {
				if ( $comment['id'] === $love['note'] ) {
					$comment['love'] = $love['count'];
					$comment['love-timestamp'] = $love['timestamp'];
				}
			}
		}

		if ( $multi )
			return array_values($comments);
		else
			return $comments ? $comments[0] : null;
	}
	return null;
}
