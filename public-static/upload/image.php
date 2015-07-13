<?php
/*
	
*/

$self = substr($_SERVER['SCRIPT_NAME'],strrpos($_SERVER['SCRIPT_NAME'],'/')+1);
$base = substr($_SERVER['SCRIPT_NAME'],0,strrpos($_SERVER['SCRIPT_NAME'],'/'));
$image = isset($_SERVER['PATH_INFO']) ? $_SERVER['PATH_INFO'] : null;
//echo $base . "\n";
//
//print_r($_SERVER);
//print_r($_GET);



// If there is a query string, we do something //
if ( count($_GET) > 0 ) {
	
}
// No image path was specified //
else if ( empty($image) ) {
	echo "Cached: " . apcu_fetch('image-redirect');
}
// If no query string, simply emit a redirect to the image //
else {
	$host = "//" . $_SERVER['HTTP_HOST'];
	
	$cached = apcu_fetch('image-redirect');
	if ( !$cached )
		$cached = 1;
	else
		$cached++;
	apcu_store('image-redirect', $cached);

	header("Location: " . $host . $base . $image );
	die();
}
?>