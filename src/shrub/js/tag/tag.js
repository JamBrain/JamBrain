import Fetch	 				from '../internal/fetch';

export default {
	Get,
	GetFresh
};

var TAG_CACHE = {};
function _Cache( filter, value ) {
	if ( filter ) {
		TAG_CACHE['_'+filter] = value;
	}
}
function _Exists( filter ) {
	return !!TAG_CACHE['_'+filter];
}
function _Get( filter ) {
	return TAG_CACHE['_'+filter];
}


export function Get( filter ) {
	if ( _Exists(filter) ) {
		return _Get(filter);
	}
	
	return GetFresh(filter);
}
export function GetFresh( filter ) {
	return Fetch.Get(API_ENDPOINT+'/vx/tag/get/'+filter)
		.then( r => {
			if ( r.tag ) {
				_Cache(filter, r.tag);
			}
			
			r.fresh = true;
			return r;
		});
}
