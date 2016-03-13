
;(function(){

// Cache Library //
// Designed to have a similar syntax as the the PHP caching library //
	
// The cache uses Session Storage (free'd after closing browser) //
var storage = window.sessionStorage;
var ttlPrefix = "!!#";
var dataPrefix = "!!$";

// TODO: Add checks for setItem failure (i.e. memory full).
//   Then do a flush and try again, before failing.

window.cache_Store( key, value, ttl ) {
	// Store TTL first, then Data //
	if ( ttl )
		storage.setItem( ttlPrefix+key, Date.now()+ttl );
	else
		storage.setItem( ttlPrefix+key, Number.MAX_VALUE );
	storage.setItem( dataPrefix+key, value );

	// Success //	
	return true;
}

window.cache_Fetch( key ) {
	var ttl = storage.getItem( ttlPrefix+key );
	
	// Does it exist? //
	if ( !ttl ) {
		return null;
	}
	// Has the TTL expired? //
	else if ( Date.now() > ttl ) {
		// Remove in reverse order, just in case //
		storage.removeItem( dataPrefix+key );
		storage.removeItem( ttlPrefix+key );
		return null;
	}

	// Return Data //
	return storage.getItem( dataPrefix+key );
}

window.cache_Touch( key, new_ttl ) {
	var ttl = storage.getItem( ttlPrefix+key );

	// Does it exist? //
	if ( !ttl ) {
		return null;
	}
	// Has the TTL expired? //
	else if ( Date.now() > ttl ) {
		// Remove in reverse order, just in case //
		storage.removeItem( dataPrefix+key );
		storage.removeItem( ttlPrefix+key );
		return null;
	}

	// Update the TTL //
	if ( new_ttl )
		storage.setItem( ttlPrefix+key, Date.now()+new_ttl );
	else
		storage.setItem( ttlPrefix+key, Number.MAX_VALUE );

	// Success //
	return true;
}

window.cache_Exists( key ) {
	return storage.getItem( ttlPrefix+key ) != null;
}

window.cache_Create( key, value, ttl ) {
	if ( cache_Exists(key) )
		return false;
	
	return cache_Store( key, value, ttl );
}

// Remove expired items. 
// Optionally, specify the maximum number of items to remove.
//
// NOTE: Due to differences in browser implementations, this is not guaranteed
//   to remove all expired items. But if there is one, it will remove it.
//   Think of this as a single pass cache flush that *may* catch everything.
window.cache_Flush( max_items ) {
	var itemsRemoved = 0;
	// Reverse order, just in case keys are like an array, so removing
	// elements off the end wont give us bad indexes
	for ( var idx = Storage.length; idx--; ) {
		var key = storage.key(idx);
		// For this, we only care about items with the ttlPrefix
		if ( key.indexOf(ttlPrefix) === 0 ) {
			if ( Date.now() > storage.getItem( ttlPrefix+key ) {
				// Remove in reverse order, just in case
				storage.removeItem( dataPrefix+key );
				storage.removeItem( ttlPrefix+key );
				itemsRemoved++;
				
				// CLEVERNESS: If omitted, max_items is undefined, and
				//   itemsRemoved will always be 1+.
				if ( itemsRemoved == max_items ) {
					return itemsRemoved;
				}
			}
		}
	}
	return itemsRemoved;
}


})();
