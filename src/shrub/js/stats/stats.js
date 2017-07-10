import Fetch	 				from '../internal/fetch';

export default {
	Get
};

export function Get( node_id ) {
	return Fetch.Get(API_ENDPOINT+'/vx/stats/'+node_id, true);
}
