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
	
//	return fetch('//'+API_DOMAIN+'/vx/node/walk/'+parent+'/'+slugs.join('/'), {
//		credentials: 'include'
//	})
//	.then(r => {
//		if ( r ) 
//			return r.json();
//	});
}

//
//function _FetchByParentSlug( parent, slugs ) {
//	if ( Array.isArray(slugs) ) {
//		if (slugs.length) {
//			return parent
//		var slug = slugs.shift();
//		
//	}
//	else {
//		return 
//	}
//}

//export function FetchByParentSlug( parent, slugs ) {
//	if ( String.isString(slugs) ) {
//		slugs = [slugs];
//	}
//	
//	
//	
//	return _FetchByParentSlug( parent, slugs );
//}

export function Get( ids ) {
	if ( Number.isInteger(ids) ) {
		ids = [ids];
	}


	return Fetch.Get('//'+API_DOMAIN+'/vx/node/get/'+ids.join('+'));
	
//	return fetch('//'+API_DOMAIN+'/vx/node/get/'+ids.join('+'), {
//		credentials: 'include'
//	})
//	.then( r => {
//		if ( r ) 
//			return r.json();
//	});
}

export function GetFeed( id, types ) {
	if ( !Array.isArray(types) ) {
		types = [types];
	}

	return Fetch.Get('//'+API_DOMAIN+'/vx/node/feed/'+id+'/'+(types ? types.join("+") : ""));
	
//	return fetch('//'+API_DOMAIN+'/vx/node/feed/'+id+'/'+(types ? types.join("+") : ""), {
//		credentials: 'include'
//	})
//	.then( r => {
//		if ( r ) 
//			return r.json();
//	});	
}

export function GetMy() {
	return Fetch.Get('//'+API_DOMAIN+'/vx/node/getmy');
}
