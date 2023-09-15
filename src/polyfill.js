//import 'core-js/es/array/at';
if ( !Array.prototype.at ) {
	Array.prototype.at = (index = 0) => (index < 0) ? [index + this.length] : this[index];
}

//import 'core-js/es/string/at';
if ( !String.prototype.at ) {
	String.prototype.at = (index = 0) => (index < 0) ? [index + this.length] : this[index];
}
