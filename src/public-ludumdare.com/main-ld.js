//import 'preact/devtools';
import 'preact/debug';

import '../polyfill';	// So we can use .at()

import { render, Component } from 'preact';
import './main-ld.less';
import 'com/defaults.less';
import 'com/fonts.less';
import 'com/helpers.less';
import 'com/markup.less';

import { setupNavigation } from 'com/ui/link';

import titleParser						from 'internal/titleparser';
import Sanitize							from 'internal/sanitize';

import { ContentRouter, Route } from "com/router";

import Layout							from "com/page/layout";

import PageRoot 						from 'com/page/root/root';
import PagePage 						from 'com/page/node/page/page';
import PagePost 						from 'com/page/node/post/post';
import PageItem 						from 'com/page/node/item/item';
import PageTag 							from 'com/page/node/tag/tag';
import PageUser 						from 'com/page/node/user/user';
import PageUsers 						from 'com/page/node/users/users';
import PageEvent 						from 'com/page/node/event/event';
import PageEvents 						from 'com/page/node/events/events';
import PageError 						from 'com/page/error/error';

import DialogUnfinished					from 'com/dialog/unfinished/unfinished';
import DialogLogin						from 'com/dialog/login/login';
import DialogRegister					from 'com/dialog/register/register';
import DialogActivate					from 'com/dialog/activate/activate';
import DialogReset						from 'com/dialog/reset/reset';
import DialogPassword					from 'com/dialog/password/password';
import DialogSession					from 'com/dialog/session/session';
import DialogSavebug					from 'com/dialog/savebug/savebug';
import DialogUserConfirm				from 'com/dialog/user/user-confirm';
import DialogSubmit						from 'com/dialog/submit/submit';
import DialogTV							from 'com/dialog/tv/tv';
import DialogCreate						from 'com/dialog/create/create';
import DialogErrorUpload				from 'com/dialog/errorupload/errorupload';
import DialogErrorPublish				from 'com/dialog/errorpublish/errorpublish';

//import AlertBase						from 'com/alert-base/base';

import $Node							from 'backend/js/node/node';
import $User							from 'backend/js/user/user';
import $NodeLove						from 'backend/js/node/node_love';


const SITE_ROOT = 1;

function getSlugsFromURL( url ) {
	const newURL = new URL(url);
	return Sanitize.trimSlashes(newURL.pathname).split('/');
}

class Main extends Component {
	constructor( props ) {
		super(props);

		// Debug mode
		DEBUG && console.log("[constructor]");
		if ( DEBUG ) {
			const urlParams = new URLSearchParams(window.location.search);
			const debugParam = urlParams.get('debug');
			const debugPort = debugParam ? parseInt(debugParam) : 0;
			const hasValidPort = LIVE && debugPort > 0;

			console.log(hasValidPort ? "Running in LIVE DEBUG mode" : "Running in DEBUG mode");

			if ( hasValidPort ) {
				const buildServerURL = `http://ldjam.work:${debugPort}/esbuild`;

				let liveBuild = new EventSource(buildServerURL);

				liveBuild.addEventListener('open', (e) => {
					console.log(`Connected to local build.js server: ${buildServerURL}`, e);
				});
				liveBuild.addEventListener('error', (e) => {
					console.log('Unable to connect to local build.js server.', e);
				});
				liveBuild.addEventListener('change', (e) => {
					const { added, removed, updated } = JSON.parse(e.data);

					// CSS reloading (inline)
					// MK NOTE: this doesn't seem to work. Was copy+pasted from sample, so it's not really verified.
					if (!added.length && !removed.length && updated.length === 1) {
						for (const link of document.getElementsByTagName('link')) {
							const url = new URL(link.href);

							if (url.host === location.host && url.pathname === updated[0]) {
								const next = /** @type {HTMLLinkElement} */ (link.cloneNode());

								next.href = updated[0] + '?' + Math.random().toString(36).slice(2);
								next.onload = () => link.remove();
								link.parentNode.insertBefore(next, link.nextSibling);

								return;
							}
						}
					}

					// JS reloading (full reload)
					location.reload();
				});
			}
		}

		/*
		// Start by cleaning the URL
		let clean = this.cleanLocation(window.location);
		if ( window.location.origin+clean.path !== window.location.href ) {
			DEBUG && console.log("Cleaned URL: "+window.location.href+" => "+window.location.origin+clean.path);

			this.storeHistory(window.history.state, null, clean.path);
		}
		*/


		this.state = {
			// URL walking
			'path': '',
			'slugs': getSlugsFromURL(window.location.href),
			'extra': [],

			// Active Node
			'node': {
				'id': 0
			},
			'parent': null,
			'_superparent': null,
			'author': null,

			// Root Node
			'root': null,

			// Featured node
			'featured': null,

			// Active User
			'user': null
		};

		//window.addEventListener('hashchange', this.onHashChange.bind(this));
		//window.addEventListener('navchange', this.onNavChange.bind(this));
		//window.addEventListener('popstate', this.onPopState.bind(this));

		setupNavigation((newURL) => {
			const newSlugs = getSlugsFromURL(newURL);//Sanitize.trimSlashes(new URL(newURL).pathname).split('/');
			this.fetchNode(newSlugs);

			const newState = {
				'scrollX': window.scrollX,
				'scrollY': window.scrollY
			};

			window.scrollTo(0, 0);

			return newState;
		},
		(newState, newURL) => {
			const newSlugs = getSlugsFromURL(newURL);

			this.fetchNode(newSlugs).then(() => {
				if (!newState) return;
				window.scrollTo(newState.scrollX, newState.scrollY);
			});
		});

		this.onLogin = this.onLogin.bind(this);
	}

