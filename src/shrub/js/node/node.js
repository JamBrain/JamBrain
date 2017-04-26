import Fetch	 				from '../internal/fetch';

export default {
	Get,
	GetKeyed,
	Walk,
	GetFeed,
	
	GetMy,
	Where,
	What,
	
	Add,
	Update,
	Publish,

	Transform
};

var Nodes = {};

export function Walk( parent, slugs ) {
	return Fetch.Get(API_ENDPOINT+'/vx/node/walk/'+parent+'/'+slugs.join('/'), true);
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

// Gets 1 or more nodes. May pull from our local cache.
export function Get( ids ) {
	// TODO: check for cached results here
	
	return GetFresh(ids);
}
export function GetFresh( ids ) {
	if ( Number.isInteger(ids) ) {
		ids = [ids];
	}
	
	// TODO: do caching of results here

	return Fetch.Get(API_ENDPOINT+'/vx/node/get/'+ids.join('+'), true);
}

// Like Get, but nodes will be an object of keys rather than an array of objects
export function GetKeyed( ids ) {
	return GetFreshKeyed(ids);
}
export function GetFreshKeyed( ids ) {
	return Get(ids).then( r => {
		var node = r.node;
		r.node = {};
		for ( var idx = 0; idx < node.length; idx++ ) {
			r.node[node[idx].id] = node[idx];
		}
		return r;
	});
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

	return Fetch.Get(API_ENDPOINT+'/vx/node/feed/'+args.join('/')+query, true);
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
	return Fetch.Post(API_ENDPOINT+'/vx/node/publish/'+id, {});
}

export function Update( id, name, body, tag ) {
	var Data = {};

	if ( name )
		Data.name = name;
	if ( body )
		Data.body = body;
	if ( tag )
		Data.tag = tag;

	return Fetch.Post(API_ENDPOINT+'/vx/node/update/'+id, Data);
}


export function Transform( id, type, subtype, subsubtype ) {
	var new_type = type;
	if ( subtype )
		new_type += '/'+subtype;
	if ( subsubtype )
		new_type += '/'+subsubtype;
	
	return Fetch.Post(API_ENDPOINT+'/vx/node/transform/'+id+'/'+new_type, {});
}
