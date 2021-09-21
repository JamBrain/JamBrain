<?php
const CONFIG_PATH = "../shrub/";
const SHRUB_PATH = "../shrub/src/";
include_once __DIR__."/".CONFIG_PATH."config.php";
require_once __DIR__."/".SHRUB_PATH."api.php";

json_Begin();

const DOMAIN_REDIRECT_TABLE = [
	'url.ludumdare.org' => 'ludumdare.org',	// legacy
	'url.ludumdare.dev' => 'ludumdare.dev',	// legacy
	'url.ldjam.work' => 'ldjam.work',
	'url.ldjam.dev' => 'ldjam.dev',
	'url.jammer.work' => 'jammer.work',
	'url.jammer.dev' => 'jammer.dev',

	'ldj.am' => 'ldjam.com',
	'jam.vg' => 'jammer.vg',
	'jam.bio' => 'jammer.bio',
	//'jam.mr' => 'jammer.vg',
];

$action = json_ArgShift();
$node_id = null;
$specific = false;

if ( !$action ) {
	json_EmitFatalError_BadRequest('What?', $RESPONSE);
}

// Do Specific Actions
switch ( $action ) {
	case 'SPECIAL': //SPECIAL
		$specific = true;

		$RESPONSE['ham'] = 1;

		break; // case 'SPECIAL': //SPECIAL

	default:
		if ( !isset(DOMAIN_REDIRECT_TABLE[$_SERVER['SERVER_NAME']]) ) {
			json_EmitFatalError_BadRequest('Unknown domain mapping: '.$_SERVER['SERVER_NAME'], $RESPONSE);
		}
		
		$url = '//'.DOMAIN_REDIRECT_TABLE[$_SERVER['SERVER_NAME']];

		// Do a raw ID decode
		if ( $action[0] == '$' ) {
			$node_id = intval(substr($action, 1));
		}
		else {
			// TODO: munger
			$node_id = 0;
		}
	
		if ( !$node_id ) {
			json_EmitFatalError_BadRequest('Unknown request', $RESPONSE);
		}

		$paths = node_GetPathById($node_id, 1);
		if ( !$paths ) {
			json_EmitFatalError_BadRequest('Unable to trace node: '.$node_id, $RESPONSE);
		}
		$RESPONSE['paths'] = $paths;
		
		$url .= $paths['path'];
		$RESPONSE['url'] = $url;
		
		// Redirect
		header('Location: '.$url, true, /*301*/307);
		die;
	
		break;
};

json_End();
