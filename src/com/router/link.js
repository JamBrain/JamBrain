import { h, Component }					from 'preact/preact';
import Sanitize							from '../../internal/sanitize/sanitize';

// TODO: Push the state (arg1 of pushShate/replaceState

export default class Link extends Component {
	constructor( props ) {
		super(props);

		this.onClick = this.onClick.bind(this);
	}

	dispatchNavChangeEvent( state ) {
		let that = this.base;

		let _href = that.href + ((that.search && that.search.length !== 0) ? "" : state.old.search);
		let _search = (that.search && that.search.length !== 0) ? that.search : state.old.search;

		let new_event = new CustomEvent('navchange', {
			detail: Object.assign(state, {
				location: {
					baseURI: that.baseURI,			// without query string
					hash: that.hash,				// #hash
					host: that.host,				// host with port
					hostname: that.hostname,		// without port
					href: _href,					// full
					origin: that.origin,			// protocol+host
					pathname: that.pathname,		// just the path
					port: that.port,				// port
					protocol: that.protocol,		// http:, https:, etc
					search: _search,				// query string
				}
			})
		});

		window.dispatchEvent(new_event);
	}

	onClick( e ) {
		// Bail if blanking behavior is requested
		if ( this.props.blank )
			return;

		//fixes shift, cmd, ctrl, and alt clicking links
		if (e.shiftKey || e.metaKey || e.ctrlKey || e.altKey)
			return;

		// Internet Explorer 11 doesn't set the origin, so we need to extract it
		// Cleverness: we slice at the 1st slash, but offset by length of 'https://' first, so it's after the domain
		let origin = this.base && (this.base.origin || (this.base.href && this.base.href.slice(0, this.base.href.indexOf('/','https://'.length))));

		// If the origin (http+domain) of the current and next URL is the same, navigate by manipulating the history
		if ( origin === window.location.origin ) {
			var state = {
				old: Object.assign({}, window.location),
				top: window.pageYOffset || document.documentElement.scrollTop,
				left: window.pageXOffset || document.documentElement.scrollLeft,
			};

			// Stop the page from reloading after the click
			e.preventDefault();

//			// Store
//			console.log('replaceState', window.history.state);
//			history.replaceState(window.history.state, null, window.location.pathname+window.location.search);
//			// Advance history by pushing a state (that will be updated by the 'navchange' event)
//			console.log('pushState', null);
//			history.pushState(null, null, this.base.pathname+this.base.search);

			// Trigger a 'navchange' event to cleanup what we've done here
			NavLink.prototype.dispatchNavChangeEvent.call(this, state);
		}
		e.stopPropagation();

		//return false; /* Internet Explorer 11 can also stop clicks with this */
	}

//	onClickReplace( e ) {
//		// Internet Explorer 11 doesn't set the origin, so we need to extract it
//		// Cleverness: we slice at the 1st slash, but offset by length of 'https://' first, so it's after the domain
//		let origin = this.base && (this.base.origin || (this.base.href && this.base.href.slice(0, this.base.href.indexOf('/','https://'.length))));
//
//		// If the origin (http+domain) of the current and next URL is the same, navigate by manipulating the history
//		if ( origin === window.location.origin ) {
//			var old = Object.assign({}, window.location);
//
////			window.history.state.top = window.pageYOffset || document.documentElement.scrollTop;
////    		window.history.state.left = window.pageXOffset || document.documentElement.scrollLeft;
//
//			// Stop the page from reloading after the click
//			e.preventDefault();
//			// Unlike above, we only replace the state
//			console.log('replaceState', window.history.state);
//			history.replaceState(window.history.state, null, this.base.pathname+this.base.search);
//
//			// Trigger a 'navchange' event to cleanup what we've done here
//			NavLink.prototype.dispatchNavChangeEvent.call(this, old);
//		}
//		e.stopPropagation();
//
//		//return false; /* Internet Explorer 11 can also stop clicks with this */
//	}

	render( props ) {
		props = Object.assign({}, props);

		if ( props.href ) {
			props.href = Sanitize.sanitize_URI(props.href);

			if ( props.href.indexOf('//') !== -1 ) {
				props.target = "_blank";
				props.rel = "noopener noreferrer";
			}
			else {
//				if ( props.replace ) {
//					props.onclick = this.onClickReplace.bind(this);
//					delete props.replace;
//				}
//				else {
					props.onclick = this.onClick;
//				}
			}

			if ( props.blank ) {
				props.target = "_blank";
			}
		}
		return (
			<a {...props} />
		);
	}
}