	componentDidMount() {
		DEBUG && console.log("[componentDidMount] +");

		const newSlugs = getSlugsFromURL(window.location.href);

		return Promise.all([
			this.fetchUser(),
			this.fetchRoot(),	// Fetches root, featured, and id's of all games associated with you
			this.fetchNode(newSlugs)
		]).then(r => {
			DEBUG && console.log("[componentDidMount] -");
		})
		.catch(err => {
			this.setState({ 'error': err });
		});
	}

	/*
	storeHistory( input, page_title = null, page_url = null ) {
		if ( window.history && window.history.replaceState && input ) {
			history.replaceState({
				'path': input.path ? input.path : "",
				'slugs': input.slugs ? input.slugs : [],
				'extra': input.extra ? input.extra : [],
				'node': input.node ? input.node : null
			}, page_title, page_url);
		}
	}

	componentDidUpdate( prevProps, prevState ) {
		// MK: substr is deprecated. Use slice or substring.
		if (window.location.href.substr(-3) == "#--") {
			history.replaceState({}, '', window.location.href.replace("#--", ""));
		}

		this.storeHistory(this.state);

		if (this.state.node != prevState.node) {
			this.handleAnchors();
		}
	}


	cleanURL( url ) {
		url.pathname = Sanitize.clean_Path(url.pathname);
		url.search = Sanitize.clean_Query(url.search);
		url.hash = Sanitize.clean_Hash(url.hash);
		url.slugs = Sanitize.trimSlashes(url.pathname).split('/');

		return url;
	}

	cleanLocation( location ) {
		// Clean the URL
		let clean = {
			"pathname": Sanitize.clean_Path(location.pathname),
			"search": Sanitize.clean_Query(location.search),
			"hash": Sanitize.clean_Hash(location.hash),
		};

		clean.path = clean.pathname + clean.search + clean.hash;

		// Parse the clean URL
		clean.slugs = Sanitize.trimSlashes(clean.pathname).split('/');

		return clean;
	}
*/

	/**
	 * @typedef {Object} DialogProps
	 * @prop {string} dialog
	 * @prop {string[]} [args]
	 */

	/**
	 * @param {string} url
	 * @returns {DialogProps}
	 */
	getDialogProps( url ) {
		const newURL = new URL(url);

		const dialogPath = newURL.searchParams.get("a");
		if (!dialogPath) return null;

		const dialogPathParts = dialogPath.split("!");
		if (!dialogPathParts.length) return null;

		return {
			"dialog": dialogPathParts[0],
			"args": dialogPathParts.slice(1)
		};
	}

	showDialog() {
		let props = this.getDialogProps(window.location.href);

		if ( props ) {
			switch (props.dialog) {
				case 'user-login':
					return <DialogLogin {...props} onLogin={this.onLogin} />;
				case 'user-confirm':
					return <DialogUserConfirm {...props} />;
				case 'user-activate':
					return <DialogActivate {...props} />;
				case 'user-register':
					return <DialogRegister {...props} />;
				case 'user-reset':
					return <DialogReset {...props} />;
				case 'user-password':
					return <DialogPassword {...props} />;
				case 'expired':
					return <DialogSession {...props} />;
				case 'savebug':
					return <DialogSavebug {...props} />;
				case 'create':
					return <DialogCreate {...props} />;
				case 'submit':
					return <DialogSubmit {...props} />;
				case 'tv':
					return <DialogTV {...props} />;
				case 'error-upload':
					return <DialogErrorUpload {...props} />;
				case 'error-publish':
					return <DialogErrorPublish {...props} />;
				default:
					return <DialogUnfinished {...props} />;
			}
		}
		return null;
	}

