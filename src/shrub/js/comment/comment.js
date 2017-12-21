import Fetch	 				from '../internal/fetch';

export default {
	Get,
	Pick,

	Add,
	Remove,
	Update
};


export function Get( node ) {
	return Fetch.Get(API_ENDPOINT+'/vx/comment/get/'+node, true);
}

export function Pick( comments ) {
	if ( Number.isInteger(comments) ) {
		comments = [comments];
	}

	return Fetch.Get(API_ENDPOINT+'/vx/comment/getcomment/'+comments.join('+'), true);
}

export function Add( parent, node, body, tag, anonymous ) {
	var Data = {};

	if ( Number.isInteger(parent) )
		Data.parent = parent;
	if ( body )
		Data.body = body;
	if ( tag )
		Data.tag = tag;

	if ( anonymous ) {
		Data.anonymous = anonymous;
	}

	return Fetch.Post(API_ENDPOINT+'/vx/comment/add/'+node, Data);
}

export function Remove( comment_id ) {
	return false;
}

export function Update( id, node, body, tag ) {
	var Data = {};

	if ( node )
		Data.node = node;
	if ( body )
		Data.body = body;
	if ( tag )
		Data.tag = tag;

	return Fetch.Post(API_ENDPOINT+'/vx/comment/update/'+id, Data);
}
