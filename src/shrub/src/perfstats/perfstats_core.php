<?php

const PERFSTAT_MAX_COUNTER_LENGTH = 64;
const PERFSTAT_PERIOD_LENGTH = 15*60; // Number of seconds - Should divide evenly into a day, otherwise a period at the day transition will be missed.
const PERFSTAT_BUFFER_LENGTH = 10*60;
const PERFSTAT_ROLLOVER_DELAY = 10; // Allow a few seconds before committing the previous period to ensure no API is still touching it.
const PERFSTAT_CACHE_TIMEOUT = PERFSTAT_PERIOD_LENGTH*2 + PERFSTAT_BUFFER_LENGTH;

const HISTOGRAM_POWER = 1.08;
const HISTOGRAM_ORIGIN = 0.0005;
const HISTOGRAM_BUCKET_MAX = 127;
// With a base/origin value of 0.0005 (0.5 ms) and a step of 8% (1.08), +127 steps is 8.785 seconds
// So the accurate range of the histogram is 0.5ms to 8.7 seconds in logarithmic steps (smaller steps near lower values)

const PERCENTILE_TAPS = [0,10,20,30,40,50,60,70,80,90,95,98,100];

function perfstats_GetRedis() {
	if ( isset($GLOBALS["REDIS_INSTANCE"]) ) {
		return $GLOBALS["REDIS_INSTANCE"];
	}
	
	$redis = new Redis();
	if ( $redis->connect(SH_REDIS_HOST) ) {
		$GLOBALS["REDIS_INSTANCE"] = $redis;
		return $redis;
	}
	
	return null;
}

function perfstats_GetCurrentPeriodEnd() {
	// Date manipulation in php is the worst.
	$now = time();
	$data = getdate($now);
	$dayseconds = $data["seconds"] + $data["minutes"]*60 + $data["hours"]*3600;
	$periodseconds = $dayseconds % PERFSTAT_PERIOD_LENGTH;
	$periodend = $now + (PERFSTAT_PERIOD_LENGTH-$periodseconds);
	
	return $periodend;
}

function perfstats_GetPeriodId($periodtime = null) {
	if ( $periodtime == null ) {
		$periodtime = perfstats_GetCurrentPeriodEnd();
	}
	return $periodtime;
}

function perfstats_HistogramBucket($time) {
	$bucket = intval(round(log($time/HISTOGRAM_ORIGIN, HISTOGRAM_POWER)));
	if ( $bucket < 0 ) {
		$bucket = 0;
	}
	if ( $bucket > HISTOGRAM_BUCKET_MAX ) {
		$bucket = HISTOGRAM_BUCKET_MAX;
	}
	return $bucket;
}

function perfstats_MicrosecondTime($time) {
	return intval(round($time*1000000));
}

function perfstats_Accumulate($period, $countername, $microseconds, $bucket, $code) {
	$keycount = "!SH!PERFSTATS!" . $period . "!" . $countername;
	$keytime = $keycount . "!TIME";
	$keycode = $keycount . "!CODE!" . $code;
	$keybucket = $keycount . "!" . $bucket;

//	// Ensure apcu records are created for this period
//	apcu_add($keycount, 0, PERFSTAT_CACHE_TIMEOUT);
//	apcu_add($keytime, 0, PERFSTAT_CACHE_TIMEOUT);
//	apcu_add($keybucket, 0, PERFSTAT_CACHE_TIMEOUT);
//	
//	// Accumulate APCU records with new data
//	apcu_inc($keycount, 1);
//	apcu_inc($keytime, $microseconds);
//	apcu_inc($keybucket, 1);

	// Open a connection to Redis, and accumulate data there. 
	// Redis does have a floating point increment unlike APCU, but we'll count microseconds as integers instead.
	$redis = perfstats_GetRedis();
	if ( $redis ) {
		// Add counts to redis
		$redis->incr($keycount);
		$redis->incr($keybucket);
		$redis->incr($keycode);
		$redis->incrBy($keytime, $microseconds);
		
		// Enforce timeouts on redis values, so in case the collection task doesn't run, these records don't accumulate forever.
		$redis->expire($keycount, PERFSTAT_CACHE_TIMEOUT);
		$redis->expire($keybucket, PERFSTAT_CACHE_TIMEOUT);
		$redis->expire($keycode, PERFSTAT_CACHE_TIMEOUT);
		$redis->expire($keytime, PERFSTAT_CACHE_TIMEOUT);
	}
}