	// Called by the login dialog
	onLogin() {
		this.setState({ 'user': null });
	}

	// *** //

	// Fetch the root (and featured game). DOES NOT require user to be loaded first!
	fetchRoot() {
		DEBUG && console.log("[fetchRoot] +");

		return $Node.What(SITE_ROOT).then(r => {
			DEBUG && console.log("[fetchRoot] * Root: ", r.root.id, r.root);

			let newState = {};
			newState.root = r.root;

			if ( r.featured ) {
				DEBUG && console.log("[fetchRoot] * Featured: ", r.featured.id, "("+r.featured.name+")", r.featured);
				DEBUG && console.log("[fetchRoot] * What you made: ", r.node);

				newState.featured = r.featured;
				newState.featured.what = r.node;

				let focus = 0;
				let focusDate = 0;
				let lastPublished = 0;

				DEBUG && console.log("[fetchRoot] * Hack! We don't support choosing your active game yes, so use logic to detect it");

				// TODO: according to TS, r.node is not an integer, but rather a string. Number should not be needed here.
				for ( let key in r.node ) {
					let newDate = new Date(r.node[key].modified).getTime();
					if ( newDate > focusDate ) {
						focusDate = newDate;
						focus = Number(key);
					}
					if ( r.node[key].published ) {
						lastPublished = Number(key);
						DEBUG && console.log('[fetchRoot] * '+key+' is published');
					}
				}
				if ( focus ) {
					DEBUG && console.log('[fetchRoot] * '+focus+' was the last modified');
				}

				// If the last updated is published, focus on that
				if ( r.node[focus] && r.node[focus].published ) {
					newState.featured.focus_id = focus;
				}
				// If not, make it the last known published game
				else if ( lastPublished ) {
					newState.featured.focus_id = lastPublished;
				}
				// Otherwise, just the last one we found
				else { //if ( focus > 0 ) {
					newState.featured.focus_id = focus;
				}

				DEBUG && console.log('[fetchRoot] * '+newState.featured.focus_id+' chosen as focus_id');
			}

			this.setState(newState);

			DEBUG && console.log('[fetchRoot] - ');
		});
	}

	// Fetch the node our current URL points at
	fetchNode( slugs, newArgs ) {
		DEBUG && console.log("[fetchNode] + Slugs:", slugs);

		let args = ['node', 'parent', '_superparent', 'author'];
		if ( newArgs ) {
			args = args.concat(newArgs);
		}

		// Walk to the active node
		return $Node.Walk(SITE_ROOT, slugs, args).then(r => {
			// Store the path determined by the walk
			if ( r.node_id ) {
				DEBUG && console.log("[fetchNode] * Walked", r.node_id, r);

				let NewState = {};
				NewState.path = (r.path.length ? '/' : '') +slugs.slice(0, r.path.length).join('/');
				NewState.extra = r.extra;

				NewState.node = r.node[r.node_id];
				NewState.parent = NewState.node.parent ? r.node[NewState.node.parent] : null;
				NewState._superparent = NewState.node._superparent ? r.node[NewState.node._superparent] : null;
				NewState.author = NewState.node.author ? r.node[NewState.node.author] : null;

				this.setState(NewState);

				DEBUG && console.log("[fetchNode] - Node:", r.node_id);

				return r;
			}
			// MK TODO: Should we do this?
			throw "[fetchNode] Unable to walk tree";
		})
		.catch(err => {
			this.setState({ 'error': err });
		});
	}

	// Fetch the active user (if logged in)
	fetchUser() {
		DEBUG && console.log("[fetchUser] +");

		// Fetch Active User
		return $Node.GetMy().then(r => {
			let User = {};

			if ( r.node ) {
				User = Object.assign({}, r.node);
				User['private'] = {};
				User['private']['meta'] = r.meta;
				User['private']['refs'] = r.refs;
			}

			// Finally, user is ready
			this.setState({ 'user': User });

			DEBUG && console.log("[fetchUser] * You are", User.id, "("+User.name+")", User);

			// TODO: This test should be a function
			if ( DEBUG && User && User.private && User.private.meta && User.private.meta.admin ) {
				console.log("[fetchUser] * Administrator");
			}
			// @endif

			// Pre-cache my Love (for later)
			return r.node ? $NodeLove.GetMy() : r;
		})
		.then(r => {
			DEBUG && console.log("[fetchUser] - User: ", this.state.user);
			return r;
		})
		.catch(err => {
			// An error here isn't actually an error. It just means we have no user
			this.setState({ 'user': { 'id': 0 } });
		});
	}

