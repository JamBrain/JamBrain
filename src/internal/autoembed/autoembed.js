
(function(){
	function AutoEmbed() {
	}

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

		// if its not already an external link with a protocol and it has a dot in it
		// then make it an external link becuase not internal links have dots
		if ( (ret.url.indexOf('//') == -1) && (ret.url.indexOf('.') != -1) && (ret.url.indexOf('/') == -1 || ret.url.indexOf('.') < ret.url.indexOf('/')) ) {
			// Assume HTTP. Most HTTPS sites will autoredirect to HTTPS
			ret.url = 'http://' + ret.url;
		}
		else if ( ret.url.indexOf('//') == -1 ) {
			ret.internal = true;
		}

		// Original # hash anchor remap function
		//if ( ret.url.indexOf('#') != -1 && ret.url.indexOf('#/') == -1 && ret.url.indexOf('//') == -1) {
		//	ret.url = ret.url.replace("#", "#/");
		//}
	
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

		return ret;
	}


	// Constants
	var yt_thumbnail_prefix = "https://i.ytimg.com/vi/";
	var yt_thumbnail_suffix = "/mqdefault.jpg";
	
	AutoEmbed.prototype.makeYouTube = function( str ) {
		var url = extractFromURL(str);
		var video_id = url.args.v;
		
		var play = (
			'<div class="-play">' +
				this.makeSVGIcon('play', {"class":"-middle"}) +
			'</div>'
		);
		var external = (
//			'<div class="-external"><a href="https://www.youtube.com/watch?v=' + video_id + (args ? args : '') + '" target="_blank" onclick="arguments[0].stopPropagation()">' +
			'<div class="-external"><a href="'+str+'" target="_blank" onclick="arguments[0].stopPropagation()">' +
				this.makeSVGIcon('youtube', {"class":"-middle -block"}) +
			'</a></div>'
		);
	
		var overlay = (
			'<div class="-overlay" onclick="thumbToVidYT(this)" href="'+str+'"> ' +
				play +
				external +
			'</div>'
		);
	
		var thumbnail = (
			'<div class="-thumbnail">' +
				overlay +
				'<img src="' + yt_thumbnail_prefix + video_id + yt_thumbnail_suffix +'" />' +
			'</div>'
		);
	
		// We really should get some JSX going on in here
		// MK: ya
		return (
			'<div class="embed-video">'+
				thumbnail +
			'</div>'
		);
	}

	// expose click handler
	window.thumbToVidYT = function( element ) {
		var href = element.attributes.href.value;
		var url = extractFromURL(href);
		var video_id = url.args.v;
		
//		console.log(video_id, url);
		
		var args = ['autoplay=1'];
		if ( url.args.t ) {
			args.push('start='+parseInt(url.args.t));
		}
	
		var thumbnail = element.parentElement;//.parentElement;
		//console.log(thumbnail);
		//console.log(thumbnail.children);
	
		var src = thumbnail.children[thumbnail.children.length-1].src;
		//console.log(src);
	
//		var video_id = src.substring(yt_thumbnail_prefix.length, src.length - yt_thumbnail_suffix.length );
		//console.log(video_id);
	
//		var video = '<div class="-video"><iframe src="https://www.youtube.com/embed/'+ video_id + '?&autoplay=1"'+ ' frameborder="0" allowfullscreen></iframe></div>';
		var video = '<div class="-video"><iframe src="https://www.youtube.com/embed/'+ video_id + '?' + args.join('&') + '" frameborder="0" allowfullscreen></iframe></div>';
	
		//console.log(video);
		thumbnail.parentElement.innerHTML = video;
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

	// NOTE: Since these are all external, there's no need for the Navigation Capture code
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
		if ( str ) {
			url = extractFromURL(str);

			if ( url.domain ) {
				if ( url.domain.indexOf('youtube.com') !== -1 ) {
					if ( (url.paths && url.paths[0] == 'watch') && url.args.v ) {
						return this.makeYouTube(str);
					}
				}
			}
		}
		return false;
	}

	AutoEmbed.prototype.hasSmartLink = function( str, title, text ) {
		url = extractFromURL(str);

	    var lit = url.domain.replace('www.','');
	    var unlit = url.path + url.query + url.hash;
	    // If some text is set, prefer that for the URL
	    if ( !(str == text) && text ) {
	        lit = text;
	        unlit = "";
	    }

		if ( url.domain ) {
			if ( url.domain.indexOf('youtube.com') !== -1 ) {
				return this.makeSmartLink('youtube', url.href, lit, unlit );
			}
			else if ( url.domain.indexOf('github.com') !== -1 ) {
				return this.makeSmartLink('github', url.href, lit, unlit );
            }
			else if ( url.domain.indexOf('twitch.tv') !== -1 ) {
				return this.makeSmartLink('twitch', url.href, lit, unlit );
			}
			else if ( url.domain.indexOf('reddit.com') !== -1 ) {
                return this.makeSmartLink('reddit', url.href, lit, unlit );
            }
			else if ( url.domain.indexOf('twitter.com') !== -1 ) {
				return this.makeSmartLink('twitter', url.href, lit, unlit );
			}
			else if ( url.domain.indexOf('soundcloud.com') !== -1 ) {
				return this.makeSmartLink('soundcloud', url.href, lit, unlit );
			}
			else if ( url.domain.indexOf('//'+window.location.hostname) !== -1 ) {
				return this.makeLocalLink( url.path+url.query+url.hash );
			}
	//		else if ( url.indexOf('https') === 0 ) {
	//			return this.makePlainLink( true, str, url.domain, '/'+url.parts.join('/') );
	//		}
	//		else if ( url.indexOf('http') === 0 ) {
	//			return this.makePlainLink( false, str, url.domain, url.full_parts + url.query );
	//		}
	//		else {
	//			return this.makeSmartLink( 'link', str, domain, path );
	//		}
		}
		return false;
	}

	// Intantiate
	window.autoEmbed = new AutoEmbed();
}());
