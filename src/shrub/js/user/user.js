import Fetch 				from '../internal/fetch';

export default {
	Register,
	Activate,
	Login,
	Logout,
	Get,
	Reset,
	Password,
	Have
};

export function Register( mail ) {
	return Fetch.Post(API_ENDPOINT+'/vx/user/create', {
		'mail': mail
	});
}

export function Activate( id, key, name, password ) {
	return Fetch.Post(API_ENDPOINT+'/vx/user/activate', {
		'id': id,
		'key': key,
		'name': name,
		'pw': password
	});
}

export function Login( name, password, secret ) {
	return Fetch.Post(API_ENDPOINT+'/vx/user/login', {
		'login': name,
		'pw': password,
		'secret': secret
	});
}

export function Logout() {
	return Fetch.Post(API_ENDPOINT+'/vx/user/logout', {
	});
}

export function Get() {
	return Fetch.Get(API_ENDPOINT+'/vx/user/get', true);
}

export function Reset( login ) {
	return Fetch.Post(API_ENDPOINT+'/vx/user/reset', {
		'login': login
	});
}

export function Password( id, key, password ) {
	return Fetch.Post(API_ENDPOINT+'/vx/user/password', {
		'id': id,
		'key': key,
		'pw': password
	});
}

export function Have( name, mail = null ) {
	return Fetch.Post(API_ENDPOINT+'/vx/user/have', {
		'name': name,
		'mail': mail
	});
}
