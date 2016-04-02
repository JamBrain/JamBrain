<?php

require_once __DIR__."/../core/internal/core.php";

const MIME_TYPE = [
	'png' => 'image/png',
	'jpg' => 'image/jpeg',
	'jpeg' => 'image/jpeg',
	'gif' => 'image/gif',
//	'webp' => 'image/webp',		// Chrome Only //

	'mp3' => 'audio/mpeg',
	'm4a' => 'audio/mp4',
	'aac' => 'audio/mp4',		// for Firefox compatibility //
//	'aac' => 'audio/aac',		// Unsupported MIME type by Firefox //
//	'ogg' => 'audio/ogg',		// Firefox+Chrome Only (no Safari, IE, Edge) //
//	'wav' => 'audio/wav',		// Unsupported in IE (works in Edge) //

	'mp4' => 'video/mp4',
	'm4v' => 'video/mp4',
	'webm' => 'video/webm',
//	'ogv' => 'video/ogg',
//	'gifv' => '',				// Not actually real. You should reference mp4 and webm instead 

//	'json' => 'application/json',
//	'jsonp' => 'application/javascript',
];

const CONVERT_TYPE = [
	'bmp' => ['png'],
	'webp' => ['png'],
];

const ORIGIN_DIR = '/raw/';
const CONTENT_DIR = '/content/';

// NOTE: Input is sanitized. URLs can only be basic ASCII //
$in_part = core_ParseActionURL();
$in_path = implode('/',$in_part);
$in_file = basename($in_path);
$in_dir = dirname($in_path);

$file_part = explode('.',$in_file);
$file_part_count = count($file_part);
if ( $file_part_count < 2 ) {
	// bail if not fully qualified //
	exit;
}
$file_part_id = &$file_part[0];
$file_part_ext = &$file_part[1];
$origin_file = $file_part_id.'.'.$file_part_ext;

// Operation //
if ( $file_part_count >= 3 ) {
	$file_part_op = &$file_part[2];
}
else {
	$file_part_op = null;
}

// Output Extension //
if ( $file_part_count >= 4 ) {
	$file_part_out_ext = &$file_part[3];
}
else {
	$file_part_out_ext = null;
}


$local_base = getcwd();

$local_dir = $local_base.CONTENT_DIR.$in_dir;
$local_path = $local_base.CONTENT_DIR.$in_path;

$origin_path = $local_base.ORIGIN_DIR.$in_dir.'/'.$origin_file;

function RedirectToSelf() {
	// Force redirect to data //
	header('Location: '.
		$_SERVER['REQUEST_SCHEME'].
		"://".
		$_SERVER['HTTP_HOST'].
		CONTENT_DIR.
		$GLOBALS['in_path']);
}

// If file already exists, assume it was accessed via an invalid URL //
if ( file_exists($local_path) ) {
	RedirectToSelf();
	exit;
}

// If the original exists //
if ( file_exists($origin_path) ) {
	// Create Directory //
	if ( !file_exists($local_dir) ) {
		mkdir($local_dir,0644,true);
	}
	
	// if OP is null, then we're not doing any conversion, just linking //
	if ( is_null($file_part_op) ) {
		// CLEVERNESS: $in_part is 1 more than expected, because it contains the file name
		$target = implode('/',array_fill(0,count($in_part),'..')).ORIGIN_DIR.$in_path;
		symlink( $target, $local_path );
		
		RedirectToSelf();
		exit;
	}
}


	//$_SERVER['REQUEST_URI']);
//	if ( isset(MIME_TYPE[$part_ext]) ) {
//		header("Content-type: ".MIME_TYPE[$part_ext]);
//		
//	}


//$protocol = $_SERVER['REQUEST_SCHEME'];
//$host = "//" . $_SERVER['HTTP_HOST'];
//$self = substr($_SERVER['SCRIPT_NAME'],strrpos($_SERVER['SCRIPT_NAME'],'/')+1);
//$base = substr($_SERVER['SCRIPT_NAME'],0,strrpos($_SERVER['SCRIPT_NAME'],'/'));
//$image = "/" . implode('/',$action);

//$request_exists = file_exists($basedir.'/content'.$image);
//$original_exists = file_exists($basedir.'/raw'.$image);

//echo $protocol,' | ',$host,' | ',$self,' | ',$base,' | ',$image;
//
//echo "<br>\n<br>\n";

//echo $local_path,' | ',($local_exists ? 'yes':'no'),' | ',($origin_exists ? 'yes':'no');

//echo "<br>\n<br>\n";
//
//echo implode('/',core_RemovePathDotsFromArray(['hey','you','..','me','.','huh']));


//print_r($_SERVER);