import { Get, Post }			from '../../shrub/js/internal/fetch';

export default {
	GetLive
};

var EndPoint = '//jammer.tv';

export function GetLive( cats ) {
	if ( Array.isArray(cats) ) {
		cats = cats.join('+');
	}
	return Get(EndPoint+'/v1/live.php/'+cats);
}
