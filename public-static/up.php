<?php
/* Image Uploader */

//ini_set('display_errors',1);
//ini_set('display_startup_errors',1);
//error_reporting(-1);

require_once __DIR__."/../api.php";

$response = json_NewResponse();

//user_StartEnd();

// Retrieve Action and Arguments
$arg = core_ParseActionURL();
$node_id = intval(array_shift($arg));
$arg_count = count($arg);

$response['node'] = $node_id;

$redis = new Redis();
$redis->connect('127.0.0.1');

$val = $redis->incr('key');
$response['value'] = $val;

$redis->close();

/*
// From: http://php.net/manual/en/features.file-upload.multiple.php
function reArrayFiles(&$file_post) {
    $file_ary = array();
    $file_count = count($file_post['name']);
    $file_keys = array_keys($file_post);

    for ($i=0; $i<$file_count; $i++) {
        foreach ($file_keys as $key) {
            $file_ary[$i][$key] = $file_post[$key][$i];
        }
    }

    return $file_ary;
}
$_FILES = reArrayFiles($_FILES);

$response['files'] = $_FILES;

*/

json_Emit($response);
?>
