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

window.dom_SetText = function(id,text) {
	document.getElementById(id).innerHTML = text;
}
window.dom_GetText = function(id,text) {
	return document.getElementById(id).innerHTML;
}
window.dom_SetAttribute = function(id,attr,value) {
	document.getElementById(id)[attr] = value;
}
window.dom_GetAttribute = function(id,attr) {
	return document.getElementById(id)[attr];
}


// Is supposed to work, but as far as I've seen does not //
window.dom_RestartAnimation = function(id,class_name) {
	element = document.getElementById(id);
	element.classList.remove(class_name);
	element.offsetWidth = element.offsetWidth;
	element.classList.add(class_name);
}
// More attempts at trying to fix the animation restart problem //
window.dom_ForceReflow = function(id) {
	element = document.getElementById(id);
	element.offsetWidth = element.offsetWidth;
	element.width = element.width;
}

window.dom_SetFocus = function(id) {
	return document.getElementById(id).focus();
}

// Source: http://stackoverflow.com/a/7557433
window.dom_InViewport = function(el) {
	var rect = el.getBoundingClientRect();
	
	return
		(rect.top >= 0) &&
		(rect.left >= 0) &&
		(rect.bottom <= (window.innerHeight || document.documentElement.clientHeight)) &&
		(rect.right <= (window.innerWidth || document.documentElement.clientWidth));
}


// Source: http://stackoverflow.com/a/196038
// Change all classes //
window.dom_SetClasses = function(id,class_names) {
	document.getElementById(id).className = class_names;
}
// Get all classes //
window.dom_GetClasses = function(id) {
	return document.getElementById(id).className;
}

// Add a class //
window.dom_AddClass = function(id,class_name) {
	document.getElementById(id).className += " "+class_name;
}
// Remove a class //
window.dom_RemoveClass = function(id,class_name) {
	document.getElementById(id).className =
		document.getElementById(id).className.replace(
			RegExp('(?:^|\\s)'+class_name+'(?!\\S)','g'),
			""
		);
}
// Does element have a certain class? //
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
		if ( !has )
			dom_AddClass(id,class_name);
	}
	else {
		if ( has )
			dom_RemoveClass(id,class_name);
	}
}

// http://stackoverflow.com/a/12496442
window.GetTZ = function( now ) {
	now = now.toString();
	now = now.replace("Argentina Standard Time","ART");
	now = now.replace("W. Europe Standard Time","CET");
	var TZ = now.indexOf('(') > -1 ?
	now.match(/\([^\)]+\)/)[0].match(/[A-Z]/g).join('') :
	now.match(/[A-Z]{3,4}/)[0];
	if (TZ == "GMT" && /(GMT\W*\d{4})/.test(now)) TZ = RegExp.$1;
	return TZ;
}


})();
