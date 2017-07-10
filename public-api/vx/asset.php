<?php
require_once __DIR__."/../config.php";

include_once __DIR__."/".CONFIG_PATH."config.php";
require_once __DIR__."/".SHRUB_PATH."api.php";
require_once __DIR__."/".SHRUB_PATH."node/node.php";
require_once __DIR__."/".SHRUB_PATH."asset/asset.php";

json_Begin();

const TARGET_FOLDER = '/../../public-static/raw';

const CACHE_KEY_PREFIX = "SH!ASSET!";
const CACHE_TTL = 60;

const IMAGE_CONSTANTS = [
	IMAGETYPE_PNG => 'png',
	IMAGETYPE_GIF => 'gif',
	IMAGETYPE_JPEG => 'jpg',

//	IMAGETYPE_WEBP => 'webp',		// Requires 7.1
];

const MAX_IMAGE_WIDTH = 4096;
const MAX_IMAGE_HEIGHT = MAX_IMAGE_WIDTH;

		
// ********************* //
// These two functions come from here: http://stackoverflow.com/a/25370978/5678759
// Which if I understand is lifted right from Drupal

// Returns a file size limit in bytes based on the PHP upload_max_filesize
// and post_max_size
function file_upload_max_size() {
	static $max_size = -1;

	if ($max_size < 0) {
		// Start with post_max_size.
		$max_size = parse_size(ini_get('post_max_size'));

		// If upload_max_size is less, then reduce. Except if upload_max_size is
		// zero, which indicates no limit.
		$upload_max = parse_size(ini_get('upload_max_filesize'));
		if ($upload_max > 0 && $upload_max < $max_size) {
			$max_size = $upload_max;
		}
	}
	return $max_size;
}
function parse_size($size) {
	$unit = preg_replace('/[^bkmgtpezy]/i', '', $size); // Remove the non-unit characters from the size.
	$size = preg_replace('/[^0-9\.]/', '', $size); // Remove the non-numeric characters from the size.
	if ($unit) {
		// Find the position of the unit in the ordered string which is the power of magnitude to multiply a kilobyte by.
		return round($size * pow(1024, stripos('bkmgtpezy', $unit[0])));
	}
	else {
		return round($size);
	}
}
// ********************* //

// Do Actions
$action = json_ArgShift();
switch ( $action ) {
	case 'stats': //asset/stats
		json_ValidateHTTPMethod('GET');
		//$event_id = intval(json_ArgGet(0));

		$RESPONSE['ham'] = "true";

		break; // case 'stats': //asset/stats
	case 'upload': //asset/upload
		json_ValidateHTTPMethod('POST');

		// curl http://api.ludumdare.org/vx/asset/upload?pretty -F "asset=@static/other/logo/mike/Chicken64.png"
		//	"asset": {
		//		"name": "Chicken64.png",
		//		"type": "application/octet-stream",
		//		"tmp_name": "/tmp/php3WcAOP",
		//		"error": 0,
		//		"size": 476
		//	}

		// Authenticate User		
		$user_id = userAuth_GetId();
		if ( !$user_id )
			json_EmitFatalError_Permission(null, $RESPONSE);

		$user_hash = strrev(dechex($user_id));	// hex it, then reverse the order of the characters
		$user_path = str_split($user_hash, 3);	// Break every 3 characters
		$user_path = implode($user_path,'/');	// Recombine with '/' slashes
		$user_path .= "/z";						// Append '/z' meaning this is my home

		// Confirm an asset was included
		if ( !isset($_FILES["asset"]) )
			json_EmitFatalError_BadRequest("No 'asset' found. Max upload size is ".file_upload_max_size()." bytes", $RESPONSE);
			
		$asset = $_FILES["asset"];	// copy, so we can change it

		// http://stackoverflow.com/a/21715692/5678759
		// NOTE! Uploads that are too large are a difficult error to handle.
		// The error is thrown BEFORE your script executes. The only way to stop this is to disable this behavior (php.ini)
			
		// Check errors
		if ( $error = intval($asset['error']) ) {
			// http://php.net/manual/en/features.file-upload.errors.php
			if ( $error == 1 && $error == 2 )
				json_EmitFatalError_BadRequest("Asset is larger than ".file_upload_max_size()." bytes", $RESPONSE);
			
			json_EmitFatalError_BadRequest("Other asset error: ".$error, $RESPONSE);
		}

		// Verify details
		$raw_file = $asset["tmp_name"];
		$raw_size = $asset["size"];
		if ( !$raw_file && !$raw_size )
			json_EmitFatalError_BadRequest("Problem with 'asset'", $RESPONSE);
		
		//$RESPONSE['uu'] = imagetypes(); // & IMG_PNG is a bitmask
		//$RESPONSE['gd'] = gd_info();

		// Check asset
		$image_info = getimagesize($raw_file);

		// File is an image
		if ( $image_info ) {
			$asset['width'] = $image_info[0];
			$asset['height'] = $image_info[1];
			if ( isset(IMAGE_CONSTANTS[$image_info[2]]) )
				$asset['type'] = IMAGE_CONSTANTS[$image_info[2]];
			if ( isset($image_info['mime']) )
				$asset['mime'] = $image_info['mime'];
			if ( isset($image_info['bits']) )
				$asset['bits'] = $image_info['bits'];
	
			//$RESPONSE['asset'] = $asset;

			if ( $asset['width'] > MAX_IMAGE_WIDTH )
				json_EmitFatalError_BadRequest("Image asset 'width' is too large (Max: ".MAX_IMAGE_WIDTH.")", $RESPONSE);
			if ( $asset['height'] > MAX_IMAGE_HEIGHT )
				json_EmitFatalError_BadRequest("Image asset 'height' is too large (Max: ".MAX_IMAGE_HEIGHT.")", $RESPONSE);

			// Insert Asset
			$asset_id = asset_AddByNode($user_id, 'image', $asset['mime'], $asset['size'], [
				'width' => $asset['width'],
				'height' => $asset['height'],
				'name' => substr($asset['name'], 0, 96),	// max length
				'ext' => $asset['type']
			]);
			
			// Success
			if ( $asset_id ) {
				$RESPONSE['mime'] = $asset['mime'];
				$RESPONSE['width'] = $asset['width'];
				$RESPONSE['height'] = $asset['height'];
				$RESPONSE['size'] = $asset['size'];
				$RESPONSE['name'] = $asset['name'];

				$asset_hash = dechex($asset_id);
				$RESPONSE['stem'] = $user_path;
				$RESPONSE['file'] = $asset_hash.'.'.$asset['type'];
				$RESPONSE['path'] = $RESPONSE['stem'].'/'.$RESPONSE['file']; //'///raw/'

				$actual_path = __DIR__.TARGET_FOLDER.'/'.$RESPONSE['stem'];
				$actual_file = $actual_path.'/'.$RESPONSE['file'];

				if ( !file_exists($actual_path) )
					mkdir($actual_path, 0777, true);
				move_uploaded_file($asset["tmp_name"], $actual_file);
			}
			else {
				json_EmitFatalError_BadRequest("Unable to add 'asset'", $RESPONSE);
			}
		}
		else {
			json_EmitFatalError_BadRequest("Unsupported 'asset' type", $RESPONSE);
		}

		// NOTE: temp file will be deleted after this script finishes (unless moved)

		break; // case 'upload': //asset/upload

	default:
		json_EmitFatalError_Forbidden(null, $RESPONSE);
		break; // default
};

json_End();
