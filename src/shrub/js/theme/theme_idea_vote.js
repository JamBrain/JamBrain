import Fetch	 				from '../internal/fetch';

export default {
	Get,
	GetMy,
	Yes,
	No,
	Flag
};

export function Get( event ) {
	return Fetch.Get('//'+API_DOMAIN+'/vx/theme/idea/vote/get/'+event);
}
export function GetMy( event ) {
	return Fetch.Get('//'+API_DOMAIN+'/vx/theme/idea/vote/getmy/'+event);
}


export function Yes( idea ) {
	return Fetch.Get('//'+API_DOMAIN+'/vx/theme/idea/vote/yes/'+idea);
}
export function No( idea ) {
	return Fetch.Get('//'+API_DOMAIN+'/vx/theme/idea/vote/no/'+idea);
}
export function Flag( idea ) {
	return Fetch.Get('//'+API_DOMAIN+'/vx/theme/idea/vote/flag/'+idea);
}

