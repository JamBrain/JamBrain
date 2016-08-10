(function(svg_file){
	var xhr = new XMLHttpRequest();
	xhr.open( 'GET', svg_file, true );
	xhr.onreadystatechange = function() {
		if ( (xhr.readyState === XMLHttpRequest.DONE) && (xhr.status === 200) ) {
			xhr.onload = null;
			var x = document.createElement('x');
			x.innerHTML = xhr.responseText;
			var svg = x.getElementsByTagName('svg')[0];
			if ( svg ) {
				svg.setAttribute( 'aria-hidden', 'true' );
				svg.style.position = 'absolute';
				svg.style.width = 0;
				svg.style.height = 0;
				svg.style.overflow = 'hidden';
				document.body.insertBefore( svg, document.body.firstChild );
			}
		}
	};
	xhr.send();
})( SVG_FILE );