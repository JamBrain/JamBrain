;(function(){
	
/**
	Functions that extend the default JavaScript library.
	
	NOTE: This *may* be a bad idea (at least on older browsers).
	Reference: http://perfectionkills.com/whats-wrong-with-extending-the-dom/
*/

// Lets you remove elements by doing:
//   document.getElementById("my-element").remove();
//   document.getElementsByClassName("my-elements").remove();
// Source: http://stackoverflow.com/a/18120786
Element.prototype.remove = function() {
    this.parentElement.removeChild(this);
}
NodeList.prototype.remove = HTMLCollection.prototype.remove = function() {
    for(var i = this.length - 1; i >= 0; i--) {
        if(this[i] && this[i].parentElement) {
            this[i].parentElement.removeChild(this[i]);
        }
    }
}

// Convert an object in to an HTTP query string (i.e. GET and POST)
//   i.e. serialize({"data":10,"name":"bort"}) --> data=10&name=bort
// Source: http://stackoverflow.com/a/1714899
window.serialize = function(obj, prefix) {
	var str = [];
	for(var p in obj) {
		if (obj.hasOwnProperty(p)) {
			var k = prefix ? prefix + "[" + p + "]" : p, v = obj[p];
			str.push(typeof v == "object" ?
			window.serialize(v, k) :
			encodeURIComponent(k) + "=" + encodeURIComponent(v));
		}
	}
	return str.join("&");
}

// Change " and ' characters in a string for use in Attributes (title, etc)
// http://stackoverflow.com/a/12562097
window.escapeQuotes = function(value) {
	return String(value).
		replace(/"/g,'&quot;'). //" // <- kill the weird quoting
		replace(/'/g,'&#39;'); 	//' // <- kill the weird quoting
}


})();
