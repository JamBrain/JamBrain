export default {
	Upload,
	RequestUpload,
	ConfirmUpload
};

export function RequestUpload( author, node, tag, data, other_file_name ) {
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
			'name': other_file_name ? other_file_name : data.name,
			'size': data.size,
		})
	})
	.then(r => r.json().then(data => ({'ok': r.ok, ...data})));
}

export function ConfirmUpload( id, name, token, author ) {
	return fetch(API_ENDPOINT+'/vx/file/confirm', {
		'method': 'POST',
		'credentials': 'include',
		'mode': 'cors',
		'headers': {
			'Accept': 'application/json'
		},
		'body': JSON.stringify({
			'id': id,
			'name': name,
			'token': token,
			'author': author,
		})
	})
	.then(r => r.json().then(data => ({'ok': r.ok, ...data})));
}

export function Upload( request, data ) {
	return fetch("//"+request.url, {
		'method': 'PUT',
		'credentials': 'omit',
		//'mode': 'cors',
		//'referrerPolicy': 'origin',
		'headers': {
			'X-Akamai-ACS-Action': request['X-Akamai-ACS-Action'],
			'X-Akamai-ACS-Auth-Data': request['X-Akamai-ACS-Auth-Data'],
			'X-Akamai-ACS-Auth-Sign': request['X-Akamai-ACS-Auth-Sign'],
		},
		'body': data
	})
	.then(r => r.text().then(d => d.length ? {'ok': r.ok, 'status': r.status, 'data': new DOMParser().parseFromString(d, "text/xml")} : {'ok': r.ok, 'status': r.status}));
}