	// *** //
/*
	// Hash Changes are automatically differences
	onHashChange( e ) {
		DEBUG && console.log("hashchange: ", e.newURL);

		this.setState(prevState => {
			let { slugs } = this.cleanLocation(window.location);

			// If slugs are the same, we don't need to change them
			if ( slugs.join() === prevState.slugs.join() ) {
				return {};
			}

			return { 'slugs': slugs };
		});

		this.handleAnchors();
	}
*/

/*
	// TODO: stop doing this, and remove the funny anchor feature
	handleAnchors(evtHash) {
		if ( window.location.hash || evtHash ) {
			let hash = Sanitize.parseHash(evtHash || window.location.hash);

			if ( hash.path === "" && hash.extra.length > 0 ) {
				let heading = document.getElementById(hash.extra[0]);
				if ( heading ) {
					heading.scrollIntoView();

					/* MK: I can't find a "view-bar" */
					/*
					//let viewBar = document.getElementsByClassName("view-bar")[0];
					//if ( viewBar ) {
					//	window.scrollBy(0, -viewBar.clientHeight);
					//}
				}
			}
		}
	}
*/

/*
	// When we navigate by clicking forward
	onNavChange( e ) {
		DEBUG && console.log('navchange:', e.detail.old.href, '=>', e.detail.location.href);

		this.cleanURL(e.detail.location);

		if ( e.detail.location.href !== e.detail.old.href ) {
			history.pushState(null, null, e.detail.location.href);

			this.fetchNode(e.detail.location.slugs);
		}


		//if ( e.detail.location.href !== e.detail.old.href ) {
		//	let clean = this.cleanLocation(e.detail.location);

		//	if ( clean.slugs.join() !== this.state.slugs.join() ) {
		//		history.pushState(null, null, e.detail.location.pathname + e.detail.location.search);

		//		this.fetchNode(clean.slugs);
		//	}
		//}

		// Scroll to top
		window.scrollTo(0, 0);

		this.handleAnchors(e.detail.location.hash);
	}
	// When we navigate using back/forward buttons
	onPopState( e ) {
		DEBUG && console.log("popstate: ", e.state);

		// NOTE: This is sometimes called on a HashChange with a null state
		if ( e.state ) {
			this.setState(e.state);
		}

		this.handleAnchors();
	}
*/

	generateTitle( node ) {
		let Title = "";
		let TitleSuffix = window.location.host;
		if (window.location.host == "ldjam.com") {
			TitleSuffix += " | Ludum Dare game jam";
		}

		if ( node.name ) {
			Title = titleParser(node.name, true);
			if ( Title === "" ) {
				Title = TitleSuffix;
			}
			else {
				Title += " | " + TitleSuffix;
			}
		}
		else {
			Title = TitleSuffix;
		}
		return Title;
	}

	render( {}, state ) {
		let { node, parent, _superparent, author, user, featured, path, extra } = state;
		let props = { node, parent, _superparent, author, user, featured, path, extra };

		if ( node ) {
			document.title = this.generateTitle(node);
		}

		// Set the robots meta tag
		let robots_value = "noindex";
		if (node._trust > 0) {
			robots_value = "all";
		}
		document.querySelector('meta[name="robots"]').setAttribute("content", robots_value);

		return (
			<Layout {...state}>
				<ContentRouter nodefault props={props} key="main">
					<Route type="root" component={PageRoot} />

					<Route type="page" component={PagePage} />
					<Route type="post" component={PagePost} />

					<Route type="item">
						<Route subtype="game" component={PageItem} />
						<Route subtype="tool" component={PageItem} />
					</Route>

					<Route type="tag" component={PageTag} />

					<Route type="user" component={PageUser} />
					<Route type="users" component={PageUsers} />

					<Route type="event" component={PageEvent} />
					<Route type={["events", "group", "tags"]} component={PageEvents} />
				</ContentRouter>
				{this.showDialog()}
			</Layout>
		);
	}
}

render(<Main />, document.body);
