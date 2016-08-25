import { h, Component } from 'preact/preact';

// TODO: Push the state (arg1 of pushShate/replaceState //

export default class NavLink extends Component {
	dispatchNavChangeEvent() {
		var new_event = new CustomEvent('navchange',{
			detail: {
				baseURI: this.baseURI,			// without query string
				hash: this.hash,				// #hash
				host: this.host,				// host with port
				hostname: this.hostname,		// without port
				href: this.href,				// full
				origin: this.origin,			// protocol+host
				pathname: this.pathname,		// just the path
				port: this.port,				// port
				protocol: this.protocol,		// http:, https:, etc
				search: this.search,			// query string
			}
		});

		window.dispatchEvent( new_event );
	}
	
	onClickPush( e ) {
		// Internet Explorer 11 doesn't set the origin, so we need to extract it //
		let origin = this.origin || this.href.slice(0,this.href.indexOf('/','https://'.length));
		
		if ( origin === window.location.origin ) {
			e.preventDefault();
			history.pushState(null,null,this.pathname);

			NavLink.prototype.dispatchNavChangeEvent.call( this );
		}
		e.stopPropagation();
		
		//return false; /* Internet Explorer 11 can also stop clicks with this */
	}
	onClickReplace( e ) {
		// Internet Explorer 11 doesn't set the origin, so we need to extract it //
		let origin = this.origin || this.href.slice(0,this.href.indexOf('/','https://'.length));
		
		if ( this.origin === window.location.origin ) {
			e.preventDefault();
			history.replaceState(null,null,this.pathname);
			
			NavLink.prototype.dispatchNavChangeEvent.call( this );
		}
		e.stopPropagation();
		
		//return false; /* Internet Explorer 11 can also stop clicks with this */
	}
	
	render( props, state ) {
		if ( props.href ) {
			if ( props.href.indexOf('//') !== -1 ) {		
				props.target = "_blank";
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
