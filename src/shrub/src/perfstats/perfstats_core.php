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

function perfstats_Accumulate($period, $countername, $microseconds, $bucket) {
	$keycount = "!SH!PERFSTATS!" . $period . "!" . $countername;
	$keytime = $keycount . "!TIME";
	$keybucket = $keycount . "!" . $bucket;

	// Ensure apcu records are created for this period
	apcu_add($keycount, 0, PERFSTAT_CACHE_TIMEOUT);
	apcu_add($keytime, 0, PERFSTAT_CACHE_TIMEOUT);
	apcu_add($keybucket, 0, PERFSTAT_CACHE_TIMEOUT);
	
	// Accumulate APCU records with new data
	apcu_inc($keycount, 1);
	apcu_inc($keytime, $microseconds);
	apcu_inc($keybucket, 1);
}


function perfstats_ComputeHistogramPercentiles(&$stats)
{
	$taps = [0,10,20,30,40,50,60,70,80,90,95,98,100]; // Percentiles to compute
	
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
	
	// Enumerate APCU keys for this period
	foreach (new APCUIterator("/^$keybase.*/") as $entry) {
		$apcudata[$entry["key"]] = $entry["value"];
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
								"Histogram" => [ "Origin" => HISTOGRAM_ORIGIN, "Power" => HISTOGRAM_POWER, "Buckets" => [] ] ];
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
			else {
				// This is a bucket index
				$bucket = intval($parts[1]);
				$stats[$apiname]["Histogram"]["Buckets"][$bucket] = $v;
			}
		}
	}

	// Compute percentile stats & requests/minute
	foreach($stats as $k => &$v) {
		$rpm = $v["Count"] * 60 / $durationseconds;
		$v["RPM"] = $rpm;
		if ( $v["Count"] > 0 ) { 
			$avg = $v["UsedTime"] / $v["Count"];
			$v["AverageTime"] = $avg;
		}
		
		perfstats_ComputeHistogramPercentiles($v);
	}


	return 	["apcudata" => $apcudata, "stats" => $stats];
}

function perfstats_AddToDatabase($perioddata)
{

}

function perfstats_DeleteApcuKeys($perioddata)
{

}

// If we crossed a time interval, collect and store the previous period's stats and remove the cache objects. 
// This should take significantly less than 100 milliseconds.
function perfstats_Cron()
{
	$currentend = perfstats_GetCurrentPeriodEnd();
	$prevperiod = $currentend - PERFSTAT_PERIOD_LENGTH;
	$key = "!SH!PERFSTATS!CRON";
	$prevcron = apcu_fetch($key);
	if ( $prevcron === false ) {
		$prevcron = $prevperiod; // If previous cron tag doesn't exist, assume we need to process the previous period
	}
	
	if ( ($prevcron < $currentend) && (time() >= ($prevperiod + PERFSTAT_ROLLOVER_DELAY)) ) {
		apcu_store($key, $currentend, PERFSTAT_CACHE_TIMEOUT);

		// Process previous period data. 
		$data = perfstats_ComputeCachedPeriodStats($prevperiod);
		perfstats_AddToDatabase($data);
		perfstats_DeleteApcuKeys($data);
	}
}




function perfstats_RecordApiPerformance($apiname, $totaltime) {
	$period = perfstats_GetPeriodId();
	
	if ( strlen($apiname) > PERFSTAT_MAX_COUNTER_LENGTH ) {
		$apiname = substr($apiname, 0, PERFSTAT_MAX_COUNTER_LENGTH);
	}

	$bucket = perfstats_HistogramBucket($totaltime);
	$microseconds = perfstats_MicrosecondTime($totaltime);

	perfstats_Accumulate($period, "all", $microseconds, $bucket);
	perfstats_Accumulate($period, $apiname, $microseconds, $bucket);
}

function perfstats_GetCurrentPeriodStats()
{
	$period = perfstats_GetCurrentPeriodEnd();
	$stats = perfstats_ComputeCachedPeriodStats($period);
	return $stats; // todo: Don't send back administrative data that was collected.
}
