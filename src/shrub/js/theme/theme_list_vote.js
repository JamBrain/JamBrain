import Fetch	 				from '../internal/fetch';

export default {
	GetMy,
	Yes,
	Maybe,
	No
};

export function GetMy( event ) {
	return Fetch.Get(API_ENDPOINT+'/vx/theme/list/vote/getmy/'+event, true);
}

export function Yes( theme ) {
	return Fetch.Get(API_ENDPOINT+'/vx/theme/list/vote/yes/'+theme, true);
}
export function Maybe( theme ) {
	return Fetch.Get(API_ENDPOINT+'/vx/theme/list/vote/maybe/'+theme, true);
}
export function No( theme ) {
	return Fetch.Get(API_ENDPOINT+'/vx/theme/list/vote/no/'+theme, true);
}
