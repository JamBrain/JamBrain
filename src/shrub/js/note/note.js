import Fetch	 				from '../internal/fetch';

export default {
	Get,
	
	Add,
	Update
};


export function Get( node ) {
	return Fetch.Get(API_ENDPOINT+'/vx/note/get/'+node, true);
}


export function Add( id, node_type, node_subtype, node_subsubtype ) {
/*	var args = [];

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
	
	return Fetch.Post(API_ENDPOINT+'/vx/note/add/'+args.join('/'), {});
*/
}

export function Update( id, name, body, tag ) {
/*	var Data = {};
	
	if (name)
		Data.name = name;
	if (body)
		Data.body = body;
	if (tag)
		Data.tag = tag;
	
	return Fetch.Post(API_ENDPOINT+'/vx/note/update/'+id, Data);
*/
}

