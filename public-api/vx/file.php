<?php
require_once __DIR__."/../config.php";

include_once __DIR__."/".CONFIG_PATH."config.php";
require_once __DIR__."/".SHRUB_PATH."api2.php";
require_once __DIR__."/".SHRUB_PATH."file/file.php";
require_once __DIR__."/".SHRUB_PATH."file/constants.php";

require_once __DIR__.'/vendor/autoload.php';


function generate_akamai_headers( $filePath, $action = "upload", $fileSize = null, $serveFromZip = false ) {
    $signer = new \Akamai\NetStorage\Authentication();
    $signer->setKey(AKAMAI_NETSTORAGE_FILE_KEY, AKAMAI_NETSTORAGE_FILE_USER);

    $action = "version=1&action=".$action;
    $filePath = "/".AKAMAI_NETSTORAGE_FILE_CPCODE.'/'.$filePath;
    
    $signer->setNonce();
    $signer->setTimestamp();
    $signer->setPath($filePath);
    $signer->setAction($action);

    $headers = [];
    $headers["X-Akamai-ACS-Action"] = $action;
    $headers = array_merge($headers, $signer->createAuthHeaders());
    $headers["url"] = AKAMAI_NETSTORAGE_FILE_HOST.$filePath;

    // TODO: Be sure client includes an Origin
    // $headers["Origin"] = "https://ldjam.com";

    return $headers;
}


api_Exec([
["file/list/node", API_GET | API_CHARGE, function(&$RESPONSE, $HEAD_REQUEST) {
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
//["file/list/author", API_GET | API_CHARGE, function(&$RESPONSE, $HEAD_REQUEST) {
//["file/list/authors", API_GET | API_CHARGE, function(&$RESPONSE, $HEAD_REQUEST) {
["file/upload", API_POST | API_CHARGE /*| API_AUTH*/, function(&$RESPONSE, $HEAD_REQUEST) {
    // At this point we can bail if it's just a HEAD request
    // TODO: should we?
	if ( $HEAD_REQUEST ) {
		json_EmitHeadAndExit();
    }

    $_JSON = json_decode(file_get_contents('php://input'), true);

    // TODO: Is this the best way to know the ID of the calling user?
    $author_id = intval($RESPONSE['caller_id']); // or $_JSON['author']

    // confirm they have permission to upload on this users behalf
    
    $node_id = intval($_JSON['node']);

    // TODO: Confirm that the user is the author of the node OR has permission to upload on their behalf

    $tag_id = intval($_JSON['tag']);

    // TODO: retrieve and sanitize filename
    $file_name = $_JSON['name'];

    // TODO: use file size
    $file_size = intval($_JSON['size']);

    // Write data to Database
    $ret = file_Add($author_id, $node_id, $tag_id, $file_name, $file_size, SH_FILE_STATUS_ALLOCATED);
    
    // Generate Akamai headers
    $RESPONSE = array_merge($RESPONSE, generate_akamai_headers('uploads/$'.$node_id.'/'.$file_name, 'upload'));
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
