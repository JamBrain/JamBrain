import Fetch	 				from '../internal/fetch';

export default {
	GetMy,
	GetMyList,

	Add,
	Remove,

	OptOut,
	OptIn
};

export function GetMy( node ) {
	return Fetch.Get(API_ENDPOINT+'/vx/grade/getmy/'+node, true);
}

export function Add( node, grade, value ) {
	return Fetch.Get(API_ENDPOINT+'/vx/grade/add/'+node+'/'+grade+'/'+value, true);
}
export function Remove( node, grade ) {
	return Fetch.Get(API_ENDPOINT+'/vx/grade/remove/'+node+'/'+grade, true);
}

export function GetMyList( node ) {
	return Fetch.Get(API_ENDPOINT+'/vx/grade/getmylist/' + node, true);
}

// These use the NODE API
export function OptOut( node, grade ) {

}
export function OptIn( node, grade ) {

}
