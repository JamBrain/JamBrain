import Sanitize from 'internal/sanitize';
import "./link.less";

const navigationEvent = 'navChange';


/**
 * @param {string} search
 * @returns {string}
 */
export function cleanSearchParams( search ) {
	return search.split('&').map((arg) => (arg.slice(-1) === '=') ? arg.slice(0, -1) : arg).join('&');
}

export function navigateToLocalURL( url ) {
	let newURL = new URL(url, window.location.href);

	// Merge the query parameters
	const mergedSearch = new URLSearchParams({
		...Object.fromEntries(new URLSearchParams(window.location.search)),
		...Object.fromEntries(new URLSearchParams(newURL.search)),
	});

	// Special case for dialog, if it's ever blank remove it
	if (mergedSearch.has('dialog') && mergedSearch.get('dialog') === '') {
		mergedSearch.delete('dialog');
	}

	// NOTE: Dialogs should probably not populate history.

	// Remove tailing '=' from query parameters
	newURL.search = cleanSearchParams(mergedSearch.toString());

	//window.location.assign(newURL.href);
	window.dispatchEvent(new CustomEvent(navigationEvent, {'detail': newURL.href}));
}

function handleTargetHref( e ) {
	// Bail if we're trying to open link in a new window using a modifer+click shortcut
	if ( e.shiftKey || e.metaKey || e.ctrlKey || e.altKey ) return;

	const url = e.target.href;

	// Bail if the link is to an external website
	if (new URL( e.target.href, window.location.href).origin !== window.location.origin) return;

	navigateToLocalURL(url);

	e.preventDefault();
	//e.stopPropagation();	// Do we need this?
}

/**
 * @callback PushstateCallback
 * @param {any} newURL
 * @returns {any} newState
 * */

/**
 * @callback PopstateCallback
 * @param {any} newState
 * @param {any} newURL
 * */

/**
 * @param {PushstateCallback} [pushstateCallback]
 * @param {PopstateCallback} [popstateCallback]
 * */
export function setupNavigation( pushstateCallback, popstateCallback ) {
	window.addEventListener(navigationEvent, /** @param {CustomEvent} e */ (e) => {
		DEBUG && console.log(`[${navigationEvent}]:`, window.location.href, '=>', e.detail);
		history.pushState(pushstateCallback?.(e.detail), null, e.detail);
	});

	window.addEventListener('popstate', (e) => {
		DEBUG && console.log("popstate: ", e.state);
		popstateCallback?.(e.state, window.location.href);
	});
}


/**
 * @typedef LinkProps
 * @property {string} href - the link destination
 * @property {string} [class] - css classes applied to the link
 * @property {string} [rel] - if omitted, defaults to "noopener noreferrer" for external links
 * @property {string} [target] - if omitted, defaults to "_blank" for external links
 * @property {'button'} [role] - lets you change the aria role.
 * @property {string} [title] - DON'T USE THIS! Wrap in <Tooltip> instead!
 */

/**
 * Component that wraps the anchor \<a\> tag. Handles internal and external links, and sets good defaults.
 * @param {LinkProps} props
 */
export function Link( props ) {
	const {rel, target, href, ...otherProps} = props;

	// MK: URL() will throw if invalid. In theory this replaces the need for my sanitization code.
	try {
		//const sanitizedHref = href ? Sanitize.sanitize_URI(href) : '';
		const sanitizedURL = new URL(href ?? '', window.location.href);
		const isExternal = sanitizedURL.origin !== window.location.origin;
		const newTarget = isExternal ? (target ?? '_blank') : target;
		const newRel = isExternal ? (rel ?? 'noopener noreferrer') : rel;

		// MK NOTE: We aren't handling spacebar, when this is used as a button.
		return <a {...otherProps} rel={newRel} target={newTarget} href={href} onClick={handleTargetHref} />;
	}
	catch (e) {
		console.error(`Bad href: ${href}\n`, e.message);
		return <a />;
	}
}

/*
export class Link extends Component {
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
/*
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
			return <a {...props} class={`ui-link ${props.class ?? ''}`} />;
		}

		// Return a span
		return <span {...props} class={`ui-link ${props.class ?? ''}`} />;
	}
}
*/
