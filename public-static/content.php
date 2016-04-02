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

// NOTE: Input is sanitized. URLs can only be basic ASCII //
$action = core_ParseActionURL();
$in_path = implode('/',$action);
$in_file = basename($in_path);
$in_dir = dirname($in_path);

$part = explode('.',$in_file);
$part_count = count($part);
if ( $part_count < 2 ) {
	// bail if not fully qualified //
	die;
}
$part_id = &$part[0];
$part_ext = &$part[1];
$origin_file = $part_id.'.'.$part_ext;

// Operation //
if ( $part_count >= 3 ) {
	$part_op = &$part[2];
}
else {
	$part_op = null;
}

// Output Extension //
if ( $part_count >= 4 ) {
	$part_out_ext = &$part[3];
}
else {
	$part_out_ext = null;
}


$local_base = getcwd();

$local_path = $local_base.'/content/'.$in_path;
$origin_path = $local_base.'/raw/'.$in_dir.'/'.$origin_file;

$local_exists = file_exists($local_path);
$origin_exists = file_exists($origin_path);

// If file already exists, assume it was accessed via an invalid URL //
if ( $local_exists ) {
	// Force redirect to data //
	header('Location: '.
		$_SERVER['REQUEST_SCHEME'].
		"://".
		$_SERVER['HTTP_HOST'].
		"/content/".
		$in_path);
	exit;
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

echo $local_path,' | ',($local_exists ? 'yes':'no'),' | ',($origin_exists ? 'yes':'no');

//echo "<br>\n<br>\n";
//
echo implode('/',core_RemovePathDotsFromArray(['hey','you','..','me','.','huh']));


//print_r($_SERVER);