import Fetch	 				from '../internal/fetch';

export default {
	Get,
	GetFresh,
	GetKeyed,
	GetFreshKeyed,

	Walk,
	GetFeed,

	GetMy,
	Where,
	What,

	Add,
	Update,
	Publish,

	Transform,

	AddMeta,
	RemoveMeta,
	AddLink,
	RemoveLink,

	InvalidateNodeCache,
};

var NODE_CACHE = {};
function _Cache( node ) {
	if ( node.id ) {
		NODE_CACHE[node.id] = node;
	}
}
function _Exists( node_id ) {
	return !!NODE_CACHE[node_id];
}
function _Get( node_id ) {
	return NODE_CACHE[node_id];
}

export function InvalidateNodeCache( node_id ) {
	NODE_CACHE[node_id] = null;
}

// http://stackoverflow.com/a/4026828/5678759
function ArrayDiff(a, b) {
    return a.filter(function(i) {
		return b.indexOf(i) < 0;
    });
}


// Gets 1 or more nodes. May pull from our local cache.
export function Get( ids ) {
	if ( Number.isInteger(ids) ) {
		ids = [ids];
	}

	// Detect if the incoming data is in feed format
	let feed = null;
	if ( ids.length && ids[0].modified ) {
		feed = ids;
		ids = [];
		for (let idx = 0; idx < feed.length; idx++) {
			ids.push(feed[idx].id);
		}
	}

	var nodes = [];
	var cached = [];
	for ( var idx = 0; idx < ids.length; idx++ ) {
		if ( _Exists(ids[idx]) ) {
			nodes.push(_Get(ids[idx]));
			cached.push(ids[idx]);
		}
	}

	var uncached = ArrayDiff(ids, cached);

	var ret = null;
	if ( uncached.length > 0 ) {
		ret = GetFresh(uncached);
	}
	else {
		ret = Promise.resolve({
			'cached': [],
			'node': [],
			'fresh': true,	// As fresh as nothing can be
		});
	}

	return ret.then( r => {
			// Append our locally cached values
			r.node = r.node.concat(nodes);
			r.cached = r.cached.concat(cached);
			// Inform the caller which nodes came from the local cache
			r.local = cached;

			if ( cached.length ) {
				// Actually these aren't all fresh
				r.fresh = false;
			}

			return r;
		});
}
export function GetFresh( ids ) {
	if ( Number.isInteger(ids) ) {
		ids = [ids];
	}

	return Fetch.Get(API_ENDPOINT+'/vx/node/get/'+ids.join('+'), true)
		.then( r => {
			// If any nodes were returned, update our cached copies
			if ( r.node ) {
				for ( var idx = 0; idx < r.node.length; idx++ ) {
					_Cache(r.node[idx]);
				}
			}

			// Inform the caller that these results are fresh
			r.fresh = true;

			return r;
		});
}


// generic key extractor
function _Keyed( promise, member = 'node', key = 'id' ) {
	return promise.then( r => {
		var node = r[member];

		r[member] = {};
		for ( var idx = 0; idx < node.length; idx++ ) {
			r[member][node[idx][key]] = node[idx];
		}
		return r;
	});
}


// Like Get, but nodes will be an object of keys rather than an array of objects
export function GetKeyed( ids ) {
	return Get(ids).then( r => {
		var node = r.node;
		r.node = {};
		for ( var idx = 0; idx < node.length; idx++ ) {
			r.node[node[idx].id] = node[idx];
		}
		return r;
	});
}

export function GetFreshKeyed( ids ) {
	return GetFresh(ids).then( r => {
		var node = r.node;
		r.node = {};
		for ( var idx = 0; idx < node.length; idx++ ) {
			r.node[node[idx].id] = node[idx];
		}
		return r;
	});
}



export function Walk( parent, slugs ) {
	return Fetch.Get(API_ENDPOINT+'/vx/node/walk/'+parent+'/'+slugs.join('/'), true);
}

export function GetFeed( id, methods, types, subtypes, subsubtypes, more, limit ) {
	let args = [];

	args.push(id);

	if ( methods ) {
		if ( Array.isArray(methods) ) {
			methods = methods.join("+");
		}
		args.push(methods);
	}

	// Tree of types
	if ( types ) {
		if ( Array.isArray(types) ) {
			types = types.join("+");
		}
		args.push(types);

		if ( subtypes ) {
			if ( Array.isArray(subtypes) ) {
				subtypes = subtypes.join("+");
			}
			args.push(subtypes);

			if ( subsubtypes ) {
				if ( Array.isArray(subsubtypes) ) {
					subsubtypes = subsubtypes.join("+");
				}
				args.push(subsubtypes);
			}
		}
	}

	var query = [];

	if ( more ) {
		query.push("offset="+more);
	}
	if ( limit ) {
		query.push("limit="+limit);
	}

	if ( query.length )
		query = "?"+query.join('&');

	return Fetch.Get(API_ENDPOINT+'/vx/node/feed/'+args.join('/')+query, true)
		.then( r => {

			return r;
		});
}

export function GetMy() {
	return Fetch.Get(API_ENDPOINT+'/vx/node/getmy', true);
}

export function Where() {
	return Fetch.Get(API_ENDPOINT+'/vx/node/where', true);
}

export function What( id ) {
	return Fetch.Get(API_ENDPOINT+'/vx/node/what/'+id, true);
}


export function Add( id, node_type, node_subtype, node_subsubtype ) {
	var args = [];

	args.push(id);

	if ( node_type ) {
		args.push(node_type);
	}
	if ( node_subtype ) {
		args.push(node_subtype);
	}
	if ( node_subsubtype ) {
		args.push(node_subsubtype);
	}

	return Fetch.Post(API_ENDPOINT+'/vx/node/add/'+args.join('/'), {});

}
export function Publish( id ) {
	return Fetch.Post(API_ENDPOINT+'/vx/node/publish/'+id, {})
		.then( r => {
			InvalidateNodeCache(id);
			return r;
		});
}

export function Update( id, name, body, tag ) {
	var Data = {};

	if ( name )
		Data.name = name;
	if ( body )
		Data.body = body;
	if ( tag )
		Data.tag = tag;

	return Fetch.Post(API_ENDPOINT+'/vx/node/update/'+id, Data)
		.then( r => {
			InvalidateNodeCache(id);
			return r;
		});
}


export function Transform( id, type, subtype, subsubtype ) {
	var new_type = type;
	if ( subtype )
		new_type += '/'+subtype;
	if ( subsubtype )
		new_type += '/'+subsubtype;

	return Fetch.Post(API_ENDPOINT+'/vx/node/transform/'+id+'/'+new_type, {})
		.then( r => {
			InvalidateNodeCache(id);
			return r;
		});
}

export function AddMeta( id, data ) {
	return Fetch.Post(API_ENDPOINT+'/vx/node/meta/add/'+id, data);
}
export function RemoveMeta( id, data ) {
	return Fetch.Post(API_ENDPOINT+'/vx/node/meta/remove/'+id, data);
}
export function AddLink( a, b, data ) {
	return Fetch.Post(API_ENDPOINT+'/vx/node/link/add/'+a+'/'+b, data);
}
export function RemoveLink( a, b, data ) {
	return Fetch.Post(API_ENDPOINT+'/vx/node/link/remove/'+a+'/'+b, data);
}
