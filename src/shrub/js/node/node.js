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
	Publish
};

var Nodes = {};

export function Walk( parent, slugs ) {
	return Fetch.Get(API_ENDPOINT+'/vx/node/walk/'+parent+'/'+slugs.join('/'), true);
}

export function Get( ids ) {
	if ( Number.isInteger(ids) ) {
		ids = [ids];
	}

	return Fetch.Get(API_ENDPOINT+'/vx/node/get/'+ids.join('+'), true);
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

export function GetFeed( id, methods, types, subtypes, subsubtypes, from, limit, page ) {
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

	if ( from ) {
		query.push("from="+from);
	}
	if ( limit ) {
		query.push("limit="+limit);
	}
	if ( page ) {
		query.push("page="+page);
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

	if (name)
		Data.name = name;
	if (body)
		Data.body = body;
	if (tag)
		Data.tag = tag;

	return Fetch.Post(API_ENDPOINT+'/vx/node/update/'+id, Data);
}
