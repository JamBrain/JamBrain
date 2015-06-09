<?php
/**
 * List of Database Tables
 *
 * @file
*/

include_once __DIR__ . "/../config.php";

// Make sure CMW_TABLE_PREFIX exists.
if ( !defined('CMW_TABLE_PREFIX') ) {
	define('CMW_TABLE_PREFIX',"cmw_");	
}

// TODO: Once we upgrade to PHP 5.6, change the logic below.

define('CMW_TABLE_NODE',CMW_TABLE_PREFIX."node");//const CMW_TABLE_NODE = CMW_TABLE_PREFIX."node";
define('CMW_TABLE_LINK',CMW_TABLE_PREFIX."link");//const CMW_TABLE_LINK = CMW_TABLE_PREFIX."link";

define('CMW_TABLE_USER',CMW_TABLE_PREFIX."user");//const CMW_TABLE_USER = CMW_TABLE_PREFIX."user";
define('CMW_TABLE_LOVE',CMW_TABLE_PREFIX."love");//const CMW_TABLE_LOVE = CMW_TABLE_PREFIX."love";
define('CMW_TABLE_STAR',CMW_TABLE_PREFIX."star");//const CMW_TABLE_STAR = CMW_TABLE_PREFIX."star";
?>
