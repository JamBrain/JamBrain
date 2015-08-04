<?php
/* Uptime Check */

ini_set('display_errors',1);
ini_set('display_startup_errors',1);
error_reporting(-1);

require_once __DIR__."/../../config.php";
require_once __DIR__."/../../api.php";

// REMEMBER: The CloudFlare IPs are not whitelisted //
if ( !ON_WHITELIST($_SERVER['REMOTE_ADDR'],CMW_ACCESS_DATA) ) {
	json_EmitError(401);
}

$response = json_NewResponse();

if ( defined('CMW_USING_APCU') ) {
	$response['apcu'] = [
		"uptime" => time() - intval(apcu_cache_info("user")['start_time'])
	];
}

if ( defined('CMW_USING_REDIS') ) {
	$redis = new Redis();
	$redis->connect(CMW_REDIS_HOST);
	$response['redis'] = [
		"uptime" => intval($redis->info('default')['uptime_in_seconds'])
	];
	$redis->close();
}

if ( defined('CMW_USING_DB') ) {
	require_once __DIR__."/../../db.php";

	db_connect();
	$db_data = db_FetchArrayPair("show global status where Variable_Name = 'Uptime';");
	$response['db'] = [
		"uptime" => intval($db_data['Uptime'])
	];
	db_close();
}

if ( defined('CMW_USING_MEMCACHED') ) {
	$m = new Memcached();
	$m->addServer(CMW_MEMCACHED_HOST, CMW_MEMCACHED_PORT);
	
	$m_data = $m->getStats();
	$response['memcached'] = [];
	
	foreach ( $m_data as $key => $value ) {
		$response['memcached'][$key] = $value['uptime'];
	}
	
	$m->quit();
}

json_Emit($response);
?>
