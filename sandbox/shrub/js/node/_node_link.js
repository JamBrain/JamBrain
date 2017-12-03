import Fetch	 				from '../internal/fetch';

export default {
	Add,
	Remove
};

export function Add( a, b, data ) {
	return Fetch.Post(API_ENDPOINT+'/vx/node/link/add/'+a+'/'+b, data);
}
export function Remove( a, b, data ) {
	return Fetch.Post(API_ENDPOINT+'/vx/node/link/remove/'+a+'/'+b, data);
}
