
class CSanitize {
	constructor() {
		this.slugify_Name = this.slugify_Name.bind(this);
		this.slugify_PathName = this.slugify_PathName.bind(this);
		this.clean_Path = this.clean_Path.bind(this);
		this.clean_Query = this.clean_Query.bind(this);
		this.clean_Hash = this.clean_Hash.bind(this);
	}

	slugify_Name( str ) {
		str = str.toLowerCase();
		str = str.replace(/%[a-f0-9]{2}/g,'-');
		str = str.replace(/[^a-z0-9]/g,'-');
		str = str.replace(/-+/g,'-');
		str = str.replace(/^-|-$/g,'');
		return str;
	}

	slugify_PathName( str ) {
		// Node slugs must be > 0
		if ( str.length && str[0] == '$' ) {
			var _id = Number.parseInt(str.substr(1));
			return (_id > 0 ? '$'+_id : '');
		}

		return this.slugify_Name(str);
	}

	// Backwards Compatible
	makeSlug( str ) {
		return this.slugify_Name(str);
	}

	clean_Path( str ) {
		var parts = str.split('/').map(this.slugify_PathName);
		return parts.join('/');
	}

	clean_Query( str ) {
		return str;
	}

	clean_Hash( str ) {
		// Hashes must be prefixed with "#"
		if ( str.length && str[0] == "#" ) {
			var query_pos = str.indexOf('?');
			var query = (query_pos != -1) ? this.clean_Query(str.substr(str.indexOf('?'))) : "";
			str = (query_pos != -1) ? str.substr(0, query_pos) : str;

			var ret = '#'+this.clean_Path(str.substr(1))+query;
			if ( ret != '#' )
				return ret;
		}

		return "";
	}

	makeClean( str ) {
		str = str.toLowerCase();
		str = str.replace(/%[a-f0-9]{2}/g,'-');		// % codes = -
		str = str.replace(/[^a-z0-9\/#]/g,'-');		// non a-z, 0-9, #, or / with -
		str = str.replace(/-+/g,'-');				// multiple -'s to a single -
		str = str.replace(/\/+/g,'/');				// multiple /'s to a single /
//		str = str.replace(/^-|-$/g,'');				// Prefix and suffix -'s with nothing
		return str;
	}
	
	trimSlashes( str ) {
		return str.replace(/^\/|\/$/g,'');
	}
	
	validateMail( mail ) {
		// http://stackoverflow.com/a/9204568/5678759
		return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail);
	}
	
	getHTTPVars() {
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
};

// Singleton
let Sanitize = new CSanitize();
export default Sanitize;
