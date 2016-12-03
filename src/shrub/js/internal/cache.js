export default {
	Store,
	Fetch
//	Touch,
//	Expire
};


var STORAGE = window.sessionStorage;
// ! - Time
// $ - Value


function CollectGarbage() {
	var key = "";
	for ( var idx = 0; idx < STORAGE.length; idx++ ) {
		key = STORAGE.key(idx);
		if ( key[0] == '!' ) {
			var timestamp = _Fetch(key);
		
			// Check if it's expired	
			if ( timestamp ) {
				if ( Date.now() > timestamp ) {
					_Remove('!'+key);
					_Remove('$'+key.substr(1));
				}
			}
		}
	}
}

export function _Store( key, value ) {
	return STORAGE.setItem(key, value);
}
export function _Remove( key ) {
	return STORAGE.removeItem(key);
}
export function _Fetch( key ) {
	return STORAGE.getItem(key);
}


export function Store( key, value, ttl = null ) {
	// Store (or kill) the TTL
	if ( ttl ) {
		_Store('!'+key, Date.now()+ttl);
	}
	else {
		_Remove('!'+key);
	}
	
	// Store the value (it's string storage, so we JSONify)
	return _Store('$'+key, JSON.stringify(value));
}
export function Fetch( key, ttl = null ) {
	var timestamp = _Fetch('!'+key);

	// Check if it's expired	
	if ( timestamp ) {
		if ( Date.now() > timestamp ) {
			_Remove('!'+key);
			_Remove('$'+key);
			return null;
		}
	}
	
	// Fetch the data
	var ret = _Fetch('$'+key);
	if ( !ret ) {
		return null;
	}

	// Update the TTL (touch)
	if ( ttl ) {
		_Store('!'+key, Date.now()+ttl);
	}

	// Return the parsed data
	return JSON.parse(ret);		
}
