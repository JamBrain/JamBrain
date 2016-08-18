
(function() {	
	HashService = function() {
//		console.log('ctr: ',this);
		
		this.list = {};
		this.previous = "";
		this.previous_args = [];
		this.previous_string = "";
	};
	
	HashService.prototype.register = function( hash, onfocus, onblur, onchange ) {
//		console.log('register: ',this);
		
		// Multi function syntax, wrap so each call so it only gets args //
		if ( onblur | onchange ) {
			this.list[hash] = function(state, args) {
				if ( state > 0 ) {
					if ( onfocus )
						onfocus(args);
				}
				else if ( state < 0 ) {
					if ( onblur )
						onblur(args);
				}
				else {
					if ( onchange )
						onchange(args);
				}
			};
		}
		// One function syntax, pass focus state, then args //
		else {
			this.list[hash] = onfocus;
		}
	};
	
	var HashChangeEvent = function(e) {
//		console.log('hashchange: ',this);
//		console.log('ev: ',e);
		// Ignore if entire hash strings are the same //
		if ( window.location.hash === this.previous_string ) {
			// Bail //
			return;
		}
	
		var parts = window.location.hash.split('/');
		var args = parts.slice(1);
	
		// If same function, but args have changed //
		if ( parts[0] === this.previous ) {
			if ( this.previous !== "" ) {
				if ( this.list[this.previous] ) {
					this.list[this.previous](0,args);
	
					// Store new state //
					this.previous_args = args;
					this.previous_string = window.location.hash;
				}
			}
			// Bail //
			return;
		}
		
		// Call previous with 'lost-focus' state //
		if ( this.previous !== "" ) {
			if ( this.list[this.previous] ) {
				this.list[this.previous](-1,this.previous_args);
			}
		}
	
		// Call new with 'got-focus' state //
		if ( this.list[parts[0]] ) {
			this.list[parts[0]](1,args);
		}
		
		// Store this newly set hash, args, and full string //	
		this.previous = parts[0];
		this.previous_args = args;
		this.previous_string = window.location.hash;
	};
	
	window.hashService = new HashService();
	
	HashService.prototype.force = function() {
//		console.log('forc: ',window.hashService);
		//HashChangeEvent.bind(window.hashService);
		
		var event = new HashChangeEvent({
//			oldURL:'http://jammer.work',
//			newURL:window.location.href
		});
		window.dispatchEvent(event);
	};
	
	window.addEventListener('hashchange',HashChangeEvent.bind(window.hashService));
})();


hashService.register('#tv', 
	function(args) { console.log('got it',args); }, 
	function(args) { console.log('lost it',args); },
	function(args) { console.log('changed it',args); }
);

hashService.register('#voles', 
	function(status,args) { console.log('got '+status,args); }
);

//console.log(window.location.hash);
//console.log(hashService.previous);
//hashService.force();

//window.addEventListener('load',function(){hashService.force();});

