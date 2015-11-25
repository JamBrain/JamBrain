<?php

// NOTE: Any time a $key is used, it can be either a string or array of strings //

$CACHE_FETCH_COUNT = 0;
$CACHE_STORE_COUNT = 0;

function cache_GetReads() {
	global $CACHE_FETCH_COUNT;
	return $CACHE_FETCH_COUNT;
}
function cache_GetWrites() {
	global $CACHE_STORE_COUNT;
	return $CACHE_STORE_COUNT;
}

// Fetch value(s) by key(s), null on failure //
function cache_Fetch( $key ) {
	global $CACHE_FETCH_COUNT;
	$CACHE_FETCH_COUNT++;
	$success = null;
	$ret = apcu_fetch( $key, $success );
	return $success ? $ret : null;
}
// Check if key(s) exist //
function cache_Exists( $key ) {
	return apcu_exists( $key );
}

//
function cache_Store( $key, $value = null, $ttl = 0 ) {
	global $CACHE_STORE_COUNT;
	$CACHE_STORE_COUNT++;
	return apcu_store( $key, $value, $ttl );
}
// Like Store, but wont overwrite if it exists //
function cache_Create( $key, $value = null, $ttl = 0 ) {
	global $CACHE_STORE_COUNT;
	$CACHE_STORE_COUNT++;
	return apcu_add( $key, $value, $ttl );
}
// Used to update the TTL of cached values. Works like Store //
function cache_Touch( $key, $ttl = 0 ) {
	global $CACHE_STORE_COUNT;
	global $CACHE_FETCH_COUNT;
	$CACHE_STORE_COUNT++;
	$CACHE_FETCH_COUNT++;
	
	$value = apcu_fetch($key);
	if ( is_array($value) )
		return apcu_store( $value, null, $ttl );
	else
		return apcu_store( $key, $value, $ttl );
}
function cache_Inc( $key, $step = 1 ) {
	global $CACHE_STORE_COUNT;
	$CACHE_STORE_COUNT++;
	return apcu_inc( $key, $step );
}
function cache_Dec( $key, $step = 1 ) {
	global $CACHE_STORE_COUNT;
	$CACHE_STORE_COUNT++;
	return apcu_dec( $key, $step );
}
