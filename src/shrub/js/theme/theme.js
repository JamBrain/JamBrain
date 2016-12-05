import Fetch	 				from '../internal/fetch';

export default {
	GetStats
};

export function GetStats( event ) {
	return doGet('//'+API_DOMAIN+'/vx/theme/stats/'+event);
}
