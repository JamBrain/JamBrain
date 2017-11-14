import Fetch	 				from '../internal/fetch';
import {InvalidateNodeCache}	from './node';

export default {
	Add,
	Remove
};

// TODO: Consider removing this... though I think these have a specific SCOPE set

export function Add( node ) {
	return Fetch.Get(API_ENDPOINT+'/vx/node/star/add/'+node, true)
		.then( r => {
			//InvalidateNodeCache(node);
			if ( r && r.caller_id ) {
				////InvalidateNodeCache(r.caller_id);
				//InvalidatePrivateData
			}
			return r;
		});
}

export function Remove( node ) {
	return Fetch.Get(API_ENDPOINT+'/vx/node/star/remove/'+node, true)
		.then( r => {
			//InvalidateNodeCache(node);
			if ( r && r.caller_id ) {
				////InvalidateNodeCache(r.caller_id);
				//InvalidatePrivateData
			}
			return r;
		});
}
