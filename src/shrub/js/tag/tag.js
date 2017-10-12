import Fetch	 				from '../internal/fetch';

export default {
	Get,
	GetFresh,
	GetAll,
	GetContains,
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

export function GetContains( subString ) {
	pattern = new RegExp(subString.match(/^#?(.+)/)[1], 'i');
	GetAll()
		.then( (r) => {
			const newResponse = Object.assign({}, r);
			newResponse.tag = [];
			r.tag.forEach((tag) => {
				if (tag.name.match(pattern)) {
					newResponse.tag.push(tag);
				}
			});
			return Promise.resolve(newResponse);
		});
}

export function GetAll() {
		return Get('all');
}

export function Get( filter ) {
	if ( _Exists(filter) ) {
		return Promise.resolve(_Get(filter));
	}

	return GetFresh(filter);
}

export function GetFresh( filter ) {
	return Fetch.Get(API_ENDPOINT+'/vx/tag/get/'+filter)
		.then( r => {
			if ( r.tag ) {
				_Cache(filter, r);
			}

			//r.fresh = true;	// Caching will incorrectly mark it as fresh
			return r;
		});
}
