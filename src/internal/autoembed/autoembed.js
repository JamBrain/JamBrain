
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
	
	AutoEmbed.prototype.hasEmbed = function( str ) {
		if ( str.indexOf('youtube.com') !== -1 ) {
			url = this.extractFromURL(str);
			if ( url.args.v ) {
				return this.makeYouTube( url.args.v );
			}
		}
		return false;
	}
	
	
	window.autoEmbed = new AutoEmbed();
}());
