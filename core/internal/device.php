<?php
include_once __DIR__ . "/../external/mobile-detect/Mobile_Detect.php";

/* core/lib/device.php - Detect what device  */

// NOTE: Prefer the device_UseXX() functions!! This way we can store a device config in a cookie. //

$__device_detect = new Mobile_Detect();


function device_UseMobile() {
	// Check Cookie //
	
	// If no Cookie //
	return device_IsMobile();
}

function device_UseHD() {
	return false;
}



function device_IsMobile() {
	global $__device_detect;
	return $__device_detect->isMobile();
}

function device_IsTablet() {
	global $__device_detect;
	return $__device_detect->isTablet();	
}

function device_IsHD() {
	return false;
}

?>