<?php

require_once __DIR__."/../core/internal/core.php";

// NOTE: By design, files in /content/ that are more than X days old can be purged!

// NOTE: FFMPEG for Ubuntu 14.04 requires a special repo: https://launchpad.net/~mc3man/+archive/ubuntu/trusty-media
//   Newer versions of Ubuntu do not require this. 
//   FFMPEG was mainline, then it was AVCONV, now it's FFMPEG again.

const IMAGE_TYPE = [
	'png',
	'jpg',
	'jpeg',
	'gif',
	'webp',
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
//	'weba',		// proxy
];
function is_audio($ext) {
	return array_search($ext,AUDIO_TYPE) !== false;
}


function EmitErrorAndExit($err,$code=404) {
	http_response_code($code);
	header("Content-Type: text/plain"); 
	echo $err;
	exit;
}


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
	EmitErrorAndExit("");
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

$file_out_args = count($file_part);
$file_out_width = null;
$file_out_height = null;
$file_out_resize = false;
$file_out_fit = false;
$file_out_optimize = false;
//$file_out_min_quality = 60;
//$file_out_max_quality = 95;
$file_out_thumbnail = false;
$file_out_convert = $file_ext !== $file_out_ext;

// Check for other properties //
while ( count($file_part) ) {
	$var = array_shift($file_part);
	
	if ( $var[0] == 'w' ) {
		$file_out_width = intval(substr($var,1));
		if ( $file_out_width <= 0 )
			EmitErrorAndExit("ERROR: width <= 0");
		$file_out_resize = true;
	}
	else if ( $var[0] == 'h' ) {
		$file_out_height = intval(substr($var,1));
		if ( $file_out_height <= 0 )
			EmitErrorAndExit("ERROR: height <= 0");
		$file_out_resize = true;
	}
	else if ( $var == 'o' ) {
		$file_out_optimize = true;
	}
//	else if ( $var == 't' ) {
//		$file_out_thumbnail = true;
//	}
//	else if ( $var[0] == 'o' ) {
//		$file_out_optimize = true;
//		$file_out_max_quality = intval(substr($var,1));
//		if ( $file_out_max_quality > 100 ) {
//			EmitErrorAndExit("ERROR: quality > 100");
//		}
//		else if ( $file_out_max_quality < $file_out_min_quality ) {
//			EmitErrorAndExit("ERROR: quality < min");
//		}
//	}
	else if ( $var == 'f' ) {
		$file_out_fit = true;
	}
}

// If fitting... //
const FIT_LIMIT = 1024;
if ( $file_out_fit ) {
	// Limit fit size to smaller than the fit limit //
	if ( $file_out_width > FIT_LIMIT )
		EmitErrorAndExit("ERROR: width > fit limit");
	if ( $file_out_height > FIT_LIMIT )
		EmitErrorAndExit("ERROR: width > fit limit");

	// Fit requires both dimensions //
	if ( !is_integer($file_out_width) || !is_integer($file_out_height) )
		EmitErrorAndExit("ERROR: fit missing width or height");
}


$local_base = getcwd();

$local_dir = $local_base.CONTENT_DIR.$in_dir;
$local_path = $local_base.CONTENT_DIR.$in_path;

$origin_path = $local_base.ORIGIN_DIR.$in_dir.'/'.$origin_file;

function RedirectToSelfAndExit() {
	global $in_path;
	
	// Force redirect to data //
	header('Location: '.
		$_SERVER['REQUEST_SCHEME'].
		"://".
		$_SERVER['HTTP_HOST'].
		CONTENT_DIR.
		$in_path
	);
	// Exit //
	exit;
}

// If file already exists, assume it was accessed via an invalid URL (i.e. the php script) //
if ( file_exists($local_path) ) {
	RedirectToSelfAndExit();
}


function get_media_info($file) {
	$handle = popen(
		'ffprobe -print_format json -show_format -loglevel quiet -show_streams '.$file,
		'r'
	);
	
	$data = stream_get_contents($handle);
	pclose($handle);
	
	return json_decode($data,true);
}

// thumbnail
// https://trac.ffmpeg.org/wiki/Create%20a%20thumbnail%20image%20every%20X%20seconds%20of%20the%20video

// tips
// https://trac.ffmpeg.org/wiki/FFprobeTips


function do_proc($cmd,&$data) {
	$proc = proc_open(
		$cmd,
		[
			['pipe','r'],
			['pipe','w'],
			['pipe','w']
		],
		$pipes
	);
	
	if ($proc) {
		fwrite($pipes[0],$data);
		fclose($pipes[0]);
		$ret = stream_get_contents($pipes[1]);
		fclose($pipes[1]);
		$err = stream_get_contents($pipes[2]);
		fclose($pipes[2]);
		$code = proc_close($proc);
		
		if ( $code ) {
			EmitErrorAndExit('PROC ERROR ['.$code.']: '.$err);
		}
		
		return $ret;
	}
	return null;
}

