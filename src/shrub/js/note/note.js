import Fetch	 				from '../internal/fetch';

export default {
	Get,
	Pick,
	Add,
	Update
};


export function Get( node ) {
	return Fetch.Get(API_ENDPOINT+'/vx/note/get/'+node, true);
}

export function Pick( notes ) {
	if ( Number.isInteger(notes) ) {
		notes = [notes];
	}

	return Fetch.Get(API_ENDPOINT+'/vx/note/getnote/'+notes.join('+'), true);
}

export function Add( parent, node, body, tag ) {
	var Data = {};
	
	if ( Number.isInteger(parent) )
		Data.parent = parent;
	if ( body )
		Data.body = body;
	if ( tag )
		Data.tag = tag;
	
	return Fetch.Post(API_ENDPOINT+'/vx/note/add/'+node, Data);
}

export function Update( id, node, body, tag ) {
	var Data = {};
	
	if ( node )
		Data.node = node;
	if ( body )
		Data.body = body;
	if ( tag )
		Data.tag = tag;
	
	return Fetch.Post(API_ENDPOINT+'/vx/note/update/'+id, Data);
}
