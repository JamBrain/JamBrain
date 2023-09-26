
const next_token = /[*_~`]/;

// NOTE: '\b' only works with underscore. Will also break on non-ascii characters.
const styles = {
	// Fail cases: *hello** _hello__
	italic:/^_([^_\s][\s\S]+?[^_\s]?)_(?!_)\b|^\*([^\*\s][\s\S]+?[^\*\s]?)\*(?!\*)/,
	// Fail cases: **hello*** __hello___
	bold:/^__([^_\s][\s\S]+?[^_\s]?)__(?!_)\b|^\*\*([^\*\s][\s\S]+?[^\*\s]?)\*\*(?!\*)/,
	italic_bold:/^___([^_\s][\s\S]+?[^_\s]?)___\b|^\*\*\*([^\*\s][\s\S]+?[^\*\s]?)\*\*\*/,
	del:/^~~([^~\s][\s\S]+?[^~\s]?)~~/,
	// Should fail the `hello`` case, but doesn't...
	code:/^(`+)([^`][\s\S]+?)\1(?!`)/,
};

const style_funcs = {
	italic:makeItalic,
	bold:makeBold,
	italic_bold:makeItalicBold,
	del:makeDel,
	code:nop,
};

const strip_funcs = {
	italic:nop,
	bold:nop,
	italic_bold:nop,
	del:nop,
	code:nop,
};


function makeBold( str ) {
	return '<strong>'+str+'</strong>';
}
function makeItalic( str ) {
	return '<em>'+str+'</em>';
}
function makeItalicBold( str ) {
	return '<em><strong>'+str+'</strong></em>';
}
function makeDel( str ) {
	return '<del>'+str+'</del>';
}
function nop( str ) {
	return str;
}

// Barebones markdown parser for titles. Only parses inline text styles (bold, italics, etc) //
export default function parse( str, strip ) {
	var out = "";

	var funcs = style_funcs;
	if ( strip ) {
		funcs = strip_funcs;
	}

	while (str.length > 0) {
		var pos = str.search(next_token);
		if ( pos === -1 ) {
			out += str;
			break;
		}
		else {
			out += str.slice(0,pos);
			str = str.slice(pos);

			var matched = false;
			for ( var sty in styles ) {
				str.replace(styles[sty],function(match,p1,p2,offset){
					// Some regexes have 2 possible matches, and we sometimes use the 1st for start+ends //
					out += funcs[sty](p2 || p1);
					str = str.slice(match.length);
					matched = true;
				});
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
