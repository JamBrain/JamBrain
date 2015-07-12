
;(function(){

/*
TODO: Whenever you upgrade marked.js, change codespan to do this 

Renderer.prototype.codespan = function(text) {
  return '<span><code>' + text.replace('\n','') + '</code></span>';
};
*/

/**
 * Parse a block of markdown
 * @function html_Parse
*/
window.html_Parse = function(text) {
	var out = "";
	var block = text.split("```");
	
	for (var idx = 0, len = block.length; idx < len; ++idx ) {
		// Odd: Do syntax highlighting //
		if ( idx & 1 ) {
			out += "<pre><code class='language-clike'>";
			out += Prism.highlight(block[idx],Prism.languages.clike);
			out += "</code></pre>";
		}
		// Even: Do Markdown and Emoji //
		else {
			out += emojione.toImage(marked.parse(block[idx]));
//			var subblock = block[idx].split("`");
//			for (var idx2 = 0, sublen = subblock.length; idx2 < sublen; ++idx2 ) {
//				
//				// Odd: Preformatted block, no emoji //
//				if ( idx2 & 1 ) {
//					out += "<pre class='language-clike' style>";
//					out += Prism.highlight(subblock[idx2],Prism.languages.clike);
//					out += "</pre>";
//				}
//				// Even: Normal block, Emoji //
//				else {
//					out += emojione.toImage(marked.parse(subblock[idx2]));
//				}
//			}
		}
	}
	
	return out;
}

})();
