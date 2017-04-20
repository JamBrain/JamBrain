
(function(){
	function AutoEmbed() {
	}

	AutoEmbed.prototype.extractFromURL = function( str ) {
		var ret = {};

		// Query String and URL
		ret.query = '';
		ret.args = {};
		if ( str.indexOf('?') !== -1 ) {
			var url_split = str.split('?');
			ret.url = url_split[0];

			ret.query = url_split[1];
			var query_string_raw_args = ret.query.split('&');

			query_string_raw_args.forEach(function(val,idx,arr) {
				var part = val.split('=');
					if ( part.length > 1 )
						ret.args[part[0]] = part[1];
					else
						ret.args[part[0]] = true;
				});
		}
		else {
			ret.url = str;
		}

		// If it has a '//', it has a protocol and a domain
		if ( ret.url.indexOf('//') !== -1 ) {
			var url_body = ret.url.split('//');
			ret.protocol = url_body[0].slice(0,-1).toLowerCase();

			ret.parts = url_body[1].split('/');
			ret.domain = ret.parts.shift().toLowerCase();
		}
		else {
			ret.parts = ret.url.split('/');
		}

		ret.path = ret.parts.length ? '/'+ret.parts.join('/') : '';

		return ret;
	}

	AutoEmbed.prototype.makeYouTube = function( video_id ) {
		return '<div class="embed-video"><div><iframe '+
			'src="https://www.youtube.com/embed/'+
			video_id+
			'?rel=0" frameborder="0" allowfullscreen></iframe></div></div>';
	}

	AutoEmbed.prototype.makeSVGIcon = function( name, args ) {
		var svg_class = "svg-icon icon-"+name;
		if ( args ) {
			if ( args['class'] ) {
				svg_class += ' '+args['class'];
			}
		}
		return '<svg class="'+svg_class+'"><use xlink:href="#icon-'+name+'"></use></svg>';
	}

	// NOTE: Since these are all external, there's no need for the Navigation Capture code //
	AutoEmbed.prototype.makeSmartLink = function( icon_name, full_url, domain, part_url ) {
		return '<span class="smart-link"><a href="'+full_url+'" target="_blank" rel="noopener noreferrer"><span class="-icon-domain">'+this.makeSVGIcon(icon_name,{'class':'-baseline -small'})+'<span class="-domain">'+domain+'</span></span><span class="-the-rest">'+part_url+'</span></a></span>';
	}

	AutoEmbed.prototype.makeLocalLink = function( url ) {
		return '<span class="smart-link"><a href="'+url+'"><strong class="-the-rest">'+url+'</strong></a></span>';
	}

	AutoEmbed.prototype.makePlainLink = function( secure, full_url, domain, part_url  ) {
		if ( secure )
			return '<span class="smart-link"><a href="'+full_url+'"><strong>'+domain+'</strong>/'+part_url+'</a></span>';
		else
			return '<span class="smart-link"><a href="'+full_url+'">'+domain+'/'+part_url+'</a></span>';
	}

	AutoEmbed.prototype.hasEmbed = function( str ) {
		url = this.extractFromURL(str);

		if ( url.domain ) {
			if ( url.domain.indexOf('youtube.com') !== -1 ) {
				// This check sucks. if there's a `v=` arg, then embed it
				if ( url.args.v ) {
					return this.makeYouTube( url.args.v );
				}
			}
		}
		return false;
	}

	AutoEmbed.prototype.hasSmartLink = function( str, title ) {
		url = this.extractFromURL(str);

        console.log( url.domain + " : " + url.path + " : " + title);

		if ( url.domain ) {
			if ( url.domain.indexOf('youtube.com') !== -1 ) {
				return this.makeSmartLink('youtube', str, url.domain, url.path );
			}
			else if ( url.domain.indexOf('github.com') !== -1 ) {
                if (title){
				    return this.makeSmartLink('github', str, title, "" );
                }
                else {
                    return this.makeSmartLink('github', str, url.domain, url.path );
                }			}
			else if ( url.domain.indexOf('twitch.tv') !== -1 ) {
				return this.makeSmartLink('twitch', str, url.domain, url.path );
			}
			else if ( url.domain.indexOf('reddit.com') !== -1 ) {
                if (title){
                    return this.makeSmartLink('reddit', str, title, "" );
                }
                else {
                    return this.makeSmartLink('reddit', str, url.domain, url.path );
                }					}
			else if ( url.domain.indexOf('twitter.com') !== -1 ) {
				return this.makeSmartLink('twitter', str, url.domain, url.path );
			}
			else if ( url.domain.indexOf(window.location.hostname) !== -1 ) {
				return this.makeLocalLink( '/'+url.parts.join('/') );
			}
	//		else if ( url.indexOf('https') === 0 ) {
	//			return this.makePlainLink( true, str, url.domain, '/'+url.parts.join('/') );
	//		}
	//		else if ( url.indexOf('http') === 0 ) {
	//			return this.makePlainLink( false, str, url.domain, url.full_parts + url.query );
	//		}
	//		else {
	//			return this.makeSmartLink( 'link', str, str.split('//')[1] );
	//		}
		}
		return false;
	}

	// Intantiate
	window.autoEmbed = new AutoEmbed();
}());
