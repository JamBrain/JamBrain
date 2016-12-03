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
export function GetMy( user, node ) {
	return new Promise((resolve, reject) => {
		if ( user === 0 ) {
			reject('Bad user');
			return;
		}
		
		var key = 'NODE|LOVE|MINE|'+user;
		
		var Data = STORAGE.Fetch(key);
		if ( Data ) {
			//console.log('found',Data,node,Data.indexOf(node));
			//resolve({ 'loved': Data.indexOf(node) !== -1, 'count': Data.length });
			resolve(Data.indexOf(node) !== -1);
		}
		else {
			//console.log('fetch');
			_GetMy()
			.then(r => {
				//console.log('got',r);

				Data = r['my-love'];
				STORAGE.Store(key, Data);
				
				resolve(Data.indexOf(node) !== -1);
				//resolve({ 'loved': Data.indexOf(node) !== -1, 'count': Data.length });
			})
			.catch(err => {
				reject(err);
			});
		}
	});
}


export function Add( node ) {
	return Fetch.Get('//'+API_DOMAIN+'/vx/node/love/add/'+node);
}
export function Remove( node ) {
	return Fetch.Get('//'+API_DOMAIN+'/vx/node/love/remove/'+node);
}
