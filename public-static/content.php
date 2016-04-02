<?php

require_once __DIR__."/../core/internal/core.php";

// NOTE: By design, files in /content/ that are more than X days old can be purged!

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

//const CONVERT_TYPE = [
//	'bmp' => ['png'],
//	'webp' => ['png'],
//];

const ORIGIN_DIR = '/raw/';
const CONTENT_DIR = '/content/';

// NOTE: Input is sanitized. URLs can only be basic ASCII //
$in_part = core_ParseActionURL();
$in_path = implode('/',$in_part);
$in_file = basename($in_path);
$in_dir = dirname($in_path);

$file_part = explode('.',$in_file);
// Bail if our files don't have 2 parts //
if ( count($file_part) < 2 ) {
	exit;
}
$file_id = array_shift($file_part);
$file_ext = array_shift($file_part);
$origin_file = $file_id.'.'.$file_ext;

// Output Extension //
if ( count($file_part) >= 1 ) {
	// Always the last file extension //
	$file_out_ext = array_pop($file_part);
}
// If only 2 parts, then the output extension is irrelevent //
else {
	$file_out_ext = null;
}


$file_out_width = null;
$file_out_height = null;
$file_out_resize = false;
$file_out_fit = false;
$file_out_optimize = false;
$file_out_min_quality = 60;
$file_out_max_quality = 90;
$file_out_convert = $file_ext !== $file_out_ext;

// Check for other properties //
while ( count($file_part) ) {
	$var = array_shift($file_part);
	
	if ( $var[0] == 'w' ) {
		$file_out_width = intval(substr($var,1));
		$file_out_resize = true;
	}
	else if ( $var[0] == 'h' ) {
		$file_out_height = intval(substr($var,1));
		$file_out_resize = true;
	}
	else if ( $var == 'o' ) {
		$file_out_optimize = true;
	}
	else if ( $var[0] == 'o' ) {
		$file_out_optimize = true;
		$file_out_max_quality = intval(substr($var,1));
		if ( $file_out_max_quality > 100 ) {
			exit;
		}
		else if ( $file_out_max_quality < $file_out_min_quality ) {
			exit;
		}
	}
	else if ( $var == 'f' ) {
		$file_out_fit = true;
	}
}

// If fitting, limit fit size to smaller than limit //
const FIT_LIMIT = 1024;
if ( $file_out_fit ) {
	if ( $file_out_width > FIT_LIMIT )
		exit;
	if ( $file_out_height > FIT_LIMIT )
		exit;
}


$local_base = getcwd();

$local_dir = $local_base.CONTENT_DIR.$in_dir;
$local_path = $local_base.CONTENT_DIR.$in_path;

$origin_path = $local_base.ORIGIN_DIR.$in_dir.'/'.$origin_file;

function RedirectToSelfAndExit() {
	// Force redirect to data //
	header('Location: '.
		$_SERVER['REQUEST_SCHEME'].
		"://".
		$_SERVER['HTTP_HOST'].
		CONTENT_DIR.
		$GLOBALS['in_path']);
	// Exit //
	exit;
}

// If file already exists, assume it was accessed via an invalid URL //
if ( file_exists($local_path) ) {
	RedirectToSelfAndExit();
}

// If the original exists //
if ( file_exists($origin_path) ) {
	// Create Directory //
	if ( !file_exists($local_dir) ) {
		mkdir($local_dir,0644,true); 	// Recursive //
	}

	// If we have an output extension, then we know we're doing something //	
	if ( $file_out_ext ) { 
		// GIF to Video //
		if ( ($file_ext == 'gif') && is_video($file_out_ext) ) {
		}
		// Video to Video //
		else if ( is_video($file_ext) && is_video($file_out_ext) ) {
		}
		// Audio to Audio //
		else if ( is_audio($file_ext) && is_audio($file_out_ext) ) {	
		}
		// Image to Image //
		else if ( is_image($file_ext) && is_image($file_out_ext) ) {
			// Step 0: Read file //
			$data = file_get_contents($origin_path);
			
			// Step 1: Get File Info //
//			$src = &$data;
//			$src_info = getimagesizefromstring($src);
//			$src_w = array_shift($src_info);
//			$src_h = array_shift($src_info);
//			$src_type = array_shift($src_info);
			
			// Step 2: Resize, Crop, and/or Convert the file //
			if ( $file_out_resize || $file_out_convert ) {
				$option = '-strip';
				
				// http://www.imagemagick.org/Usage/resize/
				if ( $file_out_resize ) {
					if ( is_integer($file_out_width) && is_integer($file_out_height) ) {
						$option .= ' -resize '.$file_out_width.'x'.$file_out_height;
					}
					else if ( is_integer($file_out_width) ) {
						$option .= ' -resize '.$file_out_width;
					}
					else { //if ( is_integer($file_out_height) ) {
						$option .= ' -resize x'.$file_out_height;
					}
				}
				
				// NOTE: modifiers append to resize strings, so this must come next //
				if ( $file_out_fit ) {
					// Fit to dimensions //
					$option .= '^ -gravity center';
					$option .= ' -extent '.$file_out_width.'x'.$file_out_height;
				}
				else {
					// Don't allow resizing larger than original //
					$option .= '\>';
				}
				
				$cmd = proc_open(
					'convert - '.$option.' '.$file_out_ext.':-',
					[
						['pipe','r'],
						['pipe','w'],
						['pipe','w']
					],
					$pipes
				);
				
				if ($cmd) {
					fwrite($pipes[0],$data);
					fclose($pipes[0]);
					
					$data = stream_get_contents($pipes[1]);
					fclose($pipes[1]);
					// check if empty, then bring output error //
//					if ( count($data) ) {
//						echo stream_get_contents($pipes[2]);
//						exit;
//					}
					
					fclose($pipes[2]);
					proc_close($cmd);
				}
			}
			
			// Step 3: Optimize (if requested) //
			if ( $file_out_optimize ) {
				if ( ($file_out_ext == 'gif') ) {
					// http://www.lcdf.org/gifsicle/
				}
				else if ( ($file_out_ext == 'png') ) {
					// https://pngquant.org/
					// https://pngquant.org/php.html	
					$cmd = proc_open(
						'pngquant --quality='.$file_out_min_quality.'-'.$file_out_max_quality.' -',
						[
							['pipe','r'],
							['pipe','w'],
							['pipe','w']
						],
						$pipes
					);					

					if ($cmd) {
						fwrite($pipes[0],$data);
						fclose($pipes[0]);
						
						$data = stream_get_contents($pipes[1]);
						fclose($pipes[1]);
						
						fclose($pipes[2]);
						proc_close($cmd);
					}
				}
			}
			
			// Step 4: Write File //
			file_put_contents($local_path, $data);
			
			// Step 5: Redirect to self and exit //
			RedirectToSelfAndExit();
		}
	}
	// No operation, so create a symlink instead //
	else {
		// CLEVERNESS: $in_part is 1 more than expected, because it contains the file name
		$target = implode('/',array_fill(0,count($in_part),'..')).ORIGIN_DIR.$in_path;
		symlink( $target, $local_path );
		
		RedirectToSelfAndExit();
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