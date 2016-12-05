import Fetch	 				from '../internal/fetch';

export default {
	Get
};

export function Get( event ) {
	return doGet('//'+API_DOMAIN+'/vx/theme/list/get/'+event);
}
