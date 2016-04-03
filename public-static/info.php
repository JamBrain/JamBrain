<?php

require_once __DIR__."/../core/internal/core.php";
require_once __DIR__."/../core/internal/cache.php";

const IMAGE_TYPE = [
	'png',
	'jpg',
	'jpeg',
	'gif',
	'webp',
//	'bmp',
];
function is_image($ext) {
	return array_search($ext,IMAGE_TYPE) !== false;
}

const VIDEO_TYPE = [
	'mp4',
	'm4v',
	'webm',
//	'ogv',
//	'gifv',		// proxy
];
function is_video($ext) {
	return array_search($ext,VIDEO_TYPE) !== false;
}

const AUDIO_TYPE = [
	'mp3',
	'm4a',
	'aac',
//	'aac',
//	'ogg',
//	'wav',
//	'weba',		// proxy
];
function is_audio($ext) {
	return array_search($ext,AUDIO_TYPE) !== false;
}


// https://developer.mozilla.org/en-US/docs/Web/HTML/Supported_media_formats
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

$local_base = getcwd();

$local_path = $local_base.'/content/'.$in_path;
$origin_path = $local_base.'/raw/'.$in_dir.'/'.$origin_file;

$local_exists = file_exists($local_path);
$origin_exists = file_exists($origin_path);



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

//print_r($_SERVER);