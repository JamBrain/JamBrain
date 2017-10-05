import Fetch	 				from '../internal/fetch';

export default {
	Upload
};

export function Upload( author, data ) {
	var fd = new FormData();
	fd.append('asset', data);

	return fetch(API_ENDPOINT+'/vx/asset/upload/'+author, {
		'method': 'POST',
		'credentials': 'include',
		'mode': 'cors',
		'headers': {
			'Accept': 'application/json',
//			'Content-Type': 'application/x-www-form-urlencoded'
		},
		'body': fd
	})
	.then(r => {
		if ( r ) {
			var contentType = r.headers.get('content-type');
			if ( contentType && (contentType.indexOf("application/json") != -1) )
				return r.json();
			if ( _json_only === false )
				return r.text();
		}
		return null;
	});


//	return Fetch.Post(, data);
}
