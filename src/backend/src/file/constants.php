<?php
/// @defgroup File
/// @ingroup Modules

/// @name Asset Tables
/// @addtogroup Tables
/// @{
const SH_TABLE_FILE =					"file";
/// @}


const SH_FILE_STATUS_NULL =             0;
const SH_FILE_STATUS_ALLOCATED =        0x01;       // File record been allocated (or not if deleted)
const SH_FILE_STATUS_DEPRECATED =       0x02;       // File record is deprecated/hidden (an old version)
//                                      0x04;
const SH_FILE_STATUS_UPLOADED =         0x08;       // File record upload has been confirmed
//                                      0x10;
//                                      0x20;
const SH_FILE_STATUS_AKAMAI_ZIP =       0x40;       // Akamai flag: Serve from zip. Also suggests the hash will be incorrect


global_AddTableConstant( 
	'SH_TABLE_FILE'
);
