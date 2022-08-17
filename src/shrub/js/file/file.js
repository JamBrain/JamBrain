export default {
	Upload,
	RequestUpload
};

export function RequestUpload( author, node, tag, data ) {
	console.log("data-req", data);

	return fetch(API_ENDPOINT+'/vx/file/upload', {
		'method': 'POST',
		'credentials': 'include',
		'mode': 'cors',
		'headers': {
			'Accept': 'application/json'
		},
		'body': JSON.stringify({
			'author': author,
			'node': node,
			'tag': tag,
			'name': data.name,
			'size': data.size,
		})
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
}

export function Upload( r, data ) {
	return fetch("http://"+r.url, {
		'method': 'PUT',
		//'credentials': 'omit',
		//'mode': 'cors',
		//'referrerPolicy': 'origin',
		'headers': {
			'X-Akamai-ACS-Action': r['X-Akamai-ACS-Action'],
			'X-Akamai-ACS-Auth-Data': r['X-Akamai-ACS-Auth-Data'],
			'X-Akamai-ACS-Auth-Sign': r['X-Akamai-ACS-Auth-Sign'],
		},
		'body': data
	})
	.then(r => {
		console.log("success", r);
		/*
		if ( r ) {
			var contentType = r.headers.get('content-type');
			if ( contentType && (contentType.indexOf("application/json") != -1) )
				return r.json();
			if ( _json_only === false )
				return r.text();
		}
		*/
		return null;
	});

}
