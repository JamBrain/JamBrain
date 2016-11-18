
const SH_DOMAIN = 'api.ludumdare.org';
const SH_ENDPOINT = '/vx';

function doFetch( url, data ) {
	return fetch( url, {
		method: 'POST',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/x-www-form-urlencoded',
		},
		// Other encodings don't correctly send POST data for PHP
		// https://github.com/github/fetch/issues/263#issuecomment-209548790
		body: Object.keys(data).map((key) => {
			return encodeURIComponent(key) + '=' + encodeURIComponent(data[key]);
		}).join('&')
	})
	.then( r => {
		if ( r ) 
			return r.json();
	});
}

export default {
	Register,
	Activate
};

export function Register( mail ) {
	return doFetch('//'+SH_DOMAIN+SH_ENDPOINT+'/user/create', {
		'mail': mail
	});
//	.then( r => {
//		console.log("post", r);
//	})
//	.catch( err => {
//		console.log("err", err);
//	})
}

export function Activate( id, key, name, password ) {
	return doFetch('//'+SH_DOMAIN+SH_ENDPOINT+'/user/activate', {
		'id': id,
		'key': key,
		'name': name,
		'pw': password
	});
}
