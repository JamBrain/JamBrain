import Fetch	 				from '../internal/fetch';

export default {
	Add,
	Remove
};

export function Add( node ) {
	return Fetch.Get(API_ENDPOINT+'/vx/node/star/add/'+node, true);
}

export function Remove( node ) {
	return Fetch.Get(API_ENDPOINT+'/vx/node/star/remove/'+node, true);
}
