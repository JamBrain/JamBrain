export default {
	Store,
	Fetch,
	Push,
	Pop
//	Touch,
//	Expire
};


var MEMORY = [];
var MEMORY_TTL = [];


function CollectGarbage() {
	for ( var key in MEMORY_TTL ) {
		if ( Date.now() > MEMORY_TTL[key] ) {
			_RemoveTTL(key);
			_RemoveVal(key);
		}
	}
}

export function _StoreVal( key, value ) {
	return MEMORY[key] = value;
}
export function _RemoveVal( key ) {
	delete MEMORY[key];
}

export function _PushVal( key, value ) {
	if ( Array.isArray(MEMORY[key]) ) {
		return MEMORY[key].push(value);
	}
	return null;
}
export function _PopVal( key, value ) {
	if ( Array.isArray(MEMORY[key]) ) {
		var pos = MEMORY[key].indexOf(value);
		if ( pos !== -1 )
			return MEMORY[key].splice(pos, 1);
	}
	return null;
}

export function _FetchVal( key ) {
	return MEMORY[key];
}
export function _StoreTTL( key, value ) {
	return MEMORY_TTL[key] = value;
}
export function _RemoveTTL( key ) {
	delete MEMORY_TTL[key];
}
export function _FetchTTL( key ) {
	return MEMORY_TTL[key];
}


export function Store( key, value, ttl = null ) {
	// Store (or kill) the TTL
	if ( ttl ) {
		_StoreTTL(key, Date.now()+ttl);
	}
	else {
		_RemoveTTL(key);
	}

	// Store the value (it's string storage, so we JSONify)
	return _StoreVal(key, value);
}
export function Fetch( key, ttl = null ) {
	var timestamp = _FetchTTL(key);

	// Check if it's expired
	if ( timestamp ) {
		if ( Date.now() > timestamp ) {
			_RemoveTTL(key);
			_RemoveVal(key);
			return null;
		}
	}

	// Fetch the data
	var ret = _FetchVal(key);
	if ( !ret ) {
		return null;
	}

	// Update the TTL (touch)
	if ( ttl ) {
		_StoreTTL(key, Date.now()+ttl);
	}

	// Return the parsed data
	return ret;
}

export function Push( key, value, ttl = null ) {
	return _PushVal(key, value);
}
export function Pop( key, value, ttl = null ) {
	return _PopVal(key, value);
}

