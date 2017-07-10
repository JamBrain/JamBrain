import Fetch	 				from '../internal/fetch';
//import Cache	 				from '../internal/cache';
//import Memory	 				from '../internal/memory';

export default {
//	Get,
	GetMy,
	Add,
	Remove
};


//var STORAGE = Memory;

//export function SetMy( node, Data ) {
//	var key = 'NOTE|LOVE|MINE|'+node;
//	return STORAGE.Store(key, Data);
//}

// Get my love of comments for a specific node
function GetMy( node ) {
	return Fetch.Get(API_ENDPOINT+'/vx/note/love/getmy/'+node, true);
}

// Add/Remove love from a specific comment * -- node is necessary, for when we start remembering what we've loved locally
export function Add( node, note ) {
//	STORAGE.Push('NOTE|LOVE|MINE|'+node, note);

	return Fetch.Get(API_ENDPOINT+'/vx/note/love/add/'+note, true);
}
export function Remove( node, note ) {
//	STORAGE.Pop('NOTE|LOVE|MINE|'+node, note);

	return Fetch.Get(API_ENDPOINT+'/vx/note/love/remove/'+note, true);
}
