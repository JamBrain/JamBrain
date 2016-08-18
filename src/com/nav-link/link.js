import { h, Component } from 'preact/preact';

// TODO: Push the state (arg1 of pushShate/replaceState //

export default class NavLink extends Component {
	dispatchLinkChangeEvent() {
		var new_event = new CustomEvent('linkchange',{
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
		if ( this.origin === window.location.origin ) {
			e.preventDefault();
			history.pushState(null,null,this.pathname);

			NavLink.prototype.dispatchLinkChangeEvent.call( this );
		}
		e.stopPropagation();
	}
	onClickReplace( e ) {
		if ( this.origin === window.location.origin ) {
			e.preventDefault();
			history.replaceState(null,null,this.pathname);
			
			NavLink.prototype.dispatchLinkChangeEvent.call( this );
		}
		e.stopPropagation();
	}
	
	render( props, state ) {
		if ( props.replace ) {
			props.onclick = this.onClickReplace;
			delete props.replace;
		}
		else {
			props.onclick = this.onClickPush;
		}
		return (
			<a {...props} />
		);
	}
}
