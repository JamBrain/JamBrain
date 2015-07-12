
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
			// TODO: exctract first word (block[idx].split("\\s+",1)
			// then scan Prism.languages for a match.
			
			out += "<pre class='language-clike'><code class='language-clike'>";
			out += Prism.highlight(block[idx].trim(),Prism.languages.clike);
			out += "</code></pre>";
		}
		// Even: Do Markdown and Emoji //
		else {
			out += emojione.toImage(marked.parse(block[idx]));
		}
	}
	
	return out;
}

})();
