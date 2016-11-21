
function doFetch( url, data ) {
	return fetch( url, {
		method: 'POST',
		credentials: 'include',
//		mode: 'cors',
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
	Activate,
	Login,
	Logout
};

export function Register( mail ) {
	return doFetch('//'+API_DOMAIN+'/vx/user/create', {
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
	return doFetch('//'+API_DOMAIN+'/vx/user/activate', {
		'id': id,
		'key': key,
		'name': name,
		'pw': password
	});
}

export function Login( name, password, secret ) {
	return doFetch('//'+API_DOMAIN+'/vx/user/login', {
		'login': name,
		'pw': password,
		'secret': secret
	});
}

export function Logout() {
	return doFetch('//'+API_DOMAIN+'/vx/user/logout', {
	});
}
