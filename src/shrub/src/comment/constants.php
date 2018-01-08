<?php
/// @defgroup Comment
/// @ingroup Modules

/// @name Comment Tables (formerly "Note")
/// @addtogroup Tables
/// @{
const SH_TABLE_NOTE =				"note";
const SH_TABLE_NOTE_TREE =			"note_tree";		// Ancestry
const SH_TABLE_NOTE_VERSION =		"note_version";		// History
const SH_TABLE_NOTE_LOVE =			"note_love";
/// @}

///	@addtogroup CommentFlags
/// @{
const SH_COMMENT_FLAG_HIDDEN = 				1;	///< Comment has been hidden by default by a moderation action
const SH_COMMENT_FLAG_ANONYMOUS = 			2;	///< Comment is anonymous and author will be redacted for everyone but the actual author.
/// @}

global_AddTableConstant(
	'SH_TABLE_NOTE',
	'SH_TABLE_NOTE_TREE',
	'SH_TABLE_NOTE_VERSION',
	'SH_TABLE_NOTE_LOVE'
);
