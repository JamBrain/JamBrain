
function doFetch( url, data ) {
	return fetch( url, {
		method: 'POST',
		credentials: 'include',
//		mode: 'cors',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/x-www-form-urlencoded',
		},
		// Other encodings don't correctly send POST data for PHP
		// https://github.com/github/fetch/issues/263#issuecomment-209548790
		body: Object.keys(data).map((key) => {
			return encodeURIComponent(key) + '=' + encodeURIComponent(data[key]);
		}).join('&')
	})
	.then( r => {
		if ( r ) 
			return r.json();
	});
}

export default {
	GetMy,
	Add,
	Remove
};

//var Nodes = {};

export function GetMy( event ) {
	return fetch('//'+API_DOMAIN+'/vx/theme/idea/getmy/'+event, {
		credentials: 'include'
	})
	.then(r => {
		if ( r ) 
			return r.json();
	});
}

export function Add( event, idea ) {
	return doFetch('//'+API_DOMAIN+'/vx/theme/idea/add/'+event, {
		idea: idea
	})
	.then(r => {
		if ( r ) 
			return r.json();
	});
}

export function Remove( event, id ) {
	return doFetch('//'+API_DOMAIN+'/vx/theme/idea/remove/'+event, {
		id: id
	})
	.then(r => {
		if ( r ) 
			return r.json();
	});
}

