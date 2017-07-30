
// This is an promises experiment, attempting to figure out how one promise can resolve multiple promises
// (as opposed to multiple promises triggering a single promise)

(function(){	// Scope
	console.log("Test case 1");
	
	class Deferred {
		constructor() {
			this.promise = new Promise((resolve, reject)=> {
				this.reject = reject;
				this.resolve = resolve;
			})
		}
	}
	
	var One = new Deferred();
	One.promise.then(
		function(r) {
			console.log("TC1: One", r);
		});
	
	var Two = new Deferred();
	Two.promise.then(
		function(r) {
			console.log("TC1: Two", r);
		});
	
	
	var Queue = [ One, Two ];
	var URL = "https://api.ldjam.com/vx/stats/9405";
	
	var P = fetch(URL).then(
		function(r) {
			let j = r.json();
			Queue.forEach(
				function(el) {
					el.resolve(j);
				});
		});
}());	// Scope

/*
// Failed attempt at using promises directly (there's no way to trigger resolve outside a promise scope)

var One = new Promise((resolve, reject) => resolve()).then(
	function(r) {
		console.log("Ono", r);
		return r;
	});

var Two = new Promise((resolve, reject) => resolve()).then(
	function(r) {
		console.log("Two", r);
		return r;
	});


var Queue = [ One, Two ];
var URL = "https://api.ldjam.com/vx/stats/9405";

// Alternative Queue implemntation, by chaining .then's rather than making an array.
// This does require that every object return the input though
var QQ = One.then(Two);

//var P = fetch(URL).then(
//	function(r) {
//		Queue.forEach(
//			function(el) {
//				console.log(el);
//				Promise.resolve(el);//el.resolve(r);
//			});
//	});

var P = fetch(URL).then(r => QQ.then(r));
*/

// *************************** //

// The other option is to accept that what you really want is an array of Functions to call upon completion, not promises.

(function(){	// Scope
	console.log("Test case 2");
	
	function WrapperFunc(Action, r) {
		console.log(Action, r);
	}
	
	var One = WrapperFunc.bind(null, "TC2: One");
	var Two = WrapperFunc.bind(null, "TC2: Two");

	var Queue = [ One, Two ];
	var URL = "https://api.ldjam.com/vx/stats/9405";
	
	var P = fetch(URL).then(
		function(r) {
			let j = r.json();
			Queue.forEach(function(el) {
				el(j);
				//console.log(el);
					//el.call(this, j);
			});
		});

}());	// Scope
