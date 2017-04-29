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
$out['fit'] = null;
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


// If there are any extensions left left, use them as arguments 
foreach( $in_ext_part as &$value ) {
	if ( strlen($value) < 1 ) {
		EmitError(400, "Invalid property");
	}
	else if ( $value == 'debug' ) {
		$out['debug'] = true;
	}
	else if ( $value == 'fit' ) {
		$out['fit'] = true;
	}
	else if ( array_search($value, IMAGE_TYPE) !== false ) {
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
		if ( $w > 4096 )
			EmitError(400, "Bad Width: '$w' (max 4096)");
		if ( $h > 4096 )
			EmitError(400, "Bad Height: '$h' (max 4096)");

		$out['width'] = $w;
		$out['height'] = $h;
	}
	else {
		EmitError(400, "Unknown or Invalid property: '$value'");
	}
}

// If a change has been requested
if ( hasChanges($out) ) {
	// confirm that final extension is an output format
	if ( ($of = $in_paths[count($in_paths)-1]) && ($of == 'debug' || array_search($of, IMAGE_TYPE) !== false) ) {
		EmitError(400, "Final extension must be an output format. Invalid format '$of'");
	}
	
	$data = null;
	$in = $src_fullfile;
	
	// Step 0: Read file
	if ( /*$src_is_video ||*/ $in_ext == 'gif' ) {
		$dummy = "";
		$data = do_proc(
			'ffmpeg -i '.$in.' -loglevel quiet -vframes 1 -f apng pipe:1',
			$dummy
		);
		// Force conversion (even though it should be the case) //
		$file_out_convert = true;
	}
	else if ( $in_ext && array_search($in_ext, IMAGE_TYPE) !== false ) {
		$data = file_get_contents($in);
	}
	else {
		EmitError(400, "Unsupported input");
	}
	
	// Step 1: Parse file
	$image_info = getimagesizefromstring($data);
//	$image_info = getimagesize($src_fullfile);
	
	if ( $image_info ) {
		// It's faster to re-extract the data then ask the database
		$asset = [
			'width' => $image_info[0],
			'height' => $image_info[1],
			'mime' => $image_info['mime'],
			'size' => strlen($data),	// getimagesizefromstring only
		];
		
		$RESPONSE['asset'] = $asset;

		// Step 2: Resize, Crop, and/or Convert the file
		if ( $out['width'] || $out['height'] || $out['format'] != $in_ext ) {
			// Strip extra data //
			$option = '-strip';
			
			// http://www.imagemagick.org/Usage/resize/
			if ( $out['width'] || $out['height'] ) {
				if ( $out['width'] && $out['height'] ) {
					$option .= ' -resize '.$out['width'].'x'.$out['height'];
				}
				else if ( $out['width'] ) {
					$option .= ' -resize '.$out['width'];
				}
				else if ( $out['height'] ) {
					$option .= ' -resize x'.$out['width'];
				}

				// NOTE: modifiers append to resize strings, so this must come next //
				if ( $out['fit'] ) {
					// Fit to dimensions //
					$option .= '^ -gravity center';
					$option .= ' -extent '.$out['width'].'x'.$out['height'];
				}
				else {
					// Don't allow resizing larger than original //
					$option .= '\>';
				}
			}
			
			// Run ImageMagick //
			// NOTE: This will fail if there exists a file named "png:-", "webp:-", etc.
			$data = do_proc(
				'convert - '.$option.' '.$out['format'].':-',
				$data
			);
		}

		// Step 3: Optimize
		if ( true ) {
//			if ( ($file_out_ext == 'gif') ) {
//				// http://www.lcdf.org/gifsicle/
//				EmitErrorAndExit("ERROR: Unsupported optimizer GIF");
//			}
//			else 
			if ( ($out['format'] == 'png') ) {
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

		// Debug mode, output JSON instead of an image
		if ( $out['debug'] ) {
			$RESPONSE['args'] = $in_ext_part;
			
			Emit($RESPONSE);
		}
		// Image output mode
		else {
			// Step 4: Write File
			if ( !file_exists($out_fullpath) ) {
				mkdir($out_fullpath, 0755, true);
			}
			file_put_contents($out_file, $data);

			// Step 5: Redirect to self and exit
			redirectToSelfAndExit();
		}
	}
	else {
		EmitError(400, "Not an valid transformable content type");
	}
}
// No changes
else {
	if ( !file_exists($out_fullpath) ) {
		mkdir($out_fullpath, 0755, true);
	}
	symlink($src_relativefile, $out_file);

	redirectToSelfAndExit();
}
