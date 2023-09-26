<?php
/// @defgroup Cache
/// Caching Module (wraps APCu)
/// @ingroup Core

/// @cond
if ( function_exists("apcu_fetch") ) {
/// @endcond

/// @name Caching Module
/// NOTE: Any time a $key is used, it can be either a string or array of strings
/// @addtogroup Cache
/// @{
	/// @cond INTERNAL
	$CACHE_FETCH_COUNT = 0;
	$CACHE_STORE_COUNT = 0;
	/// @endcond

	///	@retval {integer} how many reads from cache have occured
	function cache_GetReads() {
		global $CACHE_FETCH_COUNT;
		return $CACHE_FETCH_COUNT;
	}
	///	@retval {integer} how many writes to cache have occured
	function cache_GetWrites() {
		global $CACHE_STORE_COUNT;
		return $CACHE_STORE_COUNT;
	}
	
	/// Fetch value(s) by key(s), null on failure
	/// @param [in] $key string or array of strings
	/// @retval the value (any type), or null on failure
	function cache_Fetch( $key ) {
		global $CACHE_FETCH_COUNT;
		$CACHE_FETCH_COUNT++;
		$success = null;
		
		$ret = apcu_fetch($key, $success);
		return $success ? $ret : null;
	}
	/// Check if key(s) exist
	/// @param [in] $key string or array of strings
	/// @retval boolean or array of booleans
	function cache_Exists( $key ) {
		return apcu_exists($key);
	}
	
	/// @param [in] $key string or array of strings
	/// @param [in] $value any type or value to write
	/// @param [in] $ttl how long (in ms) value should exist for. 0 means forever
	function cache_Store( $key, $value = null, $ttl = 0 ) {
		global $CACHE_STORE_COUNT;
		$CACHE_STORE_COUNT++;
		
		// Don't write null //
		if ( isset($value) ) {
			return apcu_store($key, $value, $ttl);
		}
		return false;
	}
	/// Like Store, but wont overwrite if it exists
	/// @param [in] $key string or array of strings
	/// @param [in] $value any type or value to write
	/// @param [in] $ttl how long (in ms) value should exist for. 0 means forever
	function cache_Create( $key, $value = null, $ttl = 0 ) {
		global $CACHE_STORE_COUNT;
		$CACHE_STORE_COUNT++;
		return apcu_add($key, $value, $ttl);
	}
	/// Used to update the TTL of cached values. Works like Store
	/// @param [in] $key string or array of strings
	/// @param [in] $ttl how long (in ms) value should exist for. 0 means forever
	function cache_Touch( $key, $ttl = 0 ) {
		global $CACHE_STORE_COUNT;
		global $CACHE_FETCH_COUNT;
		$CACHE_STORE_COUNT++;
		$CACHE_FETCH_COUNT++;
		
		$value = apcu_fetch($key);
		if ( is_array($value) )
			return apcu_store($value, null, $ttl);
		else
			return apcu_store($key, $value, $ttl);
	}
	/// Delete a cached value
	function cache_Delete( $key ) {
		global $CACHE_STORE_COUNT;
		$CACHE_STORE_COUNT++;
		
		return apcu_delete($key);
	}
	/// @param [in] $key string or array of strings
	/// @param [in] $step [optional] how much to increment by
	function cache_Inc( $key, $step = 1 ) {
		global $CACHE_STORE_COUNT;
		$CACHE_STORE_COUNT++;
		return apcu_inc($key, $step);
	}
	/// @param [in] $key string or array of strings
	/// @param [in] $step [optional] how much to decrement by
	function cache_Dec( $key, $step = 1 ) {
		global $CACHE_STORE_COUNT;
		$CACHE_STORE_COUNT++;
		return apcu_dec($key, $step);
	}
/// @}

/// @cond
}
else {
	function cache_GetReads() {
		return 0;
	}
	function cache_GetWrites() {
		return 0;
	}
	function cache_Fetch( $key ) {
		return null;
	}
	function cache_Exists( $key ) {
		return false;
	}
	function cache_Store( $key, $value = null, $ttl = 0 ) {
		return false;
	}
	function cache_Create( $key, $value = null, $ttl = 0 ) {
		return false;
	}
	function cache_Delete( $key ) {
		return false;
	}
	function cache_Touch( $key, $ttl = 0 ) {
		return false;
	}
	function cache_Inc( $key, $step = 1 ) {
		return false;
	}
	function cache_Dec( $key, $step = 1 ) {
		return false;
	}
}
/// @endcond
