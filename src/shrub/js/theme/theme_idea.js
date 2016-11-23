
export default {
	GetMy
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

