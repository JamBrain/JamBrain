<?php
require_once __DIR__."/core.php";

/// @defgroup RateLimit
/// @brief API Rate Limiting
/// @ingroup Core

/// @addtogroup RateLimit
/// @{

// Default pool characteristics are: 5000 units per 5 minutes
const RATELIMIT_DEFAULT_POOL_SIZE = 	5000;
const RATELIMIT_DEFAULT_POOL_TIME = 	5*60;
const RATELIMIT_DEFAULT_POOL = "default";


/// Charge a certain amount of usage to a rate limiting pool
/// @param Number of units to charge the pool
/// @retval True if charge was successful
function rateLimit_Charge( $charge, $poolname = null, $poolsize = null, $pooltime = null ) {
	if ( $poolname == null ) {
		$poolname = RATELIMIT_DEFAULT_POOL;
	}
	
	$key = rateLimit_Key($poolname);
	
	if ( !apcu_exists($key) ) {
		// The key doesn't exist, so establish a new pool.
		if ( $poolsize == null ) {
			$poolsize = RATELIMIT_DEFAULT_POOL_SIZE;
		}
		if ( $pooltime == null ) {
			$pooltime = RATELIMIT_DEFAULT_POOL_TIME;
		}
		// This could fail if two requests race to add the pool, ignore the failure in that case (The pool will still exist)
		apcu_add($key, $poolsize, $pooltime);
	}
		
	$newvalue = apcu_dec($key, $charge);
	if ( $newvalue === false ) {
		// If this fails, the rate limiting variable timed out in the instant between when we checked if the pool existed earlier, and now.
		// In that case, just give the client a free pass.
		$newvalue = 0;
	}
	
	// Allow the call to succeed if the pool was not depleted before the charge was made.
	return ($newvalue + $charge) > 0;
}

/// Check how much charge remains in a rate limiting pool
/// @param Pool to use, or nothing for the default pool
/// @retval integer count of charge remaining, or null if there is no pool currently.
function rateLimit_RemainingCharge( $poolname = null ) {
	if ( $poolname == null ) {
		$poolname = RATELIMIT_DEFAULT_POOL;
	}
	
	$key = rateLimit_Key($poolname);
	
	$value = apcu_fetch($key);
	if ( $value === false ) {
		$value = null;
	}
	
	return $value;
}


function rateLimit_Key( $poolname ) {
	$userid = userAuth_GetId();
	
	if ( $userid ) {
		// User ID is available, charge to a per-user rate limiting pool
		return "!SH!RATELIMITUSER!".$poolname."!".$userid;
	} 
	else {
		// No identifying mechanism is available, charge to a remote-IP based rate limiting pool.
		$remoteip = $_SERVER["REMOTE_ADDR"];
		return "!SH!RATELIMITIP!".$poolname."!".$remoteip;		
	}
}

/// @}