function do_symlink() {
	global $in_part, $in_path, $local_path;
	// CLEVERNESS: $in_part is 1 more than expected, because it contains the file name
	$target = implode('/',array_fill(0,count($in_part),'..')).ORIGIN_DIR.$in_path;
	symlink( $target, $local_path );
	
}

// If the original exists //
if ( file_exists($origin_path) ) {
	// Create Directory //
	if ( !file_exists($local_dir) ) {
		mkdir($local_dir,0644,true); 	// Recursive //
	}

	// If we have an output extension, then we know we're doing something //	
	if ( $file_out_ext ) { 
		// Audio to Audio //
		if ( is_audio($file_ext) && is_audio($file_out_ext) ) {
			// Bail if using any extra arguments (so we don't regenerate useless files) //
//			if ( $file_out_args > 0 )
//				EmitErrorAndExit("ERROR: A2A extra Args");

//			header("Content-Type: text/plain"); 
//			print_r( get_media_info($origin_path) );

			EmitErrorAndExit("ERROR: A2A conversion not supported");
			
			// Video to Audio //
			// ffmpeg -i input-video.avi -vn -acodec copy output-audio.aac
			// -vn = no video
			// -acoced copy = copy the audio
		}
		// GIF to Video //
		else if ( ($file_ext == 'gif') && is_video($file_out_ext) ) {
			// Bail if using any extra arguments (so we don't regenerate useless files) //
//			if ( $file_out_args > 0 )
//				EmitErrorAndExit("ERROR: G2V extra Args");
				
			// TODO
			EmitErrorAndExit("ERROR: G2V conversion not supported");
		}
		// Video to Video //
		else if ( is_video($file_ext) && is_video($file_out_ext) ) {
			// Bail if using any extra arguments (so we don't regenerate useless files) //
//			if ( $file_out_args > 0 )
//				EmitErrorAndExit("ERROR: V2V extra Args");
				
			// TODO
//			header("Content-Type: text/plain"); 
//			print_r( get_media_info($origin_path) );

			EmitErrorAndExit("ERROR: V2V conversion not supported");
		}
		// Video to Image (Thumbnails) //
		else if ( is_video($file_ext) && is_image($file_out_ext) ) {
			EmitErrorAndExit("ERROR: V2I conversion not supported");

//			// Generate Thumbnail (PNG for good reference quality) //
//			$data = do_proc(
//				'ffmpeg -i '.$origin_path.' -loglevel quiet -vframes 1 -f apng pipe:1',
//				$data
//			);
//
//			$option = '-strip';
//			$option .= ' -resize "50%"';	// hack //
//			
//			// Run ImageMagick //
//			$data = do_proc(
//				'convert - '.$option.' '.$file_out_ext.':-',
//				$data
//			);
//
//			// Step 4: Write File //
//			file_put_contents($local_path, $data);
//			
//			// Step 5: Redirect to self and exit //
//			RedirectToSelfAndExit();
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
				// Strip extra data //
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
				}
				
				// Run ImageMagick //
				$data = do_proc(
					'convert - '.$option.' '.$file_out_ext.':-',
					$data
				);
			}
			
			// Step 3: Optimize (if requested) //
			if ( $file_out_optimize ) {
				if ( ($file_out_ext == 'gif') ) {
					// http://www.lcdf.org/gifsicle/
					EmitErrorAndExit("ERROR: Unsupported optimizer GIF");
				}
				else if ( ($file_out_ext == 'png') ) {
					// https://pngquant.org/
					// https://pngquant.org/php.html
					
					$file_out_min_quality = 60;
					$file_out_max_quality = 95;

					$data = do_proc(
						'pngquant --quality='.$file_out_min_quality.'-'.$file_out_max_quality.' -',
						$data
					);
				}
//				else if ( ($file_out_ext == 'jpg') || ($file_out_ext == 'jpeg') ) {
//					EmitErrorAndExit("ERROR: Unsupported optimizer JPEG");
//				}
//				else if ( ($file_out_ext == 'webp') ) {
//					EmitErrorAndExit("ERROR: Unsupported optimizer WEBP");
//				}
			}
			
			// Step 4: Write File //
			file_put_contents($local_path, $data);
			
			// Step 5: Redirect to self and exit //
			RedirectToSelfAndExit();
		}
	}
	// No operation, so create a symlink instead //
	else {
		do_symlink();
				
		RedirectToSelfAndExit();
	}

	EmitErrorAndExit("ERROR: Unknown op");
}

EmitErrorAndExit("ERROR: Origin not found");
