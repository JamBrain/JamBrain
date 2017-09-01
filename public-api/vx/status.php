<?php
require_once __DIR__."/../config.php";

include_once __DIR__."/".CONFIG_PATH."config.php";
require_once __DIR__."/".SHRUB_PATH."api.php";

json_Begin();

// Reference:
// - https://github.com/phpsysinfo/phpsysinfo/blob/master/includes/os/class.Linux.inc.php
// - https://stackoverflow.com/a/41251290/5678759
// - https://github.com/hishamhm/htop/blob/8af4d9f453ffa2209e486418811f7652822951c6/linux/LinuxProcessList.c#L802-L833

// For parsing /proc/ files that are simple whitespace delimited
function proc_Split( $file, $limit = PHP_INT_MAX ) {
	if (!is_readable($file))
		return null;

	$data = @file_get_contents($file);
	if ( $data == false )
		return null;
	$data = trim($data);

	return explode(' ', $data, $limit);
}

// For parsing /proc/ files that are newline delimited
function proc_Parse( $file ) {
	if (!is_readable($file))
		return null;
		
	$data = file($file);
	if ( $data == false )
		return null;

	$out = [];
	$item = [];
	
	foreach ($data as &$line) {
		if (strlen(trim($line))) {
			$part = explode(':', $line, 2);
			$item[trim($part[0])] = trim($part[1]);
		}
		else {
			// if line is blank, start building an array
			$out[] = $item;
			$item = [];
		}
	}
	
	// NOTE: expects multi-item files to end with a blank line
	if (count($out)) {
		return $out;
	}
	return $item;
}



//$RESPONSE['info'] = cache_Fetch('!SYSTEM_STATUS');
//
//if (!$RESPONSE['info']) {

	$self = [];
	$remote = [];
	
	$RESPONSE['info'] = [
		'timestamp' => gmdate("Y-m-d\TH:i:s\Z"),
		'self' => &$self,
//		'db' => $remote,
	];
	
	$PROC_CPUINFO = proc_Parse('/proc/cpuinfo');
	$PROC_MEMINFO = proc_Parse('/proc/meminfo');
	$PROC_UPTIME = proc_Split('/proc/uptime');
	
	
//	$self['cpuinfo'] = $PROC_CPUINFO;
//	$self['meminfo'] = $PROC_MEMINFO;
	
	
	if ( $PROC_CPUINFO ) {
		$self['cpus'] = count($PROC_CPUINFO);
	}
	
	$self['load'] = sys_getloadavg();
	
	if ( $PROC_MEMINFO ) {
		$mem_total = intval(explode(" ", $PROC_MEMINFO['MemTotal'])[0]);//*1024;
		$mem_free = intval(explode(" ", $PROC_MEMINFO['MemFree'])[0]);//*1024;
		$mem_cached = intval(explode(" ", $PROC_MEMINFO['Cached'])[0]);//*1024;
		$mem_buffers = intval(explode(" ", $PROC_MEMINFO['Buffers'])[0]);//*1024;
		
		$self['memory'] = $mem_total;
		$self['used'] = ($mem_total-$mem_free)-($mem_buffers+$mem_cached);
	}
	
	if ( $PROC_UPTIME ) {
		$self['uptime'] = [
			floatval($PROC_UPTIME[0]),
			floatval($PROC_UPTIME[1])
		];
	}
	
	//		json_EmitFatalError_Forbidden(null, $RESPONSE);
	
	
//	$remote['ee'] = db_QueryFetch("SHOW GLOBAL STATUS;");

//}

json_End();
