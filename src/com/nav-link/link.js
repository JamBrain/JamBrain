import { h, Component } from 'preact/preact';

// TODO: Push the state (arg1 of pushShate/replaceState //

export default class NavLink extends Component {
	dispatchLinkChange( that ) {
		var new_event = new CustomEvent('linkchange',{
			detail: {
				baseURI: that.baseURI,			// without query string
				hash: that.hash,				// #hash
				host: that.host,				// host with port
				hostname: that.hostname,		// without port
				href: that.href,				// full
				origin: that.origin,			// protocol+host
				pathname: that.pathname,		// just the path
				port: that.port,				// port
				protocol: that.protocol,		// http:, https:, etc
				search: that.search,			// query string
			}
		});
			
			
		
//		new_event.origin = that.origin;			// protocol+host
//		new_event.pathname = that.pathname;		// just the path
//		new_event.protocol = that.protocol;		// http:, https:, etc
//		new_event.baseURI = that.baseURI;		// without query string
//		new_event.href = that.href;				// full
//		new_event.host = that.host;				// with port
//		new_event.hostname = that.hostname;		// without port
//		new_event.port = that.port;				// port
//		new_event.search = that.search;			// query string
//		new_event.hash = that.hash;				// #hash
		
		window.dispatchEvent( new_event );
	}
	
	onClickPush( e ) {
		if ( this.origin === window.location.origin ) {
			e.preventDefault();
			history.pushState(null,null,this.pathname);

			NavLink.prototype.dispatchLinkChange( this );
		}
		e.stopPropagation();
	}
	onClickReplace( e ) {
		if ( this.origin === window.location.origin ) {
			e.preventDefault();
			history.replaceState(null,null,this.pathname);
			
			NavLink.prototype.dispatchLinkChange( this );
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

window.addEventListener('linkchange',function(e){
	console.log("linkchange!",e);
},false);
