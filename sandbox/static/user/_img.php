<?php
/*
	a CloudFlare friendly Image Processing Script. 
	
	Given an image file in the URL, this will either:
	  * Emit a redirect (302) to the original file
	  * Resize and/or Crop the image, and return the result
	  
	Make sure the CloudFlare caching level is 'Standard' (i.e. include query strings).
	We rely on this, as the URL should still be a fully qualified URL to an image file.
	However, that image file is only generated and returned, and never stored. CloudFlare
	will automatically cache the file, and never attempt to fetch it again (unless expired).
*/

require_once __DIR__."/../../core/internal/core.php";
require_once __DIR__."/../../core/internal/cache.php";

// NOTE: As it turns out, Cloudflare doesn't always cache files. It often takes a few requests
//	before those files are cached. So instead, we may want to temporarily cache the generated
//	file to memory. Give the file a short lifetime, so not to waste RAM.
// 
//	To do this, use output buffering. Wrap the imagepng (or equiv) calls in an ob_start followed
//	by either an ob_end_flush or ob_end_clear. Call ob_get_contents to fetch the output.
//	http://php.net/manual/en/function.ob-start.php
//	http://stackoverflow.com/a/9371996

// On WebP:
// 	WebP is currently not supported by php's image library. It is mostly supported, but
// 	none of the calls like getimagesize will acknowledge them. 
// ALSO: WebP is currently only supported in Chrome, but Mozilla is *considering* support.
// 	Once Firefox officially gets WebP support, we will take steps to support it ourselves.
// 
// Additional details:
// https://gauntface.com/blog/2014/09/02/webp-support-with-imagemagick-and-php

// TODO: Support percentages (i.e. any time a number ends with a %, use that instead of pixels)
// TODO: Add sub-cropping (i.e. return 50% of the image, at offset 25%)
// TODO: Add sprites (i.e. given cell sizes, give me sprite 4)

define('CACHE_TTL_IMAGE',60);

$host = "//" . $_SERVER['HTTP_HOST'];
$self = substr($_SERVER['SCRIPT_NAME'],strrpos($_SERVER['SCRIPT_NAME'],'/')+1);
$base = substr($_SERVER['SCRIPT_NAME'],0,strrpos($_SERVER['SCRIPT_NAME'],'/'));
$image = "/" . implode('/',core_ParseActionURL());
//header("X-Real-URL: " . $image);

// To Crop or not to Crop //
$crop = isset($_GET['crop']);
// New Dimensions //
$out_width = isset($_GET['w']) ? intval($_GET['w']) : null;
$out_height = isset($_GET['h']) ? intval($_GET['h']) : null;
// Alignment Modifiers //
$top = isset($_GET['top']);
$left = isset($_GET['left']);
$right = isset($_GET['right']);
$bottom = isset($_GET['bottom']);
// Forced output types //
$jpeg = isset($_GET['jpeg']);
$png = isset($_GET['png']);

// Emit a CORS header, to avoid a Chrome warning //
// NOTE: This should really be done in the Apache config //
//header("Access-Control-Allow-Origin: *");	// Should probably not be so broad (*) //

// Confirm we have legal dimensions //
if ( (($out_width !== null) && ($out_width <= 0)) || (($out_height !== null) && ($out_height <= 0)) ) {
	header('X-Status-Reason: Bad width or height');
	http_response_code(400);
	die();
}

// We can only crop if we have both a width and a height //
if ( ($crop) && (($out_width == null) || ($out_height == null)) ) {
	header("X-Status-Reason: Can only crop with both a width and height");
	http_response_code(400);
	die();
}

// ** Image Output Size Limit ** //
// 2K Square //
const MAX_WIDTH = 2048;
const MAX_HEIGHT = 2048;
// 4K //
//const MAX_WIDTH = 3840;
//const MAX_HEIGHT = 2160;
// HXGA: https://en.wikipedia.org/wiki/4K_resolution#Streaming_video
//const MAX_WIDTH = 4096;
//const MAX_HEIGHT = 3072;
// 4K Square //
//const MAX_WIDTH = 4096;
//const MAX_HEIGHT = 4096;

