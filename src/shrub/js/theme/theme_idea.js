import Fetch	 				from '../internal/fetch';

export default {
	GetMy,
	Add,
	Remove
};

//var Nodes = {};

export function GetMy( event ) {
	return Fetch.Get('//'+API_DOMAIN+'/vx/theme/idea/getmy/'+event);
}

export function Add( event, idea ) {
	return Fetch.Post('//'+API_DOMAIN+'/vx/theme/idea/add/'+event, {
		'idea': idea
	});
}

export function Remove( event, id ) {
	return Fetch.Post('//'+API_DOMAIN+'/vx/theme/idea/remove/'+event, {
		'id': id
	});
}

