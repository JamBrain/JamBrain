import Fetch	 				from '../internal/fetch';

export default {
	GetMy,
	GetAllMy,
	GetMyList,

	Add,
	Remove
};

export function GetMy( node ) {
	return Fetch.Get(API_ENDPOINT+'/vx/grade/getmy/'+node, true);
}
export function GetAllMy( event ) {
	return Fetch.Get(API_ENDPOINT+'/vx/grade/getallmy/' + event, true);
}
export function GetMyList( node ) {
	return Fetch.Get(API_ENDPOINT+'/vx/grade/getmylist/' + node, true);
}

export function Add( node, grade, value ) {
	return Fetch.Get(API_ENDPOINT+'/vx/grade/add/'+node+'/'+grade+'/'+value, true);
}
export function Remove( node, grade ) {
	return Fetch.Get(API_ENDPOINT+'/vx/grade/remove/'+node+'/'+grade, true);
}
