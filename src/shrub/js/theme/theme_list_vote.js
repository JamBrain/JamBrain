import Fetch	 				from '../internal/fetch';

export default {
	GetMy,
	Yes,
	Maybe,
	No
};

export function GetMy( event ) {
	return Fetch.Get('//'+API_DOMAIN+'/vx/theme/list/vote/getmy/'+event);
}

export function Yes( theme ) {
	return Fetch.Get('//'+API_DOMAIN+'/vx/theme/list/vote/yes/'+theme);
}
export function Maybe( theme ) {
	return Fetch.Get('//'+API_DOMAIN+'/vx/theme/list/vote/maybe/'+theme);
}
export function No( theme ) {
	return Fetch.Get('//'+API_DOMAIN+'/vx/theme/list/vote/no/'+theme);
}
