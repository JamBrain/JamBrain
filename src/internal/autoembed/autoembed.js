
(function(){
	function AutoEmbed() {
	}
	
	AutoEmbed.prototype.extractFromURL = function( str ) {
		var ret = {};
		var url_split = str.split('?');
		ret.url = url_split[0];
		var url_body = ret.url.split('//');
		ret.protocol = url_body[0].slice(0,-1).toLowerCase();
		var url_parts = url_body[1].split('/');
		ret.domain = url_parts.shift().toLowerCase();
		ret.path = url_parts;

		ret.args = {};

		if ( url_split.length > 1 ) {
			ret.query = url_split[1];
			var query_string_raw_args = ret.query.split('&');
			ret.args = {};
			
			query_string_raw_args.forEach(function(val,idx,arr){
			var part = val.split('=');
				if ( part.length > 1 ) {
					ret.args[part[0]] = part[1];
				}
				else {
					ret.args[part[0]] = true;
				}
			});
		}
		else {
			ret.query = "";
		}
		
		return ret;
	}
	
	AutoEmbed.prototype.makeYouTube = function( video_id ) {
		return '<iframe class="embed-16-9 embed-youtube" '+
			'src="https://www.youtube.com/embed/'+
			video_id+
			'?rel=0" frameborder="0" allowfullscreen></iframe>';
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
	AutoEmbed.prototype.makeSmartLink = function( icon_name, full_url, part_url ) {
		return '<span><a href="'+full_url+'" target="_blank" rel="noopener noreferrer">'+this.makeSVGIcon(icon_name,{'class':'-baseline -small'})+part_url+'</a></span>';
	}
		
	AutoEmbed.prototype.hasEmbed = function( str ) {
		if ( str.indexOf('youtube.com') !== -1 ) {
			url = this.extractFromURL(str);
			if ( url.args.v ) {
				return this.makeYouTube( url.args.v );
			}
			else if ( url.path[0] === 'user' ) {
				url.path.shift();
				return this.makeSmartLink( 'youtube', str, '/'+url.path.join('/') );
			}
			else if ( url.path[0] === 'c' ) {
				url.path.shift();
				return this.makeSmartLink( 'youtube', str, '/'+url.path.join('/') );
			}
			else if ( url.path[0] !== 'watch' ) {
				return this.makeSmartLink( 'youtube', str, '/'+url.path.join('/') );
			}
		}
		else if ( str.indexOf('github.com') !== -1 ) {
			url = this.extractFromURL(str);
			return this.makeSmartLink( 'github', str, '/'+url.path.join('/') );
		}
		else if ( str.indexOf('twitch.tv') !== -1 ) {
			url = this.extractFromURL(str);
			return this.makeSmartLink( 'twitch', str, '/'+url.path.join('/') );
		}
		else if ( str.indexOf('reddit.com') !== -1 ) {
			url = this.extractFromURL(str);
			return this.makeSmartLink( 'reddit', str, '/'+url.path.join('/') );
		}
		else if ( str.indexOf('twitter.com') !== -1 ) {
			url = this.extractFromURL(str);
			return this.makeSmartLink( 'twitter', str, '/'+url.path.join('/') );
		}
//		else {
//			return this.makeSmartLink( 'link', str, str.split('//')[1] );
//		}
		return false;
	}	
	
	window.autoEmbed = new AutoEmbed();
}());
