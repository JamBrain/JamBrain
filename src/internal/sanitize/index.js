
export function	slugify_Name( str ) {
	str = str.toLowerCase();
	str = str.replace(/%[a-f0-9]{2}/g,'-');
	str = str.replace(/[^a-z0-9]/g,'-');
	str = str.replace(/-+/g,'-');
	str = str.replace(/^-|-$/g,'');
	return str;
}

export function slugify_PathName( str ) {
	// Node slugs must be > 0
	if ( str.length && str[0] == '$' ) {
		var _id = Number(str.slice(1));
		return (_id > 0 ? '$'+_id : '');
	}

	return slugify_Name(str);
}

export function sanitize_URI( str ) {
	// From marked/Renderer.js
	try {
		var Protocol = decodeURIComponent(unescape(str)).replace(/[^\w:]/g, '').toLowerCase();
	}
	catch (e) {
		return '';
	}

	if ( Protocol.indexOf('javascript:') === 0 || Protocol.indexOf('vbscript:') === 0 || Protocol.indexOf('data:') === 0 ) {
		return '';
	}
	return str;
}

// Backwards Compatible
export function makeSlug( str ) {
	return slugify_Name(str);
}

export function clean_Path( str ) {
	var parts = str.split('/').map(slugify_PathName);
	return parts.join('/');
}

export function clean_Query( str ) {
	return str;
}

export function clean_Hash( str ) {
	// Hashes must be prefixed with "#"
	if ( str.length && str[0] == "#" ) {
		var query_pos = str.indexOf('?');
		// MK: substr is deprecated. Use slice or substring.
		var query = (query_pos != -1) ? clean_Query(str.substr(str.indexOf('?'))) : "";
		str = (query_pos != -1) ? str.substr(0, query_pos) : str;

		var ret = '#'+clean_Path(str.substr(1))+query;
		if ( ret != '#' )
			return ret;
	}

	return "";
}

export function makeClean( str ) {
	str = str.toLowerCase();
	str = str.replace(/%[a-f0-9]{2}/g,'-');		// % codes = -
	str = str.replace(/[^a-z0-9\/#]/g,'-');		// non a-z, 0-9, #, or / with -
	str = str.replace(/-+/g,'-');				// multiple -'s to a single -
	str = str.replace(/\/+/g,'/');				// multiple /'s to a single /
//		str = str.replace(/^-|-$/g,'');				// Prefix and suffix -'s with nothing
	return str;
}

export function trimSlashes( str ) {
	return str.replace(/^\/|\/$/g,'');
}

export function validateMail( mail ) {
	// http://stackoverflow.com/a/9204568/5678759
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail);
}

export function parseHash( raw_hash ) {
	var ret = {
		'path': "",
		'extra': [],
		'args': {}
	};

	if ( !raw_hash.length )
		return ret;

	var query_pos = raw_hash.indexOf('?');
	var query = (query_pos != -1) ? raw_hash.slice(query_pos+1) : '';
	if ( query.length ) {
		query.split('&').forEach(v => {
			let _var = v.split('=');
			ret.args[_var[0]] = (_var.length > 1) ? _var[1] : true;
		});
	}

	// MK: substr is deprecated. Use slice or substring.
	var full_path = (query_pos != -1) ? raw_hash.substr(1, query_pos-1) : raw_hash.substr(1);
	ret.extra = full_path.split('/');
	ret.path = ret.extra.shift();

	return ret;
}

export function getHTTPVars() {
	var ret = {};

	if (location.search) {
		var parts = location.search.substring(1).split('&');

		for (var i = 0; i < parts.length; i++) {
			var nv = parts[i].split('=');
			if (!nv[0]) continue;
			ret[nv[0]] = nv[1] || true;
		}
	}

	return ret;
}

export default {
	slugify_Name,
	slugify_PathName,
	sanitize_URI,
	makeSlug,
	clean_Path,
	clean_Query,
	clean_Hash,
	makeClean,
	trimSlashes,
	validateMail,
	parseHash,
	getHTTPVars,
};
