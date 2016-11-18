(function(){
	// Constructor //
	function TitleParser() {
		this.next_token = /[*_~`]/;

		// NOTE: '\b' only works with underscore. Will also break on non-ascii characters.
		this.styles = {
			// Fail cases: *hello** _hello__
			italic:/^_([^_\s][\s\S]+?[^_\s]?)_(?!_)\b|^\*([^\*\s][\s\S]+?[^\*\s]?)\*(?!\*)/,
			// Fail cases: **hello*** __hello___
			bold:/^__([^_\s][\s\S]+?[^_\s]?)__(?!_)\b|^\*\*([^\*\s][\s\S]+?[^\*\s]?)\*\*(?!\*)/,
			italic_bold:/^___([^_\s][\s\S]+?[^_\s]?)___\b|^\*\*\*([^\*\s][\s\S]+?[^\*\s]?)\*\*\*/,
			del:/^~~([^~\s][\s\S]+?[^~\s]?)~~/,
			// Should fail the `hello`` case, but doesn't...
			code:/^(`+)([^`][\s\S]+?)\1(?!`)/,
		};
		
		this.style_funcs = {
			italic:this.makeItalic,
			bold:this.makeBold,
			italic_bold:this.makeItalicBold,
			del:this.makeDel,
			code:this.makeCode,
		}
		
		this.strip_funcs = {
			italic:this.nop,
			bold:this.nop,
			italic_bold:this.nop,
			del:this.nop,
			code:this.nop,
		}
	}
	
	TitleParser.prototype.makeBold = function( str ) {
		return '<strong>'+str+'</strong>';
	}
	TitleParser.prototype.makeItalic = function( str ) {
		return '<em>'+str+'</em>';
	}
	TitleParser.prototype.makeItalicBold = function( str ) {
		return '<em><strong>'+str+'</strong></em>';
	}
	TitleParser.prototype.makeDel = function( str ) {
		return '<del>'+str+'</del>';
	}
	TitleParser.prototype.makeCode = function( str ) {
		// Doesn't actually make code. Used to make it ignore styles. //
		return str;
	}
	TitleParser.prototype.nop = function( str ) {
		return str;
	}
	
	// Barebones markdown parser for titles. Only parses inline text styles (bold, italics, etc) //
	TitleParser.prototype.parse = function( str, strip ) {
		var out = "";
		
		var funcs = this.style_funcs;
		if ( strip ) {
			funcs = this.strip_funcs;
		}
		
		while (str.length > 0) {
			var pos = str.search(this.next_token);
			if ( pos === -1 ) {
				out += str;
				break;
			}
			else {
				out += str.slice(0,pos);
				str = str.slice(pos);
				
				var matched = false;
				for ( var sty in this.styles ) {
					str.replace(this.styles[sty],function(match,p1,p2,offset){
						// Some regexes have 2 possible matches, and we sometimes use the 1st for start+ends //
						out += funcs[sty](p2 || p1);
						str = str.slice(match.length);
						matched = true;
					}.bind(this));
					if ( matched ) break;
				}
				
				if ( !matched ) {
					// Advance 1 character //
					out += str.slice(0,1);
					str = str.slice(1);
				}
			}
		}
		
		return out;
	}
	
	window.titleParser = new TitleParser();
}());
