import Fetch	 				from '../internal/fetch';

export default {
	Add,
	Remove
};

export function Add( node, data ) {
	return Fetch.Post(API_ENDPOINT+'/vx/node/meta/add/'+node, data);
}
export function Remove( node, data ) {
	return Fetch.Post(API_ENDPOINT+'/vx/node/meta/remove/'+node, data);
}
