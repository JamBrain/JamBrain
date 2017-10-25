<?php
/// @defgroup Notification
/// @ingroup Modules


///	@addtogroup NotificationTypes
/// @name Notification Types
/// @{
const SH_NOTIFICATION_NOTE =			'note';
const SH_NOTIFICATION_MENTION =			'mention';
/// @}



/// @name Notification Tables (notify on replies in thread, etc.)
/// @addtogroup Tables
/// @{
const SH_TABLE_NOTIFICATION =	    "notification";
/// @}

global_AddTableConstant( 
	'SH_TABLE_NOTIFICATION'
);
