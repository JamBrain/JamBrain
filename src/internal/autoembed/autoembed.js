
(function(){
	function AutoEmbed() {
	}

    // Constants
    var yt_thumbnail_prefix = "https://i.ytimg.com/vi/";
    var yt_thumbnail_suffix = "/maxresdefault.jpg";


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

    // if its not already an external link with a protocol and it has a dot in it
    // then make it an extrenal link becuase not internal links have dots
    if ( ret.url.indexOf('//') == -1 && ret.url.indexOf('.') != -1 /*&&
        (ret.url.indexOf('/') == -1 || ret.url.indexOf('.') < ret.url.indexOf('/')) */) {
        ret.url = 'https://' + ret.url;
    }

    if ( ret.url.indexOf('#') != -1 && ret.url.indexOf('#/') == -1 && ret.url.indexOf('//') == -1) {
        ret.url = ret.url.replace("#", "#/");
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
      ret.domain = ret.parts.shift().toLowerCase();
		}

		ret.path = ret.parts.length ? '/'+ret.parts.join('/') : '';

		return ret;
	}

	AutoEmbed.prototype.makeYouTube = function( video_id ) {

        var play = '<div class="-play" onclick="thumbToVidYT(this)">' +
                        this.makeSVGIcon('play', {"class":"-middle"}) +
                    '</div>';

        var external = '<div class="-external"><a href="https://www.youtube.com/watch?v=' + video_id + '" target="_blank" >' +
                            this.makeSVGIcon('enlarge', {"class":"-middle -block"}) +
                        '</a></div>';

        var overlay = '<div class="overlay">' +
                            play +
                            external +
                        '</div>' ;

        var thumbnail = '<div class="thumbnail">' +
                            overlay +
                            '<img src="' + yt_thumbnail_prefix + video_id + yt_thumbnail_suffix +'" />' +
                        '</div>';

        // We really should get some JSX going on in here
		return '<div class="embed-video">'+
                    thumbnail +
                '</div>';
	}

    /*AutoEmbed.prototype.thumbToVidYT = function( element ) {

        console.log(element);
        var video_id = "ly8K257P2BI";
        var video = '<div class="video" style="display:none"><iframe src="https://www.youtube.com/embed/'+ video_id + '?rel=0" frameborder="0" allowfullscreen></iframe></div>';

        //element.parentElement.parentElement.parentElement.innerHTML = video;

    }*/

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

	AutoEmbed.prototype.hasSmartLink = function( str, title, text ) {
		url = this.extractFromURL(str);

        var isMDlink = !(str == text) && text;
        var domain = url.domain;
        var path = url.path;
        if (isMDlink)
        {
            domain = text;
            path = "";
        }
		if ( url.domain ) {
			if ( url.domain.indexOf('youtube.com') !== -1 ) {
				return this.makeSmartLink('youtube', url.url, domain, path );
			}
			else if ( url.domain.indexOf('github.com') !== -1 ) {
				return this.makeSmartLink('github', url.url, domain, path );
            }
			else if ( url.domain.indexOf('twitch.tv') !== -1 ) {
				return this.makeSmartLink('twitch', url.url, domain, path );
			}
			else if ( url.domain.indexOf('reddit.com') !== -1 ) {
                return this.makeSmartLink('reddit', url.url, domain, path );
            }
			else if ( url.domain.indexOf('twitter.com') !== -1 ) {
				return this.makeSmartLink('twitter', url.url, domain, path );
			}
			else if ( url.domain.indexOf('//'+window.location.hostname) !== -1 ) {
				return this.makeLocalLink( '/'+url.parts.join('/') );
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

    // expose click handler
    window.thumbToVidYT = function( element ) {
        console.log(element);

        var thumbnail = element.parentElement.parentElement;
        console.log(thumbnail);
        console.log(thumbnail.children);

        var src = thumbnail.children[thumbnail.children.length-1].src;
        console.log(src);

        var video_id = src.substring(yt_thumbnail_prefix.length,src.length - yt_thumbnail_suffix.length );
        console.log(video_id);

        var video = '<div class="video"><iframe src="https://www.youtube.com/embed/'+ video_id + '?&autoplay=1"'+ ' frameborder="0" allowfullscreen></iframe></div>';

        console.log(video);
        thumbnail.parentElement.innerHTML = video;

    }

}());


/*function thumbToVidYT( element ) {

    console.log(element);
    //var video_id = "ly8K257P2BI";
    //var video = '<div class="video" style="display:none"><iframe src="https://www.youtube.com/embed/'+ video_id + '?rel=0" frameborder="0" allowfullscreen></iframe></div>';

    //element.parentElement.parentElement.parentElement.innerHTML = video;

}*/
