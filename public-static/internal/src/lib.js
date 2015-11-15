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
window.escapeAttribute = function(value) {
	return String(value).
        replace(/\\/g, '\\\\').			/* This MUST be the 1st replacement. */
        replace(/\t/g, '\\t').			/* These 2 replacements protect whitespaces. */
        replace(/\n/g, '\\n').
        replace(/\u00A0/g, '\\u00A0').	/* Useful but not absolutely necessary. */
		replace(/&/g, '&amp;').
		replace(/"/g, '&quot;').		//" // <- kill the weird quoting
		replace(/'/g, '&#39;').			//' // <- kill the weird quoting
		replace(/</g, '&lt;').
		replace(/>/g, '&gt;');
}

window.escapeString = function(value) {
	return String(value).
		replace(/&/g, '&amp;').
		replace(/"/g, '&quot;').		//" // <- kill the weird quoting
		replace(/'/g, '&#39;').			//' // <- kill the weird quoting
		replace(/</g, '&lt;').
		replace(/>/g, '&gt;');
}


// http://stackoverflow.com/a/196038

// Change all classes //
window.dom_SetClasses = function(id,class_names) {
	document.getElementById(id).className = class_names;
}
window.dom_GetClasses = function(id) {
	return document.getElementById(id).className;
}
window.dom_AddClass = function(id,class_name) {
	document.getElementById(id).className += " "+class_name;
}
window.dom_RemoveClass = function(id,class_name) {
	document.getElementById(id).className =
		document.getElementById(id).className.replace(
			RegExp('(?:^|\\s)'+class_name+'(?!\\S)','g')
		);
}
window.dom_HasClass = function(id,class_name) {
	return Boolean(document.getElementById(id).className.match(
		RegExp('(?:^|\\s)'+class_name+'(?!\\S)','g')
	));
}
// Add, Remove, or Toggle class, if not already set //
window.dom_ToggleClass = function(id,class_name,value) {
	var action = value;
	var has = dom_HasClass(id,class_name);
	if ( typeof action !== "boolean" ) {
		action = !has;
	}
	
	if ( action ) {
		if ( !has ) {
			console.log('!has');
			dom_AddClass(id,class_name);
		}
	}
	else {
		if ( has ) {
			console.log('has');
			dom_RemoveClass(id,class_name);
		}
	}
}

})();