function perfstats_ComputeHistogramPercentiles(&$stats)
{
	$taps = PERCENTILE_TAPS; // Percentiles to compute
	
	$h = $stats["Histogram"]["Buckets"];
	$count = $stats['Count'];
	$keys = array_keys($h);
	sort($keys);
	$percentiles = [];
	$cursor = -1;
	$taken = 0;
	$tapindex = 0;
	foreach($keys as $k)
	{
		$taken += $h[$k];
		$max_cursor = intval(floor($taken * 100 / $count));
		if($max_cursor > $cursor)
		{
			$keyvalue = HISTOGRAM_ORIGIN * pow(HISTOGRAM_POWER, $k);
			while ( $tapindex < count($taps) && $taps[$tapindex] <= $max_cursor ) {
				$percentiles[$taps[$tapindex]] = $keyvalue;
				$tapindex++;
			}
			$cursor = $max_cursor;
		}
	}
	
	$stats["Percentiles"] = $percentiles;
}

function perfstats_ComputeCachedPeriodStats($periodend)
{
	$keybase = "!SH!PERFSTATS!" . $periodend . "!";
	
	$apcudata = [];
	$stats = [];

	$now = time();
	
//	// Enumerate APCU keys for this period
//	foreach (new APCUIterator("/^$keybase.*/") as $entry) {
//		$apcudata[$entry["key"]] = $entry["value"];
//	}

	// Enumerate redis keys for this period
	$redis = perfstats_GetRedis();
	if ( $redis ) {
		$keys = $redis->keys($keybase . "*");
		$values = $redis->mGet($keys);
		
		for ( $i = 0; $i < count($keys); $i++ ) {
			if ( $values[$i] !== false ) {			
				$apcudata[$keys[$i]] = $values[$i];
			}
		}
	}

	$durationseconds = $now - ($periodend - PERFSTAT_PERIOD_LENGTH);
	if ( $durationseconds < 1 ) {
		$durationseconds = 1;
	}
	
	// Generate stats from information in keys
	$skip = strlen($keybase);
	foreach($apcudata as $k => $v)
	{
		$parts = explode("!",substr($k, $skip));
		// Parts is now <apiname>, (nothing or "TIME" or bucket)
		$apiname = $parts[0];
		if ( !isset($stats[$apiname]) ) {
			$stats[$apiname] = [ "Count" => 0, "AverageTime" => 0, "DurationSeconds" => $durationseconds, "UsedTime" => 0, "RPM" => 0, 
								"Histogram" => [ "Origin" => HISTOGRAM_ORIGIN, "Power" => HISTOGRAM_POWER, "Buckets" => [] ],
								"Status" => ["2xx" => 0, "4xx" => 0, "5xx" => 0], "StatusCodes" => [] ];
		}
		
		if ( count($parts) == 1 ) {
			// This is a count
			$stats[$apiname]["Count"] = $v;
		}
		else {
			if ( $parts[1] == "TIME" ) {
				// Total time (in microseconds);
				$time = $v / 1000000.0;
				$stats[$apiname]["UsedTime"] = $time;
			}
			else if ( $parts[1] == "CODE" ) {
				// This is a return code bucket			
				$stats[$apiname]["StatusCodes"][$parts[2]] = $v;
			}
			else {
				// This is a bucket index
				$bucket = intval($parts[1]);
				$stats[$apiname]["Histogram"]["Buckets"][$bucket] = $v;
			}
		}
	}

	// Compute percentile stats & requests/minute, and roll up classes of return codes into 2xx,4xx,5xx
	foreach($stats as $k => &$v) {
		$rpm = $v["Count"] * 60 / $durationseconds;
		$v["RPM"] = $rpm;
		if ( $v["Count"] > 0 ) { 
			$avg = $v["UsedTime"] / $v["Count"];
			$v["AverageTime"] = $avg;
		}
		
		perfstats_ComputeHistogramPercentiles($v);
		
		foreach ( $v["StatusCodes"] as $code => $count ) {
			$status = intval($code);
			if ( $status >= 200 && $status < 300 ) { 
				$v["Status"]["2xx"] += $count;
			}
			else if ( $status >= 400 && $status < 500 ) { 
				$v["Status"]["4xx"] += $count;
			}
			else if ( $status >= 500 && $status < 600 ) { 
				$v["Status"]["5xx"] += $count;
			}
		}
	}


	return 	["apcudata" => $apcudata, "stats" => $stats];
}

function perfstats_AddToDatabase($periodend, $perioddata)
{
	$taps = PERCENTILE_TAPS;
	$periodend = date('c', $periodend);
	$periodduration = PERFSTAT_PERIOD_LENGTH;
	
	$tapnames = [];
	foreach($taps as $tap) {
		$tapnames[] = "p".$tap;
	}
	$tapnames = implode(",",$tapnames);
	
	$values = [];
	foreach($perioddata["stats"] as $k => $v) {
		$name = str_replace("'","''",$k);
		$count = $v["Count"];
		$avg = $v["AverageTime"];
		
		$tapvalues = [];
		foreach($taps as $tap) {
			$tapvalues[] = $v["Percentiles"][$tap];
		}
		$tapvalues = implode(",",$tapvalues);
		
		$r2xx = $v["Status"]["2xx"];
		$r4xx = $v["Status"]["4xx"];
		$r5xx = $v["Status"]["5xx"];
		
		$values[] = "('$name','$periodend',$periodduration,$count,$avg,$tapvalues,$r2xx,$r4xx,$r5xx)";
	}
	
	if ( count($values) > 0 ) {
		
		$query = "INSERT INTO ".SH_TABLE_PREFIX.SH_TABLE_PERFSTATS." (
				apiname, 
				periodend, periodduration,
				count, avg,
				".$tapnames.",
				r2xx, r4xx, r5xx
			)
			VALUES " . implode(",",$values) . ";";
			
		// print($query); // For debugging

		db_QueryInsert($query);
	}
}

