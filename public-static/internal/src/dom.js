;(function(){

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
	
	return	(rect.top >= 0) &&
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

})();
