<?php

const PERFSTAT_MAX_COUNTER_LENGTH = 64;
const PERFSTAT_PERIOD_LENGTH = 15*60;
const PERFSTAT_BUFFER_LENGTH = 10*60;

const HISTOGRAM_POWER = 1.08;
const HISTOGRAM_ORIGIN = 0.0005;
const HISTOGRAM_BUCKET_MAX = 127;
// With a base/origin value of 0.0005 (0.5 ms) and a step of 8% (1.08), +127 steps is 8.785 seconds
// So the accurate range of the histogram is 0.5ms to 8.7 seconds in logarithmic steps (smaller steps near lower values)

function perfstats_GetPeriodId() {


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
	
	$keycount = "!SH!PERFSTATS!".$countername;
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