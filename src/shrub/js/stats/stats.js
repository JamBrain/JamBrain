import Fetch	 				from '../internal/fetch';

export default {
	Get,
	GetApiStats
};

export function Get( node_id ) {
	return Fetch.Get(API_ENDPOINT+'/vx/stats/'+node_id, true);
}

export function GetApiStats( ) {
	return Fetch.Get(API_ENDPOINT+'/vx/stats/api', true);
}
