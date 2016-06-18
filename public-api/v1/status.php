<?php
/* Status/Uptime Check */

require_once __DIR__."/../../api.php";

// TODO: Check authentication. If not an administrator, limit what this returns.

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
		$is_admin = true;	// hack ***********************
		$need_admin = true;
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
if ( !$show_specific ) {
	if (function_exists('opcache_is_script_cached')) {
		// Technically, this is checking if this file is cached //
		$response['opcache_enabled'] = opcache_is_script_cached(__FILE__);
	}
}

// APCu //
if ( defined('CMW_USING_APCU') && !$show_specific ) {
	$response['apcu_api_version'] = phpversion('apcu');

	if (function_exists('apcu_cache_info')) {
		$response['apcu_uptime'] = time() - intval(apcu_cache_info(true)['start_time']);
	}
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
		$redis = new Redis();
		$redis->connect(CMW_REDIS_HOST);
		$info = $redis->info('default');
		$response['redis_version'] = $info['redis_version'];
		$response['redis_uptime'] = time_offset() + intval($info['uptime_in_seconds']);
		$redis->close();
	}
}

// Memcached //
if ( defined('CMW_USING_MEMCACHED') && $show_memcached ) {
	$response['memcached_api_version'] = phpversion('memcached');

	if ( $is_admin ) {
		$m = new Memcached();
		$m->addServer(CMW_MEMCACHED_HOST, CMW_MEMCACHED_PORT);
		
		$m_data = $m->getStats();
		//$response['memcached'] = [];							// If multiple servers
		
		foreach ( $m_data as $key => $value ) {
			//$response['memcached'][$key] = $value['uptime'];	// If multiple servers
			$response['memcached_version'] = $value['version'];
			$response['memcached_uptime'] = time_offset() + $value['uptime'];
		}
		
		$m->quit();
	}
}


// Command Line Tools //
if ( defined('CMW_USING_IMAGEMAGICK') && !$show_specific && $is_admin ) {
	unset($out);
	unset($ret);
	exec("convert -version",$out,$ret);
	$response['imagemagick_version'] = $ret ? "ERROR" : preg_split('/\s+/',$out[0])[2];
}

if ( defined('CMW_USING_PHP_IMAGEMAGICK') && !$show_specific && $is_admin ) {
	// TODO: this
	// NOTE: This is the PHP library ImageMagick, not the command line tool
}

if ( defined('CMW_USING_PNGQUANT') && !$show_specific && $is_admin ) {
	unset($out);
	unset($ret);
	exec("pngquant --help",$out,$ret);
	$response['pngquant_version'] = $ret ? "ERROR" : preg_split('/\s+/',$out[0])[1];
}

if ( defined('CMW_USING_FFMPEG') && !$show_specific && $is_admin ) {
	unset($out);
	unset($ret);
	exec("ffmpeg -version",$out,$ret);
	$response['ffmpeg_version'] = $ret ? "ERROR" : preg_split('/\s+/',$out[0])[2];
}

if ( defined('CMW_USING_GIFSICLE') && !$show_specific && $is_admin ) {
	unset($out);
	unset($ret);
	exec("gifsicle --version",$out,$ret);
	$response['gifsicle_version'] = $ret ? "ERROR" : preg_split('/\s+/',$out[0])[2];
}


json_Emit($response);
