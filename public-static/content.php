<?php

require_once __DIR__."/../src/shrub/src/core/core.php";

$in_part = core_GetAPIRequest();
$in_path = implode('/', $in_part);
$in_basename = basename($in_path);
$in_dirname = dirname($in_path);

$ext_part = explode('.', $in_basename);
$file_name = array_shift($ext_part);
$file_ext = array_shift($ext_part);

$src_path = 'raw/'.$in_path;
$out_path = 'content/'.$in_path;

const IMAGE_TYPE = [
	'png',
	'jpg',
	'gif',
	'webp',		// Output only //
];


// Globals
$out['width'] = null;
$out['height'] = null;
$out['format'] = null;

function hasChanges( &$arr ) {
	foreach ( $arr as &$value ) {
		if ( !is_null($value) )
			return true;
	}
	return false;
}

function redirectToSelfAndExit() {
	global $in_path;
	
	// Force redirect to data
	header('Location: '.
		$_SERVER['REQUEST_SCHEME'].
		"://".
		$_SERVER['HTTP_HOST'].
		CONTENT_DIR.
		$in_path
	);

	exit;
}


// If there are any extensions left left, use them as arguments 
foreach( $ext_part as &$value ) {
	if ( array_search($value, IMAGE_TYPE) ) {
		$out['format'] = $value;
	}
	else if ( strpos($value, 'w') == 0 ) {
		$v = intval(substr($value, 1));
		if ( $v )
			$out['width'] = $v;
	}
	else if ( strpos($value, 'h') == 0 ) {
		$v = intval(substr($value, 1));
		if ( $v )
			$out['height'] = $v;
	}
	else if ( strpos($value, 'x') > 0 ) {
		$parts = explode('x', $value);
		$w = intval($parts[0]);
		$h = intval($parts[1]);
		
		if ( $w && $h ) {
			$out['width'] = $w;
			$out['height'] = $h;
		}
	}
}

var_dump($out);

if ( hasChanges( $out ) ) {
	
	
	echo $in_path;
	
	echo 'h..';
	
	if ( file_exists($out_path) ) {
		echo 'vvv';
	}
	if ( file_exists($src_path) ) {
		echo 'eee';
	}
}
else {
	if ( file_exists($src_path) ) {
		symlink( $src_path, $out_path );
		
		
	}
}