// Constrain to Size Limit //
if ( $out_width > MAX_WIDTH ) $out_width = MAX_WIDTH;
if ( $out_height > MAX_HEIGHT ) $out_height = MAX_HEIGHT;

// If the operation we're performing changes the image size //
$change_size = $crop || $out_width || $out_height;
// If the operation we're performing changes the output //
$change_output = $jpeg || $png;

// If we were given an operation //
if ( $change_size || $change_output ) {
	$docroot = $_SERVER['DOCUMENT_ROOT'];
	$filename = $docroot.$base.$image;

	// TODO: add "p" character for percentages //
	// TODO: strip non-ascii characters from $image //
	$cache_key = "img\$" .
		$image .
		($out_width ? "\$w".$out_width : "") .
		($out_height ? "\$h".$out_height : "") .
		($crop ? "\$crop" : "") .
		($jpeg ? "\$jpeg" : "") .
		($png ? "\$png" : "") .
		"";

	// For compatibility with Memcached, keys must be:
	// - no more than to 250 characters
	// - not null (0x0)
	// - not space or tab (0x20,0x09)
	// - not newline or carriage-return (0x0a,0x0d)
	// - UTF-8 symbols are ok (but I want to avoid them)

	// If cached, output data //
	$cached = cache_Fetch($cache_key);
	if ( $cached ) {
		header($cached['header']);
		header("X-Cache-Key: ".$cache_key);
		echo $cached['data'];
		die;
	}

	// Otherwise, we have to generate the file. Check if it exists first. //	
	if ( file_exists($filename) ) {
		// Fetch File Info //
		$info = getimagesize( $filename );
		$in_width = $info[0];	// ['width'] is a string, but the index is not
		$in_height = $info[1];	// ['height'] is a string, but the index is not
		
		// If one of the dimensions is zero //
		if ( ($in_width === 0) || ($in_height === 0) ) {
			header('X-Status-Reason: Zero sized image');
			http_response_code(403);
			die();
		}
		
		// If dimensions are the same, emit a redirect //
		if ( ($in_width === $out_width) && ($in_height === $out_height) ) {
			header('X-Status-Reason: New dimensions are equal');
			header("Location: " . $host . $base . $image );
			die();
		}
		
		// If no changes, and forced output types are the same as original types //
		if ( !$change_size && $png && ($info['mime'] === "image/png") ) {
			header('X-Status-Reason: File is already PNG');
			header("Location: " . $host . $base . $image );
			die();
		}
		if ( !$change_size && $jpeg && ($info['mime'] === "image/jpeg") ) {
			header('X-Status-Reason: File is already JPEG');
			header("Location: " . $host . $base . $image );
			die();
		}
		
		//header('X-Image-Info: ' . return_r($info) );
		if ( $info ) {
			$raw_data = file_get_contents($filename);//,FILE_USE_INCLUDE_PATH);
			@$data = imagecreatefromstring($raw_data);
			$out_data = null;
			if ( !$data ) {
				header('X-Status-Reason: Problem reading image file');
				http_response_code(403);
				die();
			}
			
			// Image is now loaded. Do stuff //
			$in_ratio = floatval($in_width) / floatval($in_height);

			// Determine if file has an alpha channel (can emit smaller files if it doesn't) //
			$has_alpha = false;
			if ( $info['mime'] === "image/gif" ) {
				$has_alpha = (imagecolortransparent($data) != -1);
			}
			else if ( $info['mime'] === "image/png" ) {
				// Extract the Color Type byte from the PNG header //
				$png_color_type = ord($raw_data[25]);
				// 0 - Grayscale
				// 2 - RGB
				// 3 - Indexed (PLTE Chunk)
				// 4 - Grayscale + Alpha
				// 6 - RGB + Alpha
				
				// Simple 'has alpha' check //
				$has_alpha = $png_color_type >= 4;
				
				// TODO: If a PNG type has a "tRNS" chunk, it also has alpha.
				// 	http://www.libpng.org/pub/png/spec/1.2/PNG-Chunks.html#C.tRNS
			}
			header("X-Has-Alpha: " . ($has_alpha ? "true" : "false") );
			
			// Raw data no longer required (free memory) //
			unset($raw_data);
			
			// If cropping... //
			if ( $crop ) {
				$out_ratio = floatval($out_width) / floatval($out_height);
				
				// Input file is wider //
				if ( $in_ratio > $out_ratio ) {
					$in_y = 0;
					$in_h = $in_height;
					
					$in_w = round($in_height * $out_ratio);
					$in_x = ($in_width - $in_w) >> 1;	// div 2
				}
				// Input file is taller //
				else {
					$in_x = 0;
					$in_w = $in_width;
					
					$in_h = round($in_width / $out_ratio);
					$in_y = ($in_height - $in_h) >> 1;	// div 2
				}
				
				// Alignment Modifiers //
				if ( $top ) $in_y = 0;
				if ( $left ) $in_x = 0;
				if ( $right ) $in_x = $in_width - $in_w;
				if ( $bottom ) $in_y = $in_height - $in_h;
				
				$out_data = imagecreatetruecolor($out_width,$out_height);
				if ( $has_alpha ) {
					imagealphablending($out_data,false);
					imagesavealpha($out_data,true);
				}
				imagecopyresampled(
					$out_data,$data,
					0,0,
					$in_x,$in_y,
					$out_width,$out_height,
					$in_w,$in_h
				);
			}
			// If resizing... //
			else {
				// If resizing by one axis, calculate the other axis //
				if ( $out_width == null ) {
					$out_width = intval( floatval($out_height) * $in_ratio );
					
					// Reconstrain to limit //
					if ( $out_width > MAX_WIDTH ) {
						$out_width = MAX_WIDTH;
						$out_height = intval( floatval($out_width) / $in_ratio );
					}
				}
				else if ( $out_height == null ) {
					$out_height = intval( floatval($out_width) / $in_ratio );

					// Reconstrain to limit //
					if ( $out_height > MAX_HEIGHT ) {
						$out_height = MAX_HEIGHT;
						$out_width = intval( floatval($out_height) * $in_ratio );
					}
				}
				
				$out_data = imagecreatetruecolor($out_width,$out_height);
				if ( $has_alpha ) {
					imagealphablending($out_data,false);
					imagesavealpha($out_data,true);
				}
				imagecopyresampled(
					$out_data,$data,
					0,0,
					0,0,
					$out_width,$out_height,
					$in_width,$in_height
				);
			}

			// We're done with the original, so destroy it (to save memory) //
			imagedestroy($data);
			
			// Begin Output Buffering //
			ob_start();
			
			$content_type = "";
		
			// Output the data //
			if ( $jpeg || ($info['mime'] === "image/jpeg") ) {
				$content_type = 'Content-type: image/jpeg';
				header($content_type);
				imagejpeg($out_data);
			}
			// WebP support isn't stable, so it's disabled //
			//else if ( !$png && ($info['mime'] === "image/webp") ) {
			//	header('Content-type: image/webp');
			//	imagewebp($out_data);
			//}
			// Don't output GIFs, since we can't easily handle their alpha
			//else if ( !$png && ($info['mime'] === "image/gif") ) {
			//	header('Content-type: image/gif');
			//	imagegif($out_data);
			//}
			// Output a PNG for all other cases //
			else {
				$content_type = 'Content-type: image/png';
				header($content_type);
				imagepng($out_data);
			}
			
			cache_Store( $cache_key, ['header' => $content_type, 'data' => ob_get_flush() ], CACHE_TTL_IMAGE );
			
			// Finished //
			imagedestroy($out_data);
			die();
		}
		else {
			header('X-Status-Reason: Bad source image');
			http_response_code(403);
			die();
		}
	}
	// Oops! File doesn't exist //
	else {
		http_response_code(404);
		die();
	}
}
// No image path was specified //
else if ( empty($image) ) {
	// Debug: Report how many redirects //
	echo "Redirect Count: " . apcu_fetch('image-redirect');
}
// If no query string, simply emit a redirect to the image //
else {
	// Debug: Count how many redirects //
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
