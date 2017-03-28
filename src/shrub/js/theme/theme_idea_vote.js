import Fetch	 				from '../internal/fetch';

export default {
	Get,
	GetMy,
	Yes,
	No,
	Flag
};

export function Get( event ) {
	return Fetch.Get(API_ENDPOINT+'/vx/theme/idea/vote/get/'+event, true);
}
export function GetMy( event ) {
	return Fetch.Get(API_ENDPOINT+'/vx/theme/idea/vote/getmy/'+event, true);
}


export function Yes( idea ) {
	return Fetch.Get(API_ENDPOINT+'/vx/theme/idea/vote/yes/'+idea, true);
}
export function No( idea ) {
	return Fetch.Get(API_ENDPOINT+'/vx/theme/idea/vote/no/'+idea, true);
}
export function Flag( idea ) {
	return Fetch.Get(API_ENDPOINT+'/vx/theme/idea/vote/flag/'+idea, true);
}

