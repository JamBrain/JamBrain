<?php
/* Status/Uptime Check */

require_once __DIR__."/../../config.php";
require_once __DIR__."/../../api.php";

// TODO: Confirm libraries are available (APCu, etc)
// TODO: Check authentication. If not an administrator, limit what this returns.
// TODO: Limited return by default, no authentication required.
// TODO: "/status" is just name, PHP and PHP plugins (APCu)
// TODO: "/status/db" for the DB status. Consider not doing DB status without it (for performance).
// TODO: "/status/redis" and "/status/memcached" for redis and memcached status. Same reason.
// TODO: "/status/full" or "/status/all" or "/status/admin" for the full display, authenticated.
// TODO: Add Image Processing tool steps

// REMEMBER: The CloudFlare IPs are not whitelisted //
//if ( !core_OnWhitelist($_SERVER['REMOTE_ADDR'],CMW_ACCESS_DATA) ) {
//	json_EmitError(401);
//}

$response = json_NewResponse();

$response['name'] = gethostname();
$response['php_version'] = PHP_VERSION;

$start_time = time();
function time_offset() {
	global $start_time;
	return $start_time - time();
}

if ( defined('CMW_USING_APCU') ) {
	$response['apcu_version'] = phpversion('apcu');

	$response['apcu_uptime'] = time() - intval(apcu_cache_info(true)['start_time']);
//	$response['apcu'] = apcu_cache_info(true);
}

if ( defined('CMW_USING_REDIS') ) {
	$response['redis_version'] = phpversion('redis');

	$redis = new Redis();
	$redis->connect(CMW_REDIS_HOST);
	$response['redis_uptime'] = time_offset() + intval($redis->info('default')['uptime_in_seconds']);
	$redis->close();
}

if ( defined('CMW_USING_DB') ) {
	require_once __DIR__."/../../db.php";

	$db_data = db_QueryFetchPair("show VARIABLES like \"%version%\"");
	$response['db_version'] = $db_data['version'];

	$db_data = db_QueryFetchPair("show global status where Variable_Name = 'Uptime';");
	$response['db_uptime'] = time_offset() + intval($db_data['Uptime']);
}

if ( defined('CMW_USING_MEMCACHED') ) {
	$response['memcached_version'] = phpversion('memcached');

	$m = new Memcached();
	$m->addServer(CMW_MEMCACHED_HOST, CMW_MEMCACHED_PORT);
	
	$m_data = $m->getStats();
	//$response['memcached'] = [];							// If multiple servers
	
	foreach ( $m_data as $key => $value ) {
		//$response['memcached'][$key] = $value['uptime'];	// If multiple servers
		$response['memcached_uptime'] = time_offset() + $value['uptime'];
	}
	
	$m->quit();
}

if ( defined('CMW_USING_IMAGEMAGICK') ) {
	// TODO: this	
}

if ( defined('CMW_USING_PHP_IMAGEMAGICK') ) {
	// TODO: this
	// NOTE: This is the PHP library ImageMagick, not the command line tool
}

if ( defined('CMW_USING_PNGQUANT') ) {
	// TODO: this	
}

if ( defined('CMW_USING_FFMPEG') ) {
	// TODO: this	
}


json_Emit($response);
