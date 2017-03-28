import Fetch	 				from '../internal/fetch';

export default {
	Get
};

export function Get() {
	return Fetch.Get(API_ENDPOINT+'/vx/theme/history/get', true);
}
