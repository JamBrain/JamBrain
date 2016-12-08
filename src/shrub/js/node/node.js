import Fetch	 				from '../internal/fetch';

export default {
	Get,
	Walk,
	GetFeed,
	
	GetMy
};

var Nodes = {};

export function Walk( parent, slugs ) {
	return Fetch.Get('//'+API_DOMAIN+'/vx/node/walk/'+parent+'/'+slugs.join('/'));
}

export function Get( ids ) {
	if ( Number.isInteger(ids) ) {
		ids = [ids];
	}

	return Fetch.Get('//'+API_DOMAIN+'/vx/node/get/'+ids.join('+'));
}

export function GetFeed( id, types ) {
	if ( !Array.isArray(types) ) {
		types = [types];
	}

	return Fetch.Get('//'+API_DOMAIN+'/vx/node/feed/'+id+'/'+(types ? types.join("+") : ""));
}

export function GetMy() {
	return Fetch.Get('//'+API_DOMAIN+'/vx/node/getmy');
}
