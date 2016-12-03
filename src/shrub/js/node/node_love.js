
function doGet( url ) {
	return fetch(url, {
		credentials: 'include'
	})
	.then(r => {
		if ( r ) 
			return r.json();
	});	
}

export default {
	Get,
	GetMy,
	Add,
	Remove
};

export function Get( node ) {
	return doGet('//'+API_DOMAIN+'/vx/node/love/get/'+node);
}
export function GetMy() {
	return doGet('//'+API_DOMAIN+'/vx/node/love/getmy/');
}

export function Add( node ) {
	return doGet('//'+API_DOMAIN+'/vx/node/love/add/'+node);
}
export function Remove( node ) {
	return doGet('//'+API_DOMAIN+'/vx/node/love/remove/'+node);
}
