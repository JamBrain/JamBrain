import Fetch	 				from '../internal/fetch';

export default {
	GetMy,
	Add,
	Remove
};

export function GetMy( event ) {
	return Fetch.Get(API_ENDPOINT+'/vx/theme/idea/getmy/'+event, true);
}

export function Add( event, idea ) {
	return Fetch.Post(API_ENDPOINT+'/vx/theme/idea/add/'+event, {
		'idea': idea
	});
}

export function Remove( event, id ) {
	return Fetch.Post(API_ENDPOINT+'/vx/theme/idea/remove/'+event, {
		'id': id
	});
}
