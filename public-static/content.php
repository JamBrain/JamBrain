<?php

require_once __DIR__."/../src/shrub/src/core/core.php";

$RESPONSE = [];

function TrimName($name) {
	return coreSlugify_File(substr($name, 0, 32));
}

$in_part = core_GetAPIRequest();
$in_part = array_map('TrimName', $in_part);
$in_file = implode('/', $in_part);
$in_path = dirname($in_file);
$in_paths = explode('/', $in_path);
$in_basename = basename($in_file);

$in_ext_part = explode('.', $in_basename);
$in_ext_part = array_map('TrimName', $in_ext_part);
$in_name = array_shift($in_ext_part);
$in_ext = array_shift($in_ext_part);

$user_id = null;
$asset_id = null;
// Check if the path is to a legal user file
if ( ($in_paths_count = count($in_paths)) > 1 && $in_paths[$in_paths_count-1] == 'z' ) {
	$user_id = hexdec(strrev(implode('', array_slice($in_paths, 0, -1))));
	$RESPONSE['user'] = $user_id;

	$asset_id = hexdec($in_name);
	$RESPONSE['asset'] = $asset_id;
}

const SRC_DIR = 'raw';
const OUT_DIR = 'content';

$src_file = SRC_DIR.'/'.$in_path.'/'.$in_name.'.'.$in_ext;
$src_path = dirname($src_file);
$src_fullfile = __DIR__.'/'.$src_file;
$src_fullpath = __DIR__.'/'.$src_path;

$out_file = OUT_DIR.'/'.$in_file;
$out_path = dirname($out_file);
$out_fullfile = __DIR__.'/'.$out_file;
$out_fullpath = __DIR__.'/'.$out_path;

$src_relativefile = str_repeat('../', count(explode('/', $out_path))).$src_file;

// TODO: Sort extensions other than the input and output extensions, and symlink the file you should really be requesting

function Emit( $response ) {
	if ( !isset($response['status']) ) {
		$response = ['status' => 200] + $response;
	}

	http_response_code($response['status']);
	header('Content-Type: application/json');
	header('Cache-Control: no-cache, no-store, must-revalidate'); // HTTP 1.1.
	
	$json_format = JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES;
	if ( isset($_GET['pretty']) ) {
		$json_format |= JSON_PRETTY_PRINT;
	}

	echo json_encode($response, $json_format);

	exit;
}
function EmitError( $code, $message = null ) {
	global $RESPONSE;

	$ERROR = ['status' => $code];

	if ( $message )
		$ERROR['message'] = $message;
		
	$ERROR['data'] = $RESPONSE;

	Emit($ERROR);
}

// Make sure file exists, otherwise we're done
if ( !file_exists($src_file) ) {
	EmitError(404, 'File not found');
}


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
$out['debug'] = null;

function hasChanges( &$arr ) {
	foreach ( $arr as &$value ) {
		if ( !is_null($value) )
			return true;
	}
	return false;
}


function redirectToSelfAndExit() {
	global $out_file;
	
	// Force redirect to data
	header('Location: '.
		$_SERVER['REQUEST_SCHEME'].
		"://".
		$_SERVER['HTTP_HOST'].
		'/'.
		$out_file
	);

	exit;
}


// If there are any extensions left left, use them as arguments 
foreach( $in_ext_part as &$value ) {
	if ( strlen($value) < 1 ) {
		EmitError(400, "Invalid property");
	}
	else if ( $value == 'debug' ) {
		$out['debug'] = true;
	}
	else if ( array_search($value, IMAGE_TYPE) ) {
		$out['format'] = $value;
	}
	else if ( $value[0] == 'w' && ($v = intval(substr($value, 1))) > 0 ) {
		if ( $v > 4096 )
			EmitError(400, "Bad Width: '$v' (max 4096)");
		$out['width'] = $v;
	}
	else if ( $value[0] == 'h' && ($v = intval(substr($value, 1))) > 0 ) {
		if ( $v > 4096 )
			EmitError(400, "Bad Height: '$v' (max 4096)");
		$out['height'] = $v;
	}
	else if ( ($pos = strpos($value, 'x')) > 0 && ($w = intval($value)) > 0 && ($h = intval(substr($value, $pos+1))) > 0 ) {
//		$parts = explode('x', $value);
//		$w = intval($parts[0]);
//		$h = intval($parts[1]);
//		
//		if ( $w && $h ) {
			$out['width'] = $w;
			$out['height'] = $h;
//		}
	}
	else {
		EmitError(400, "Unknown or Invalid property: '$value'");
	}
}

// If a change has been requested
if ( hasChanges( $out ) ) {
	// Debug mode, output JSON instead
	if ( $out['debug'] ) {
		$RESPONSE['args'] = $in_ext_part;
		
		Emit($RESPONSE);
	}
	// Normal mode
	else {
		echo "hey";
	}
}
// No changes
else {
	if ( !file_exists($out_fullpath) )
		mkdir($out_fullpath, 0755, true);
	symlink($src_relativefile, $out_file);

	redirectToSelfAndExit();
}
