import Fetch	 				from '../internal/fetch';

export default {
	Add,
	Remove
};

export function Add( node ) {
	return Fetch.Get('//'+API_DOMAIN+'/vx/node/star/add/'+node);
}

export function Remove( node ) {
	return Fetch.Get('//'+API_DOMAIN+'/vx/node/star/remove/'+node);
}
