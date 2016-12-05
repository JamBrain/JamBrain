import Fetch	 				from '../internal/fetch';

export default {
	Get
};

export function Get( event ) {
	return Fetch.Get('//'+API_DOMAIN+'/vx/theme/list/get/'+event);
}
