<?php
/** @file
*	@brief Public RESTful API for retrieving Items
**/

require_once __DIR__ . "/../../api.php";

// CMW API //

$out = json_NewResponse();
$out['item'] = 1;

//$out['args'] = $_GET;
//$out['server'] = $_SERVER;
$out['parsed'] = util_ParseActionURL();

/**
 * @api {GET} /v1/get/:item /v1/get
 * @apiName GetItem
 * @apiGroup Core
 * @apiPermission Everyone
 * @apiVersion 0.1.0
 *
 * @apiDescription Retrieve an item
*/

/**
 * @api {GET} /v1/games[/:offset] /v1/games
 * @apiName GetGames
 * @apiGroup Popular
 * @apiPermission Everyone
 * @apiVersion 0.1.0
 *
 * @apiDescription YOU GOT GAME?
*/
/**
 * @api {GET} /v1/videos[/:offset] /v1/videos
 * @apiName GetVideos
 * @apiGroup Popular
 * @apiPermission Everyone
 * @apiVersion 0.1.0
 *
 * @apiDescription MOVIES!?
*/
/**
 * @api {GET} /v1/tools[/:offset] /v1/tools
 * @apiName GetTools
 * @apiGroup Popular
 * @apiPermission Everyone
 * @apiVersion 0.1.0
 *
 * @apiDescription TOOZ!?
*/


json_Emit( $out );
?>
