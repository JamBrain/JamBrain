<?php

// Filter comments through this function before returning to a user.
// Rewrites comments to add some convenience fields based on flags, and mask anonymous commentors.
function commentFlags_Filter( $comments, $current_user_id ) {
	$multi = is_array($comments);
	if ( !$multi )
		$comments = [$comments];

	foreach ( $comments as &$comment ) {
		if ( $comment['flags'] & SH_COMMENT_FLAG_ANONYMOUS ) {
			if ( $comment['author'] != $current_user_id ) {
				$comment['author'] = 0;
			}
			$comment['anonymous'] = true;
		}
		if ( $comment['flags'] & SH_COMMENT_FLAG_HIDDEN ) {
			$comment['hidden'] = true;
		}
	}

	if ( $multi )
		return array_values($comments);
	else
		return $comments ? $comments[0] : null;
}


