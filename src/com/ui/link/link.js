import {h, Component} from 'preact';
import cN from 'classnames';

import Sanitize from 'internal/sanitize/sanitize';

// TODO: Push the state (arg1 of pushShate/replaceState (MK: what?)
// MK TODO: give this file a serious look. tidy up

export default class UILink extends Component {
	constructor( props ) {
		super(props);

		this.onClick = this.onClick.bind(this);
		//this.dispatchNavChangeEvent = this.dispatchNavChangeEvent.bind(this);
	}

/*
	dispatchNavChangeEvent( navState ) {
		window.dispatchEvent(new CustomEvent('navchange', {
			'detail': {
				...new URL(this.props.href, window.location.href),
			    ...navState
			}
		}));

		/*
		console.log("DISZZZBPATH", this);
		// MK: Is this legal?
		let base = this.base;

		// MK: No it isn't. Base isn't guarenteed to be set. Reference URL should be checked another way.
		// use this.props.href

		let _href = base.href + ((base.search && base.search.length !== 0) ? "" : navState.old.search);
		let _search = (base.search && base.search.length !== 0) ? base.search : navState.old.search;

		let new_event = new CustomEvent('navchange', {
			'detail': Object.assign(navState, {
				'location': {
					'baseURI': base.baseURI,		// without query string
					'hash': base.hash,				// #hash
					'host': base.host,				// host with port
					'hostname': base.hostname,		// without port
					'href': _href,					// full
					'origin': base.origin,			// protocol+host
					'pathname': base.pathname,		// just the path
					'port': base.port,				// port
					'protocol': base.protocol,		// http:, https:, etc
					'search': _search,				// query string
				}
			})
		});

		window.dispatchEvent(new_event);

	}
*/

	onClick( e ) {
		// Bail if we're trying to open link in a new window using a modifer+click shortcut
		if ( e.shiftKey || e.metaKey || e.ctrlKey || e.altKey )
			return;

		// If the origin (http+domain) of the current and next URL is the same, navigate by manipulating the history
		if ( origin === window.location.origin ) {
			// Stop the page from reloading after the click
			e.preventDefault();

			let newURL = new URL(this.props.href, window.location.href);
			newURL.hash = newURL.hash ? newURL.hash : window.location.hash;

			// Append window's query string
			for (let [key, value] of new URLSearchParams(window.location.search).entries()) {
				newURL.searchParams.append(key, value);
			}

			// Trigger a 'navchange' event to cleanup what we've done here
			window.dispatchEvent(new CustomEvent('navchange', {
				'detail': {
					'location': newURL,
					'old': {...window.location},
					'top': window.pageYOffset || document.documentElement.scrollTop,
					'left': window.pageXOffset || document.documentElement.scrollLeft,
				}
			}));

			//this.dispatchNavChangeEvent(navState);
		}

		e.stopPropagation();
	}


	render( props ) {
		if ( props.href ) {
			props = {...props};

			props.href = Sanitize.sanitize_URI(props.href);

			// Is this an external link?
			if ( props.href.indexOf('//') !== -1 ) {
				// Open in a new window
				props.target = "_blank";
				// Tell browser to discard opener (new window) and referrer (link) details
				props.rel = "noopener noreferrer";
			}
			// If not, it's an internal link
			else {
				// If not blank, set onClick event
				if ( !props.blank ) {
					props.onClick = this.onClick;
				}
				// Open in a new window
				else {
					props.target = "_blank";
				}
			}

			// Return a link
			return <a {...props} class={cN("ui-link", props.class)} />;
		}

		// Return a span
		return <span {...props} class={cN("ui-link", props.class)} />;
	}
}
