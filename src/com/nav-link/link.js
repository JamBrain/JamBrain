import { h, Component } from 'preact/preact';

// TODO: Push the state (arg1 of pushShate/replaceState //

export default class NavLink extends Component {
	dispatchNavChangeEvent( _old ) {
		let new_event = new CustomEvent('navchange',{
			detail: {
				location: {
					baseURI: this.baseURI,			// without query string
					hash: this.hash,				// #hash
					host: this.host,				// host with port
					hostname: this.hostname,		// without port
					href: this.href,				// full
					origin: this.origin,			// protocol+host
					pathname: this.pathname,		// just the path
					port: this.port,				// port
					protocol: this.protocol,		// http:, https:, etc
					search: (this.search && this.search.length !== 0) ? this.search : _old.search,			// query string
				},
				old: _old
			}
		});

		window.dispatchEvent(new_event);
	}
	
	onClickPush( e ) {
		// Internet Explorer 11 doesn't set the origin, so we need to extract it
		// Cleverness: we slice at the 1st slash, but offset by length of 'https://' first, so it's after the domain
		let origin = this.origin || this.href.slice(0, this.href.indexOf('/','https://'.length));
		
		// If the origin (http+domain) of the current and next URL is the same, navigate by manipulating the history
		if ( origin === window.location.origin ) {
			var old = Object.assign({}, window.location);
			
			// Stop the page from reloading after the click
			e.preventDefault();
			// Store the old 
			history.replaceState(window.history.state, null, window.location.pathname+window.location.search);
			// Advance history by pushing a state (that will be updated by the 'navchange' event)
			history.pushState(null, null, this.pathname+this.search);

			// Trigger a 'navchange' event to cleanup what we've done here
			NavLink.prototype.dispatchNavChangeEvent.call(this, old);
		}
		e.stopPropagation();
		
		//return false; /* Internet Explorer 11 can also stop clicks with this */
	}
	onClickReplace( e ) {
		// Internet Explorer 11 doesn't set the origin, so we need to extract it
		// Cleverness: we slice at the 1st slash, but offset by length of 'https://' first, so it's after the domain
		let origin = this.origin || this.href.slice(0, this.href.indexOf('/','https://'.length));
		
		// If the origin (http+domain) of the current and next URL is the same, navigate by manipulating the history
		if ( this.origin === window.location.origin ) {
			var old = Object.assign({}, window.location);
			
			// Stop the page from reloading after the click
			e.preventDefault();
			// Unlike above, 
			history.replaceState(window.history.state, null, this.pathname+this.search);

			// Trigger a 'navchange' event to cleanup what we've done here
			NavLink.prototype.dispatchNavChangeEvent.call(this, old);
		}
		e.stopPropagation();
		
		//return false; /* Internet Explorer 11 can also stop clicks with this */
	}
	
	render( props, state ) {
		if ( props.href ) {
			if ( props.href.indexOf('//') !== -1 ) {		
				props.target = "_blank";
				props.rel = "noopener noreferrer";
			}
			else {
				if ( props.replace ) {
					props.onclick = this.onClickReplace;
					delete props.replace;
				}
				else {
					props.onclick = this.onClickPush;
				}
			}
		}
		return (
			<a {...props} />
		);
	}
}
