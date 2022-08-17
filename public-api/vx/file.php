<?php
require_once __DIR__."/../config.php";

include_once __DIR__."/".CONFIG_PATH."config.php";
require_once __DIR__."/".SHRUB_PATH."api2.php";
require_once __DIR__."/".SHRUB_PATH."file/file.php";


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

    // TODO: Is this the best way to know the ID of the calling user?
    //$author_id = $RESPONSE['caller_id'];
    
    // TODO: Confirm that the user is the author of the node
    $node_id = 10;

    // TODO: Use a tag
    //$tag_id = 0;

    // TODO: retrieve and sanitize filename
    $file_name = "taste.zip";

    // TODO: use file size
    //$file_size = 128;

    $RESPONSE['path'] = 'http://'.AKAMAI_NETSTORAGE_FILE_HOST.'/'.AKAMAI_NETSTORAGE_FILE_CPCODE.'/$'.$node_id.'/'.$file_name;
    
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
