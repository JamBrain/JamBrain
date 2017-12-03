import Fetch	 				from '../internal/fetch';
import { InvalidateNodeCache } from './node';

export default {
	Add,
	Remove
};

export function Add( node, data ) {
	InvalidateNodeCache(node);
	return Fetch.Post(API_ENDPOINT+'/vx/node/meta/add/'+node, data);
}
export function Remove( node, data ) {
	InvalidateNodeCache(node);
	return Fetch.Post(API_ENDPOINT+'/vx/node/meta/remove/'+node, data);
}
