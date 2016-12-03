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

export function Get( node ) {
	return Fetch.Get('//'+API_DOMAIN+'/vx/node/love/get/'+node);
}

function _GetMy() {
	return Fetch.Get('//'+API_DOMAIN+'/vx/node/love/getmy/');
}
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
			//console.log('fetch');
			_GetMy()
			.then(r => {
				//console.log('got',r);

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

	return Fetch.Get('//'+API_DOMAIN+'/vx/node/love/add/'+node);
}
export function Remove( node ) {
	STORAGE.Pop('NODE|LOVE|MINE', node);

	return Fetch.Get('//'+API_DOMAIN+'/vx/node/love/remove/'+node);
}
