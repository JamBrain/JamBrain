
(function(){
	window.extractFromURL = function( str ) {
		var ret = {};
		ret.origin = str.substr();

		// Hash
		var hash_pos = str.indexOf('#');
		ret.hash = '';
		if ( hash_pos != -1 ) {
			ret.hash = str.substr(hash_pos);	// with #
			str = str.substr(0, hash_pos);
		}

		// Query string
		var query_pos = str.indexOf('?');
		ret.query = '';
		ret.args = {};
		if ( query_pos != -1 ) {
			ret.query = str.substr(query_pos);	// with ?
			ret.query = ret.query.replace('&amp;','&');

			str = str.substr(0, query_pos);

			if ( ret.query.length > 1 ) {
				var raw_args = ret.query.substr(1).split('&');

				raw_args.forEach(function( val, idx, arr ) {
					var part = val.split('=');
					if ( part.length > 1 )
						ret.args[part[0]] = part[1];
					else
						ret.args[part[0]] = true;
				});
			}
		}

		// URL
		ret.url = str;

		ret.internal = false;

		if (ret.origin.indexOf('/') == 0 || ret.origin.indexOf('.') == -1) {
      //NOTE:: This check for internal links
      //NOTE:: link starting with '/', '//' or '///' are internal links
      //NOTE:: Links that don't have '.' in them have to be internal

      ret.internal = true;
		}
    else if ( (ret.url.indexOf('//') == -1) && (ret.url.indexOf('.') != -1) && (ret.url.indexOf('/') == -1 || ret.url.indexOf('.') < ret.url.indexOf('/')) ) {
      // External links without protocols need a protocol attaching to it
      // Assume HTTP. Most HTTPS sites will autoredirect to HTTPS

      ret.url = 'http://' + ret.url;
    }

		// Remap # hash anchor urls to #/
		if ( ret.internal && ret.hash.length ) {
			ret.hash = '#/' + ret.hash.substr(1);
		}

		// If it has a '//', it has a protocol and a domain (possibly an empty protocol)
		ret.body = '';
		ret.path = '';
		ret.paths = [];
		ret.domain = '';
		ret.protocol = '';
		var body_pos = ret.url.indexOf('//');
		if ( body_pos != -1 ) {
//			var url_body = ret.url.split('//');
//			ret.protocol = url_body[0].slice(0,-1).toLowerCase();
			ret.protocol = ret.url.substr(0, body_pos).toLowerCase();
			ret.body = ret.url.substr(body_pos+2)

			ret.paths = ret.body.split('/');
			ret.domain = ret.paths.shift().toLowerCase();
		}
		else {
			ret.paths = ret.url.split('/');
		}
//		else {
//			ret.parts = ret.url.split('/');
//			ret.domain = ret.parts.shift().toLowerCase();
//		}

		ret.path = ret.paths.length ? '/'+ret.paths.join('/') : '';

//		ret.path = ret.parts.length ? '/'+ret.parts.join('/') : '';

		// If we just use 'str', the &amp; isn't properly decoded
		ret.href = ret.url + (ret.query ? ret.query : '') + (ret.hash ? ret.hash : '');

    console.log(ret);

		return ret;
	}
}());
