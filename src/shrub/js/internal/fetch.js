export default {
	Get,
	Post
};

export function Get( _url, _credentials /*false*/, _json_only /*true*/, _headers ) {
	var response = {};
	if ( _credentials ) {
		response = Object.assign(response, {
			'credentials': 'include'
		});
	}
	
	// By default, no headers are passed
	if ( _headers ) {
		var headers = Object.assign({
			'Accept': 'application/json'
		}, _headers);
		
		response = Object.assign(response, {
			'headers': headers
		});
	}
	
	return fetch(_url, response)
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
}

export function Post( _url, _data, _credentials /*true*/, _json_only /*true*/, _headers ) {
	var response = {
		'method': 'POST'
	};

	// NOTE: Credentials default to "on" in POST, unlike GET
	if ( _credentials !== false ) {
		response = Object.assign(response, {
			'credentials': 'include',
			'mode': 'cors',
		});
	}	

	var headers = {
		'Accept': 'application/json',
		'Content-Type': 'application/x-www-form-urlencoded'
	};
	if ( _headers ) {
		headers = Object.assign(headers, _headers);
	}
	
	response = Object.assign(response, {
		'headers': headers,
		'body': Object.keys(_data).map((key) => {
			return encodeURIComponent(key) + '=' + encodeURIComponent(_data[key]);
		}).join('&')
	});

	return fetch(_url, response )	
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
}
