import { Get, Post }			from '../../shrub/js/internal/fetch';
import Cache					from '../../shrub/js/internal/cache';

export default {
	GetLive
};

const EndPoint = '//api.jammer.tv';
const CacheName = "JammerTV|";
const TTL = 30 * 1000;

export function GetLive( cats ) {
	if ( Array.isArray(cats) ) {
		cats = cats.join('+');
	}

	var data = Cache.Fetch(CacheName+cats);

	if ( data ) {
		return Promise.resolve(data);
	}

	return Get(EndPoint+'/v1/get/cat/'+cats)
		.then((r) => {
			Cache.Store(CacheName+cats, r, TTL);

			return r;
		});
}