function perfstats_DeleteApcuKeys($perioddata)
{
	//foreach($perioddata["apcudata"] as $k => $v)
	//{
	//	apcu_delete($k);
	//}
	$redis = perfstats_GetRedis();
	$redis->delete(array_keys($perioddata["apcudata"]));
}

// If we crossed a time interval, collect and store the previous period's stats and remove the cache objects. 
// This should take significantly less than 100 milliseconds.
function perfstats_Cron()
{
	$currentend = perfstats_GetCurrentPeriodEnd();
	$prevperiod = $currentend - PERFSTAT_PERIOD_LENGTH;
	$key = "!SH!PERFSTATS!CRON";
	//$prevcron = apcu_fetch($key);
	$redis = perfstats_GetRedis();
	$prevcron = $redis->get($key);
	if ( $prevcron === false ) {
		$prevcron = $prevperiod; // If previous cron tag doesn't exist, assume we need to process the previous period
	}
	
	if ( ($prevcron < $currentend) && (time() >= ($prevperiod + PERFSTAT_ROLLOVER_DELAY)) ) {
		//apcu_store($key, $currentend, PERFSTAT_CACHE_TIMEOUT);
		$redis->setEx($key, PERFSTAT_CACHE_TIMEOUT, $currentend);
		// echo "Cron: Store to DB\n"; // Debugging
		// Process previous period data. 
		$data = perfstats_ComputeCachedPeriodStats($prevperiod);
		perfstats_AddToDatabase($prevperiod, $data);
		perfstats_DeleteApcuKeys($data);
	}
}




function perfstats_RecordApiPerformance($apiname, $totaltime, $code) {
	$period = perfstats_GetPeriodId();
	
	if ( $code === null ) {
		$code = 0;
	}
	
	if ( strlen($apiname) > PERFSTAT_MAX_COUNTER_LENGTH ) {
		$apiname = substr($apiname, 0, PERFSTAT_MAX_COUNTER_LENGTH);
	}

	$bucket = perfstats_HistogramBucket($totaltime);
	$microseconds = perfstats_MicrosecondTime($totaltime);

	perfstats_Accumulate($period, "all", $microseconds, $bucket, $code);
	perfstats_Accumulate($period, $apiname, $microseconds, $bucket, $code);
}

function perfstats_GetCurrentPeriodStats()
{
	$period = perfstats_GetCurrentPeriodEnd();
	$stats = perfstats_ComputeCachedPeriodStats($period);
	return $stats["stats"];
}

function perfstats_GetRecentStats($apifilter = null, $count = 48) {
	$currentend = perfstats_GetCurrentPeriodEnd();
	$querystart = $currentend - PERFSTAT_PERIOD_LENGTH * ($count+2);
	$startstring = date('c', $querystart);

	if ( $apifilter == null ) {
		$apifilter = "%";
	}
		
	$rawdata = db_QueryFetch(
			"SELECT *
			FROM ".SH_TABLE_PREFIX.SH_TABLE_PERFSTATS." 
			WHERE periodend >= '$startstring' AND
			apiname like ?;",
			$apifilter
		);

	// Reformat DB records into something consistent with what the current period stats looks like.
	$returndata = [];
	
	foreach ( $rawdata as $row ) {
		$obj = [ "Count" => $row["count"], "AverageTime" => $row["avg"], "DurationSeconds" => $row["periodduration"], "UsedTime" => 0, "RPM" => 0, "Status" => [] ];

		$obj["PeriodEnd"] = $row["periodend"];

		$obj["UsedTime"] = $obj["Count"] * $obj["AverageTime"];
		$rpm = $obj["Count"] * 60 / $obj["DurationSeconds"];
		$obj["RPM"] = $rpm;
		
		$percentile = [];
		foreach ( PERCENTILE_TAPS as $tap ) {
			$percentile[$tap] = $row["p".$tap];
		}
		$obj["Percentiles"] = $percentile;
		
		$obj["Status"]["2xx"] = $row["r2xx"];
		$obj["Status"]["4xx"] = $row["r4xx"];
		$obj["Status"]["5xx"] = $row["r5xx"];
		
		$name = $row["apiname"];
		
		if ( !isset($returndata[$name]) ) {
			$returndata[$name] = [];
		}
		
		$returndata[$name][] = $obj;
	}

	return $returndata;
}
