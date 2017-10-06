import Fetch	 				from '../internal/fetch';
//import Cache	 				from '../internal/cache';
import Memory	 				from '../internal/memory';

export default {
	Get,
	GetMy,
	Add,
	Remove
};

var STORAGE = Memory;

/// ??
export function Get( node ) {
	return Fetch.Get(API_ENDPOINT+'/vx/node/love/get/'+node, true);
}

/// Returns all of my love
function _GetMy() {
	return Fetch.Get(API_ENDPOINT+'/vx/node/love/getmy', true);
}
/// Wraps the concept of getting love for a specific node
export function GetMy( node ) {
	return new Promise((resolve, reject) => {
		var key = 'NODE|LOVE|MINE';

		var Data = STORAGE.Fetch(key);
		if ( Data ) {
			if ( node )
				resolve(Data.indexOf(node) !== -1);
			else
				resolve(Data);
		}
		else {
			_GetMy()
			.then(r => {
				Data = r['my-love'];
				STORAGE.Store(key, Data);

				if ( node )
					resolve(Data.indexOf(node) !== -1);
				else
					resolve(Data);
			})
			.catch(err => {
				reject(err);
			});
		}
	});
}

export function SetMy( Data ) {
	var key = 'NODE|LOVE|MINE';
	return STORAGE.Store(key, Data);
}


export function Add( node ) {
	STORAGE.Push('NODE|LOVE|MINE', node);

	return Fetch.Get(API_ENDPOINT+'/vx/node/love/add/'+node, true);
}
export function Remove( node ) {
	STORAGE.Pop('NODE|LOVE|MINE', node);

	return Fetch.Get(API_ENDPOINT+'/vx/node/love/remove/'+node, true);
}
