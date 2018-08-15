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
    return a.filter( i => {
		return b.indexOf(i) < 0;
    });
}


// Gets 1 or more nodes. May pull from our local cache.
// Support Id+FeedDate syntax
export function Get( ids, argArray ) {
	if ( Number.isInteger(ids) ) {
		ids = [ids];
	}

	// Detect if the incoming data is in feed format
	let feed = null;
	if ( ids.length && ids[0].modified ) {
		// 'ids' contains a feed. the rest of the code expects 'ids' to be an array of id's
		feed = ids;
		ids = [];
		for (let idx = 0; idx < feed.length; idx++) {
			let node_id = feed[idx].id;
			ids.push(node_id);

			// While we're rebuilding 'ids', scan the cache and invalidate if the feed date is newer
			let node = _Get(node_id);
			if ( node && (feed[idx].modified > node.modified) ) {
				//console.log("Node "+node_id+" was Invalidated ("+feed[idx].modified+" > "+node.modified+")");
				InvalidateNodeCache(node_id);
			}
		}
	}

	// Step one: Fetch everything we have in cache
	let nodes = [];
	let cachedIds = [];
	let requestedIds = [];
	for ( let idx = 0; idx < ids.length; ++idx ) {
		let id = ids[idx];
		if ( _Exists(id) ) {
			cachedIds.push(id);
			let node = _Get(id);
			nodes.push(node);

			// if any arguments were included, be sure we apply the same filters on anything we cached
			if ( argArray && argArray.length ) {
				if ( argArray.includes('author') )
					requestedIds.push(node.author);
				if ( argArray.includes('parent') )
					requestedIds.push(node.parent);
				if ( argArray.includes('superparent') )
					requestedIds.push(node.superparent);

				if ( argArray.includes('authors') && node.meta.authors )
					requestedIds.concat(node.meta.authors);
				if ( argArray.includes('parents') && node.parents )
					requestedIds.concat(node.parents);
			}
		}
	}

	// Step two: scan the requests, and also add them
	for ( let idx = 0; idx < requestedIds.length; ++idx ) {
		let id = requestedIds[idx];
		if ( !cachedIds.includes(id) && _Exists(id) ) {
			cachedIds.push(id);
			let node = _Get(id);
			nodes.push(node);
		}
	}

	let uncachedIds = ArrayDiff(ids, cachedIds);

	let ret = null;
	if ( uncachedIds.length > 0 ) {
		ret = GetFresh(uncachedIds, argArray);
	}
	else {
		ret = Promise.resolve({
			'nodes_cached': [],
			'node': [],
			'fresh': true,	// As fresh as nothing can be
		});
	}

	return ret.then( r => {
		// Append our locally cached values
		r.node = r.node.concat(nodes);
		r.nodes_cached = r.nodes_cached.concat(cachedIds);
		// Inform the caller which nodes came from the local cache
		r.local = cachedIds;

		if ( cachedIds.length ) {
			// Actually these aren't all fresh
			r.fresh = false;
		}

		return r;
	});
}

// Always gets "fresh" nodes
// DOES NOT support Id+FeedDate format
export function GetFresh( ids, argArray ) {
	if ( Number.isInteger(ids) ) {
		ids = [ids];
	}

	// Build a querystring for arguments
	let args = "";
	if ( argArray && argArray.length ) {
		args = "?" + argArray.join("&");
	}

	// Fetch the actual data
	return Fetch.Get(API_ENDPOINT+'/vx/node2/get/'+ids.join('+')+args)
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
		let node = r[member];

		r[member] = {};
		for ( let idx = 0; idx < node.length; ++idx ) {
			r[member][node[idx][key]] = node[idx];
		}
		return r;
	});
}


// Like Get, but nodes will be an object of keys rather than an array of objects
// Supports Id+FeedDate format (because it uses Get)
export function GetKeyed( ids, argArray ) {
	return Get(ids, argArray).then( r => {
		let node = r.node;
		r.node = {};
		for ( let idx = 0; idx < node.length; ++idx ) {
			_Cache(node[idx]);
			r.node[node[idx].id] = node[idx];
		}
		return r;
	});
}

// DOES NOT support Id+FeedDate format
export function GetFreshKeyed( ids, argArray ) {
	return GetFresh(ids, argArray).then( r => {
		let node = r.node;
		r.node = {};
		for ( let idx = 0; idx < node.length; ++idx ) {
			_Cache(node[idx]);
			r.node[node[idx].id] = node[idx];
		}
		return r;
	});
}


export function Walk( parent, slugs, argArray ) {
	// Build a querystring for arguments
	let args = "";
	if ( argArray && argArray.length ) {
		args = "?" + argArray.join("&");
	}

	// Do keyed fetch
	return Fetch.Get(API_ENDPOINT+'/vx/node2/walk/'+parent+'/'+slugs.join('/')+args).then( r => {
		let node = r.node;
		r.node = {};
		for ( let idx = 0; idx < node.length; ++idx ) {
			_Cache(node[idx]);
			r.node[node[idx].id] = node[idx];
		}
		return r;
	});
}

export function GetFeed( id, methods, types, subtypes, subsubtypes, tags, offset, limit ) {
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

	if ( tags ) {
		if ( tags.length && tags.join ) {
			query.push("tags="+tags.join('+'));
		}
		else {
			query.push("tags="+tags);
		}
	}

	if ( offset ) {
		query.push("offset="+offset);
	}
	if ( limit ) {
		query.push("limit="+limit);
	}

	if ( query.length )
		query = "?"+query.join('&');

	return Fetch.Get(API_ENDPOINT+'/vx/node/feed/'+args.join('/')+query)
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
	return Fetch.Post(API_ENDPOINT+'/vx/node/meta/add/'+id, data)
		.then( r => {
			InvalidateNodeCache(id);
			return r;
		});
}
export function RemoveMeta( id, data ) {
	return Fetch.Post(API_ENDPOINT+'/vx/node/meta/remove/'+id, data)
		.then( r => {
			InvalidateNodeCache(id);
			return r;
		});
}
export function AddLink( a, b, data ) {
	return Fetch.Post(API_ENDPOINT+'/vx/node/link/add/'+a+'/'+b, data)
		.then( r => {
			InvalidateNodeCache(a);
			InvalidateNodeCache(b);
			return r;
		});
}
export function RemoveLink( a, b, data ) {
	return Fetch.Post(API_ENDPOINT+'/vx/node/link/remove/'+a+'/'+b, data)
		.then( r => {
			InvalidateNodeCache(a);
			InvalidateNodeCache(b);
			return r;
		});
}
