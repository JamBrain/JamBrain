import Fetch	 				from '../internal/fetch';

export default {
	GetMy,
	GetInfo,
	GetGameList,

	Add,
	Remove,

	OptOut,
	OptIn
};

export function GetMy( node ) {
	return Fetch.Get(API_ENDPOINT+'/vx/grade/getmy/'+node, true);
}
export function GetInfo( node ) {
	return Fetch.Get(API_ENDPOINT+'/vx/grade/getinfo/'+node, true);
}

export function Add( node, grade, value ) {
	return Fetch.Get(API_ENDPOINT+'/vx/grade/add/'+node+'/'+grade+'/'+value, true);
}
export function Remove( node, grade ) {
	return Fetch.Get(API_ENDPOINT+'/vx/grade/remove/'+node+'/'+grade, true);
}

export function GetGameList( node ) {
	return Fetch.Get(API_ENDPOINT+'/vx/grade/getgames/' + node, true);
}

// These use the NODE API
export function OptOut( node, grade ) {

}
export function OptIn( node, grade ) {

}
