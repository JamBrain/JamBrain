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

// ** Begin ** //
$response = json_NewResponse();

$start_time = time();
function time_offset() {
	global $start_time;
	return $start_time - time();
}

$need_admin = false;
$show_specific = false;
$show_db = false;
$show_redis = false;
$show_memcached = false;
$is_admin = false;

// Parse action URL
$action = core_ParseActionURL();
//$response['action'] = $action;

foreach ( $action as $key => &$value ) {
	if ( $action[$key] == "db" ) {
		$show_db = true;
		$need_admin = true;
	}
	else if ( $action[$key] == "redis" ) {
		$show_redis = true;
		$need_admin = true;
	}
	else if ( $action[$key] == "memcached" ) {
		$show_memcached = true;
		$need_admin = true;
	}
	else if ( $action[$key] == "all" ) {
		$show_db = true;
		$show_redis = true;
		$show_memcached = true;	
		$need_admin = true;
	}

	if ( $action[$key] == "admin" ) {
		$is_admin = true;	// hack
	}
	
	
	if ( $action[$key] == "db" || $action[$key] == "redis" || $action[$key] == "memcached" ) {
		$show_specific = true;
	}
}

if ( $need_admin ) {
	// TODO: Do authentication check
//	if ( blah ) {
//		$is_admin = true;
//	}
}

// PHP //
if ( !$show_specific ) {
	$response['name'] = gethostname();
	$response['php_version'] = PHP_VERSION;
}

// OpCache //
//if ( !$show_specific ) {
//}

// APCu //
if ( defined('CMW_USING_APCU') && !$show_specific ) {
	$response['apcu_api_version'] = phpversion('apcu');

	$response['apcu_uptime'] = time() - intval(apcu_cache_info(true)['start_time']);
//	$response['apcu'] = apcu_cache_info(true);
}

// Database //
if ( defined('CMW_USING_DB') && $show_db ) {
	$response['db_api_version'] = phpversion('mysqli');

	if ( $is_admin ) {
		require_once __DIR__."/../../db.php";
		
		$db_data = db_QueryFetchPair("show VARIABLES like \"%version%\"");
		$response['db_version'] = $db_data['version'];
	
		$db_data = db_QueryFetchPair("show global status where Variable_Name = 'Uptime';");
		$response['db_uptime'] = time_offset() + intval($db_data['Uptime']);
	}
}

// Redis //
if ( defined('CMW_USING_REDIS') && $show_redis ) {
	$response['redis_api_version'] = phpversion('redis');

	if ( $is_admin ) {
		// TODO: Get Redis Server Version //

		$redis = new Redis();
		$redis->connect(CMW_REDIS_HOST);
		$response['redis_uptime'] = time_offset() + intval($redis->info('default')['uptime_in_seconds']);
		$redis->close();
	}
}

// Memcached //
if ( defined('CMW_USING_MEMCACHED') && $show_memcached ) {
	$response['memcached_version'] = phpversion('memcached');

	if ( $is_admin ) {
		// TODO: Get Memcached Server Version //
		
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
}

// Command Line Tools //
if ( defined('CMW_USING_IMAGEMAGICK') && !$show_specific && $is_admin ) {
	// TODO: this	
}

if ( defined('CMW_USING_PHP_IMAGEMAGICK') && !$show_specific && $is_admin ) {
	// TODO: this
	// NOTE: This is the PHP library ImageMagick, not the command line tool
}

if ( defined('CMW_USING_PNGQUANT') && !$show_specific && $is_admin ) {
	// TODO: this	
}

if ( defined('CMW_USING_FFMPEG') && !$show_specific && $is_admin ) {
	// TODO: this	
}


json_Emit($response);
