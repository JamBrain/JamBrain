<?php
/** @file web.php 
	@brief a General Include for making Web pages 
**/

// Benchmarking //
$_CORE_SCRIPT_TIMER = microtime(true);

// Detect Internet Explorer -- http://www.useragentstring.com/pages/Internet%20Explorer/
$MSIE_VER = 0;
if ( isset($_SERVER['HTTP_USER_AGENT']) && strpos($_SERVER['HTTP_USER_AGENT'], "MSIE") !== false ) {	// Faster, Broadphase //
	if ( preg_match('/(?i)msie ([0-9]+)/',$_SERVER['HTTP_USER_AGENT'], $MATCHES) ) {
		$MSIE_VER = intval($MATCHES[1]);
	}
	unset($MATCHES);
}
// NOTE: Internet Explorer 11+ do not set MSIE string. Instead, they set Trident. //
//$TRIDENT_VER = 0;
//if ( preg_match('/(?i)trident\/([0-9]+)/',$_SERVER['HTTP_USER_AGENT'], $MATCHES) ) {
//	$TRIDENT_VER = intval($MATCHES[1]);
//}
//unset($MATCHES);

// Check Version, and die if a bad IE version //
const _MIN_MSIE_VER = 11;
if ( $MSIE_VER && ($MSIE_VER < _MIN_MSIE_VER) ) {
	echo "<strong>FATAL ERROR</strong>: Unsafe browser Internet Explorer ".$MSIE_VER." detected (Requires Internet Explorer "._MIN_MSIE_VER." or better).\n<br>";
	echo "<br>";
	echo 'Please upgrade, or switch to another browser: <a href="http://browsehappy.com/">http://browsehappy.com/</a><br>';
	echo "<br>";
	echo "If you're getting this message in error, contact webmaster@".$_SERVER['HTTP_HOST'];
	exit();
}

require_once __DIR__."/core/internal/html.php";	
require_once __DIR__."/core/internal/core.php";

//require_once __DIR__."/core/users.php";			// User and Sessions
require_once __DIR__."/core/template.php";		// Templates and Themes
//require_once __DIR__."/core/internal/device.php";	// What kind of device is this? (Mobile, Tablet, PC)

?>
