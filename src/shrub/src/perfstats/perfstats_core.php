<?php

const PERFSTAT_MAX_COUNTER_LENGTH = 64;
const PERFSTAT_PERIOD_LENGTH = 15*60; // Number of seconds - Should divide evenly into a day, otherwise a period at the day transition will be missed.
const PERFSTAT_BUFFER_LENGTH = 10*60;

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

function perfstats_HistogramBucket($time) [
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
	$timeout = PERFSTAT_PERIOD_LENGTH*2 + PERFSTAT_BUFFER_LENGTH;
	
	$keycount = "!SH!PERFSTATS!" . $period . "!" . $countername;
	$keytime = $keycount . "!TIME";
	$keybucket = $keycount . "!" . $bucket;

	// Ensure apcu records are created for this period
	apcu_add($keycount, 0, $timeout);
	apcu_add($keytime, 0, $timeout);
	apcu_add($keybucket, 0, $timeout);
	
	// Accumulate APCU records with new data
	apcu_inc($keycount, 1);
	apcu_inc($keytime, $microseconds);
	apcu_inc($keybucket, 1);
}



function perfstats_ComputeCachedPeriodStats($periodend)
{


}



// If we crossed a time interval, collect and store the previous period's stats and remove the cache objects.
function perfstats_Cron()
{

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
	$stats = perfstats_ComputeCachedPeriodStats();
	return $stats; // todo: Don't send back administrative data that was collected.
}
