
function doGet( url ) {
	return fetch(url, {
		credentials: 'include'
	})
	.then(r => {
		if ( r ) 
			return r.json();
	});	
}

function doPost( url, data ) {
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
	return doGet('//'+API_DOMAIN+'/vx/theme/idea/getmy/'+event);
}

export function Add( event, idea ) {
	return doPost('//'+API_DOMAIN+'/vx/theme/idea/add/'+event, {
		idea: idea
	});
}

export function Remove( event, id ) {
	return doPost('//'+API_DOMAIN+'/vx/theme/idea/remove/'+event, {
		id: id
	});
}

