;(function(){

/*
function MyResponse( response, code ) {
}
*/

window.xhr_Get = function( url, func ) {
	var xhr = new XMLHttpRequest();
	xhr.open("GET",url,true);
	xhr.onreadystatechange = function() {
		if ( (xhr.readyState == 4) ) {
			func( xhr.responseText, xhr.status );
		}
	}
	xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	xhr.send();
}
window.xhr_Post = function( url, post_data, func ) {
	var xhr = new XMLHttpRequest();
	xhr.open("POST",url,true);
	xhr.onreadystatechange = function() {
		if ( (xhr.readyState == 4) ) {
			func( xhr.responseText, xhr.status );
		}
	}
	xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	xhr.send(post_data);
}

window.xhr_GetJSON = function( url, func ) {
	var xhr = new XMLHttpRequest();
	xhr.open("GET",url,true);
	xhr.onreadystatechange = function() {
		if ( (xhr.readyState == 4) ) {
			// If the error code is above 500, then there was a server error //
			if ( xhr.status >= 500 ) {
				console.log( xhr.responseText );
				func( {}, xhr.status );
			}
			// If the response begins with a non JSON object/array character, assume the response is bad //
			else if ( (xhr.responseText[0] != '[') && (xhr.responseText[0] != '{') ) {
				console.error( "Malformed JSON XHR Response" );
				console.log( xhr.responseText );				
				func( {}, 500 );	// Fabricate a 500 (Server Error) response //
			}
			else {
				func( JSON.parse(xhr.responseText), xhr.status );
			}
		}
	}
	xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	xhr.send();
}
window.xhr_PostJSON = function( url, post_data, func ) {
	var xhr = new XMLHttpRequest();
	xhr.open("POST",url,true);
	xhr.onreadystatechange = function() {
		if ( (xhr.readyState == 4) ) {
			// If the error code is above 500, then there was a server error //
			if ( xhr.status >= 500 ) {
				console.log( xhr.responseText );
				func( {}, xhr.status );
			}
			// If the response begins with a non JSON object/array character, assume the response is bad //
			else if ( (xhr.responseText[0] != '[') && (xhr.responseText[0] != '{') ) {
				console.error( "Malformed JSON XHR Response" );
				console.log( xhr.responseText );				
				func( {}, 500 );	// Fabricate a 500 (Server Error) response //
			}
			else {
				func( JSON.parse(xhr.responseText), xhr.status );
			}
		}
	}
	xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	xhr.send(post_data);
}

})();
