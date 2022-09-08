<?php
require_once __DIR__."/../config.php";

include_once __DIR__."/".CONFIG_PATH."config.php";
require_once __DIR__."/".SHRUB_PATH."api2.php";
require_once __DIR__."/".SHRUB_PATH."file/file.php";
require_once __DIR__."/".SHRUB_PATH."file/constants.php";
require_once __DIR__."/".SHRUB_PATH."node/node.php";
require_once __DIR__."/".SHRUB_PATH."core/core.php";

require_once __DIR__.'/vendor/autoload.php';


const EMBED_FILE = '$$embed.zip';
const MAX_FILE_SIZE = 256*1024*1024;

const VALID_FILE_EXTENSIONS = [
    // Archives
    '.zip',
    '.tar.gz',
    '.tar.bz2',
    '.7z',
    
    // Windows //
    '.exe',
    '.msi',

    // Mac //
    '.dmg',
    
    // Linux
    '.deb',
    '.rpm',
    '.pkg',
    '.flatpak',
    '.snap',
    //'.appimage', //AppImage

    // Pico8
    '.p8',
    //'.p8.png',
];


// Generate a series token. Unique but not necessarily cryptographically secure.
function generate_series_token() {
    return bin2hex(random_bytes(8));
}


// Does the filename in the path contain a valid file extension
function has_extension($path, $ext_list = VALID_FILE_EXTENSIONS) {
    $path = strtolower($path);

    foreach( $ext_list as $index => $ext ) {
        $pos = strpos($path, $ext);
        if ( $pos !== false ) {
            if ( $pos == strlen($path)-strlen($ext) ) {
                return true;
            }
        }
    }
    return false;
}



function generate_netstorage_headers( $filePath, $action = "upload", $fileSize = null, $serveFromZip = false, $binary = false ) {
    $signer = new \Akamai\NetStorage\Authentication();
    $signer->setKey(AKAMAI_NETSTORAGE_FILE_KEY, AKAMAI_NETSTORAGE_FILE_USER);

    $action = "version=1&action=".$action;

    if ( $fileSize ) {
        $action .= "&size=".$fileSize;
    }

    if ( $binary ) {
        $action .= "&upload-type=binary";
    }

    if ( $serveFromZip ) {
        $action .= "&index-zip=1";
    }

    $filePath = "/".AKAMAI_NETSTORAGE_FILE_CPCODE.'/'.$filePath;
    
    $signer->setNonce();
    $signer->setTimestamp();
    $signer->setPath($filePath);
    $signer->setAction($action);

    $headers = [];
    $headers["X-Akamai-ACS-Action"] = $action;
    $headers = array_merge($headers, $signer->createAuthHeaders());
    $headers["url"] = AKAMAI_NETSTORAGE_FILE_HOST.$filePath;

    return $headers;
}


api_Exec([
["file/list/node", API_GET, function(&$RESPONSE, $HEAD_REQUEST) {
	if ( !json_ArgCount() )
		json_EmitFatalError_BadRequest(null, $RESPONSE);

    // At this point we can bail if it's just a HEAD request
    // TODO: should we?
	if ( $HEAD_REQUEST )
		json_EmitHeadAndExit();

    $node_id = intval(json_ArgGet(0));

    // Fetch file list
    $ret = file_GetByNode($node_id);

    // Return file list
    $RESPONSE['files'] = $ret;
}],
//["file/list/author", API_GET, function(&$RESPONSE, $HEAD_REQUEST) {
//["file/list/authors", API_GET, function(&$RESPONSE, $HEAD_REQUEST) {
["file/upload", API_POST | API_AUTH, function(&$RESPONSE, $HEAD_REQUEST) {
    // At this point we can bail if it's just a HEAD request
    // TODO: should we?
	if ( $HEAD_REQUEST ) {
		json_EmitHeadAndExit();
    }

    // Parse the POST data as JSON
    $_JSON = json_decode(file_get_contents('php://input'), true);

    // TODO: Is this the best way to know the ID of the calling user?
    // Get the author_id
    $author_id = intval($RESPONSE['caller_id']); // or $_JSON['author']
    if ( !$author_id ) {
        json_EmitFatalError_BadRequest(null, $RESPONSE);
    }

    // Get the tag_id
    $tag_id = intval($_JSON['tag']);
    //if ( !$tag_id ) {
    //    json_EmitFatalError_BadRequest(null, $RESPONSE);
    //}

    // Sanitize the filename (if it's not the SPECIAL file)
    $file_name = ($_JSON['name'] == EMBED_FILE) ? EMBED_FILE : coreSanitize_File($_JSON['name']);
    if ( !strlen($file_name) ) {
        json_EmitFatalError_BadRequest("Invalid file name", $RESPONSE);
    }
    $RESPONSE['name'] = $file_name;

    // Check if the given file extension is allowed
    if ( !has_extension($file_name) ) {
        json_EmitFatalError_BadRequest("Unsupported file type", $RESPONSE);
    }

    // Get the file size
    $file_size = intval($_JSON['size']);
    if ( !$file_size ) {
        json_EmitFatalError_BadRequest("Invalid file size", $RESPONSE);
    }
    else if ( $file_size > MAX_FILE_SIZE ) {
        json_EmitFatalError_BadRequest("File is too large! Max size is ".MAX_FILE_SIZE, $RESPONSE);
    }

    // TODO: Check against file storage quota

    // Should we enable "serve from zip" (i.e. indexing)?
    $serveFromZip = ($file_name == EMBED_FILE);

    // IMPORTANT: Do node stuff last, since it's expensive (requires DB)

    // Get the node_id
    $node_id = intval($_JSON['node']);
    if ( !$node_id ) {
        json_EmitFatalError_BadRequest(null, $RESPONSE);
    }

    // Get the node
    $node = nodeComplete_GetById($node_id);

    // Are you an author?
    // TODO: Confirm you have permission (may include non-authors)
    if ( !node_IsAuthor($node, $author_id) ) {
        json_EmitFatalError_Forbidden(null, $RESPONSE);
    }

    $parent = nodeComplete_GetById($node['parent']);

    // Bail if the parent doesn't have the upload enabled flag
    if ( !isset($parent['meta']) || !isset($parent['meta']['can-upload']) || !intval($parent['meta']['can-upload']) ) {
        json_EmitFatalError_Forbidden("Uploading is not enabled", $RESPONSE);
    }

    // Generate a session token (to pair with file/confirm)
    $token = generate_series_token();
    $RESPONSE['token'] = $token;
  
    // TODO: If it exists, mark the old file as deprecated

    // Store in database
    $RESPONSE['id'] = file_Add($author_id, $node_id, $tag_id, $file_name, $file_size, SH_FILE_STATUS_ALLOCATED, $token);
    
    // Generate Akamai NetStorage headers, so client can do the work
    $RESPONSE = array_merge($RESPONSE, generate_netstorage_headers('uploads/$'.$node_id.'/'.$file_name, 'upload', $file_size, $serveFromZip));

    // Respond with 202, meaning we've accepted the request, but the job isn't necessarily done
    json_RespondAccepted();
    // Respond with 201, meaning a new resource was created
    //json_RespondCreated();
}],
["file/confirm", API_POST | API_AUTH, function(&$RESPONSE, $HEAD_REQUEST) {
    // At this point we can bail if it's just a HEAD request
    // TODO: should we?
	if ( $HEAD_REQUEST ) {
		json_EmitHeadAndExit();
    }

    // Parse the POST data as JSON
    $_JSON = json_decode(file_get_contents('php://input'), true);

    // TODO: Is this the best way to know the ID of the calling user?
    // Get the author_id
    $author_id = intval($RESPONSE['caller_id']); // or $_JSON['author']
    if ( !$author_id ) {
        json_EmitFatalError_BadRequest(null, $RESPONSE);
    }

    // Get the file_id
    $file_id = intval($_JSON['id']);
    if ( !$file_id ) {
        json_EmitFatalError_BadRequest(null, $RESPONSE);
    }

    // Get the token
    $token = $_JSON['token'];
    if ( strlen($token) > 16 ) {
        json_EmitFatalError_BadRequest(null, $RESPONSE);
    }

    $flags = SH_FILE_STATUS_ALLOCATED | SH_FILE_STATUS_UPLOADED;

    $name = $_JSON['name'];
    if ( !$name ) {
        json_EmitFatalError_BadRequest(null, $RESPONSE);
    }
    else if ( $name == EMBED_FILE ) {
        $flags |= SH_FILE_STATUS_AKAMAI_ZIP;
    }

    // Get the node_id
    $node_id = intval($_JSON['node']);
    if ( !$node_id ) {
        json_EmitFatalError_BadRequest(null, $RESPONSE);
    }

    $RESPONSE['confirmed'] = file_SetStatusById($file_id, $flags, "", $token, $author_id);

    nodeCache_InvalidateById($node_id);
}],
["file/delete", API_POST | API_AUTH, function(&$RESPONSE, $HEAD_REQUEST) {
    // At this point we can bail if it's just a HEAD request
    // TODO: should we?
	if ( $HEAD_REQUEST ) {
		json_EmitHeadAndExit();
    }

    // Parse the POST data as JSON
    $_JSON = json_decode(file_get_contents('php://input'), true);

    // TODO: Is this the best way to know the ID of the calling user?
    // Get the author_id
    $author_id = intval($RESPONSE['caller_id']); // or $_JSON['author']
    if ( !$author_id ) {
        json_EmitFatalError_BadRequest(null, $RESPONSE);
    }

    // Get the file_id
    $file_id = intval($_JSON['id']);
    if ( !$file_id ) {
        json_EmitFatalError_BadRequest(null, $RESPONSE);
    }

    // Get the node_id
    $node_id = intval($_JSON['node']);
    if ( !$node_id ) {
        json_EmitFatalError_BadRequest(null, $RESPONSE);
    }
    
    // Generate a session token (to pair with file/confirm)
    $token = generate_series_token();
    $RESPONSE['token'] = $token;

    $flags = 0;// SH_FILE_STATUS_UPLOADED;

    $file_name = $_JSON['name'];
    if ( !$file_name ) {
        json_EmitFatalError_BadRequest(null, $RESPONSE);
    }
    else if ( $file_name == EMBED_FILE ) {
        $flags |= SH_FILE_STATUS_AKAMAI_ZIP;
    }

    // use a better name than confirmed. 'status', but that name may have conflicts
    $RESPONSE['confirmed'] = file_SetStatusById($file_id, $flags, $token, null, $author_id);

    // Generate Akamai NetStorage headers, so client can do the work
    $RESPONSE = array_merge($RESPONSE, generate_netstorage_headers('uploads/$'.$node_id.'/'.$file_name, 'delete'));

    // Respond with 202, meaning we've accepted the request, but the job isn't necessarily done
    json_RespondAccepted();
}],
["file/confirmdelete", API_POST | API_AUTH, function(&$RESPONSE, $HEAD_REQUEST) {
    // At this point we can bail if it's just a HEAD request
    // TODO: should we?
	if ( $HEAD_REQUEST ) {
		json_EmitHeadAndExit();
    }

    // Parse the POST data as JSON
    $_JSON = json_decode(file_get_contents('php://input'), true);

    // TODO: Is this the best way to know the ID of the calling user?
    // Get the author_id
    $author_id = intval($RESPONSE['caller_id']); // or $_JSON['author']
    if ( !$author_id ) {
        json_EmitFatalError_BadRequest(null, $RESPONSE);
    }

    // Get the file_id
    $file_id = intval($_JSON['id']);
    if ( !$file_id ) {
        json_EmitFatalError_BadRequest(null, $RESPONSE);
    }

    // Get the node_id
    $node_id = intval($_JSON['node']);
    if ( !$node_id ) {
        json_EmitFatalError_BadRequest(null, $RESPONSE);
    }

    // Get the token
    $token = $_JSON['token'];
    if ( strlen($token) > 16 ) {
        json_EmitFatalError_BadRequest(null, $RESPONSE);
    }

    $flags = 0;

    $name = $_JSON['name'];
    if ( !$name ) {
        json_EmitFatalError_BadRequest(null, $RESPONSE);
    }
    else if ( $name == EMBED_FILE ) {
        $flags |= SH_FILE_STATUS_AKAMAI_ZIP;
    }

    $RESPONSE['confirmed'] = file_SetStatusById($file_id, $flags, "", $token, $author_id);

    nodeCache_InvalidateById($node_id);
}],
/*
["file/get", API_GET | API_CHARGE, function(&$RESPONSE, $HEAD_REQUEST) {
	if ( !json_ArgCount() )
		json_EmitFatalError_BadRequest(null, $RESPONSE);

    // At this point we can bail if it's just a HEAD request
    // TODO: should we?
	if ( $HEAD_REQUEST )
		json_EmitHeadAndExit();

    // TODO: Is this the best way to know the ID of the calling user?
    $caller_id = $RESPONSE['caller_id'];

    // Bail if listing user is zero
    //if ( !$caller_id )
    //    json_EmitFatalError_BadRequest("Bad caller_id: ".$caller_id, $RESPONSE);

    // extract the file_id
    $file_id = intval(json_ArgGet(0));

    // Bail if the file_id is zero
    if ( !$file_id )
        json_EmitFatalError_BadRequest("Bad file_id: ".$file_id, $RESPONSE);

    

    $RESPONSE['file'] = ['moon'=>$file_id];
}],
*/
]);
