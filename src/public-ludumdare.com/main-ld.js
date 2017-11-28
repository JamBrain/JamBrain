import {h, render, Component, options}	from 'preact/preact';

// @ifdef DEBUG
import {}								from 'preact-devtools/devtools';
// @endif

import Sanitize							from 'internal/sanitize/sanitize';

import Router							from 'com/router/router';
import Route							from 'com/router/route';

import Layout							from "com/page/layout";

import PageHome 						from 'com/page/home/home';
import PagePage 						from 'com/page/page/page';
import PagePost 						from 'com/page/post/post';
import PageItem 						from 'com/page/item/item';
import PageTag 							from 'com/page/tag/tag';
import PageUser 						from 'com/page/user/user';
import PageUsers 						from 'com/page/users/users';
import PageEvent 						from 'com/page/event/event';
import PageEvents 						from 'com/page/events/events';
import PageError 						from 'com/page/error/error';
import PageMySettings 					from 'com/page/my/settings';
import PageMyNotifications 				from 'com/page/my/notifications';
import PageDevPalette 					from 'com/page/dev/palette';
import PageDevApiHealth					from 'com/page/dev/apihealth';
import PageDevApiStats					from 'com/page/dev/apistats';

import DialogUnfinished					from 'com/dialog/unfinished/unfinished';
import DialogLogin						from 'com/dialog/login/login';
import DialogRegister					from 'com/dialog/register/register';
import DialogActivate					from 'com/dialog/activate/activate';
import DialogReset						from 'com/dialog/reset/reset';
import DialogPassword					from 'com/dialog/password/password';
import DialogAuth						from 'com/dialog/auth/auth';
import DialogSession					from 'com/dialog/session/session';
import DialogSavebug					from 'com/dialog/savebug/savebug';
import DialogUserConfirm				from 'com/dialog/user/user-confirm';
import DialogSubmit						from 'com/dialog/submit/submit';
import DialogTV							from 'com/dialog/tv/tv';
import DialogCreate						from 'com/dialog/create/create';

//import AlertBase						from 'com/alert-base/base';

import $Node							from 'shrub/js/node/node';
import $User							from 'shrub/js/user/user';
import $NodeLove						from 'shrub/js/node/node_love';


window.LUDUMDARE_ROOT = '/';
window.SITE_ROOT = 1;


// NOTE: Deprecated
// Add special behavior: when class attribute is an array, flatten it to a string
options.vnode = function(vnode) {
	if ( vnode && vnode.attributes && Array.isArray(vnode.attributes.class) ) {
		if ( vnode.attributes.class.length ) {
			vnode.attributes.class = vnode.attributes.class.join(' ');
		}
		else {
			// NOTE: this might be slow. You can disable this, and the .length check for a potential speedup
			delete vnode.attributes.class;
		}
	}
};

class Main extends Component {
	constructor( props ) {
		super(props);
		console.log("[constructor]");
		// @ifdef DEBUG
		console.log("Running in DEBUG mode");
		// @endif

		var clean = this.cleanLocation(window.location);
		if ( window.location.origin+clean.path !== window.location.href ) {
			// @ifdef DEBUG
			console.log("Cleaned URL: "+window.location.href+" => "+window.location.origin+clean.path);
			// @endif

			this.storeHistory(window.history.state, null, clean.path);
		}

		this.state = {
			// URL walking
			'path': '',
			'slugs': clean.slugs,
			'extra': [],

			// Active Node
			'node': {
				'id': 0
			},

			// Root Node
			'root': null,

			// Featured node
			'featured': null,

			// Active User
			'user': null
		};

		window.addEventListener('hashchange', this.onHashChange.bind(this));
		window.addEventListener('navchange', this.onNavChange.bind(this));
		window.addEventListener('popstate', this.onPopState.bind(this));

		this.onLogin = this.onLogin.bind(this);

//        this.doEverything();
	}

	componentDidMount() {
		this.fetchData();
		this.fetchRoot();
	}

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
		if (window.location.href.substr(-3) == "#--") {
			history.replaceState({}, '', window.location.href.replace("#--", ""));
		}

		this.storeHistory(this.state);

		if (this.state.node != prevState.node) {
			this.handleAnchors();
		}
	}

	cleanLocation( location ) {
		// Clean the URL
		var clean = {
			"pathname": Sanitize.clean_Path(location.pathname),
			"search": Sanitize.clean_Query(location.search),
			"hash": Sanitize.clean_Hash(location.hash),
		};

		clean.path = clean.pathname + clean.search + clean.hash;

		// Parse the clean URL
		clean.slugs = Sanitize.trimSlashes(clean.pathname).split('/');

		return clean;
	}

	getDialog() {
		var props = Sanitize.parseHash(window.location.hash);

		if ( window.location.hash ) {
			if ( window.location.hash.indexOf("/") != 1 && props.path !== "--") {
				switch (props.path) {
					case 'user-login':
						props.onlogin = this.onLogin;
						return <DialogLogin {...props} />;
					case 'user-confirm':
						return <DialogUserConfirm {...props} />;
					case 'user-activate':
						return <DialogActivate {...props} />;
					case 'user-register':
						return <DialogRegister {...props} />;
					case 'user-auth':
						return <DialogAuth {...props} />;
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
					default:
						return <DialogUnfinished {...props} />;
				}
			}
		}
		return null;
	}

	// Called by the login dialog
	onLogin() {
		this.setState({'user': null});
		this.fetchData();
	}

	// *** //

	fetchRoot() {
		console.log("[fetchRoot]");

		return $Node.Get(SITE_ROOT)
		.then(r => {
			if ( r.node.length ) {
				var node = r.node[0];

				this.setState({
					'root': node
				});

				if ( node.meta['featured'] && (node.meta['featured']|0) > 0 ) {
					return this.fetchFeatured(node.meta['featured']|0);
				}
				console.log("[fetchRoot] Done:", node.id);
			}
			else {
				throw '[fetchRoot] Failed to load root node';
			}
		})
		.catch(err => {
			this.setState({'error': err});
		});
	}

	fetchFeatured( node_id ) {
		console.log("[fetchFeatured]");

		// Used across everything below
		var Node = null;

		return $Node.Get(node_id)
			.then(r => {
				// If
				if ( r && Array.isArray(r.node) && r.node.length ) {
					Node = r.node[0];

					console.log("[fetchFeatured] +", Node.id);

					return $Node.What(Node.id);
				}

				// No featured event
				return null;
			})
			.then(r => {
				if ( r && r.what ) {
					Node.what = r.what;

					console.log('[fetchFeatured] My Game(s):', Node.what);

					if ( Node.what.length ) {
						return $Node.GetKeyed(r.what);
					}
				}

				return Promise.resolve({});
			})
			.then( r => {
				if ( r && r.node ) {
					Node.what_node = r.node;

					var Focus = 0;
					var FocusDate = 0;
					var LastPublished = 0;

					for ( var key in r.node ) {
						var NewDate = new Date(r.node[key].modified).getTime();
						if ( NewDate > FocusDate ) {
							FocusDate = NewDate;
							Focus = key|0;
						}
						if ( r.node[key].published ) {
							LastPublished = key|0;
							console.log('[fetchFeatured] '+key+' is published');
						}
					}
					if ( Focus ) {
						console.log('[fetchFeatured] '+Focus+' was the last modified');
					}

					// If the last updated is published, focus on that
					if ( r.node[Focus].published ) {
						Node.focus = Focus;
					}
					// If not, make it the last known published game
					else if ( LastPublished ) {
						Node.focus = Lastpublished;
					}
					// Otherwise, just the last one we found
					else if ( Focus > 0 ) {
						Node.focus = Focus;
					}

					if ( Node.focus || Node.focus === 0 ) {
						console.log('[fetchFeatured] '+Node.focus+' chosen as Focus');
					}
				}

				this.setState({
					'featured': Node
				});

				console.log('[fetchFeatured] -', Node.id);

				return r;
			})
			.catch(err => {
				this.setState({'error': err});
			});
	}

	fetchNode() {
		//console.log("[fetchNode]");

		var NewState = {};

		// Walk to the active node
		return $Node.Walk(SITE_ROOT, this.state.slugs)
		.then(r => {
			if ( r && r.node ) {
				NewState['path'] = (r.path.length ? '/' : '') +this.state.slugs.slice(0, r.path.length).join('/');
				NewState['extra'] = r.extra;

				// Now, lookup the node
				return $Node.Get(r.node);
			}
			else {
				throw '[fetchNode] Unable to walk tree';
			}
			return null;
		})
		.then(r => {
			// Process node
			if ( r && r.node && r.node.length ) {
				NewState['node'] = r.node[0];
				this.setState(NewState);

				//console.log("[fetchNode] Done:", NewState['node'].id);
			}
			else {
				throw '[fetchNode] No nodes found';
			}
			return null;
		})
		.catch(err => {
			this.setState({'error': err});
		});
	}

	fetchUser() {
		console.log("[fetchUser]");

		var Caller = 0;
		var User = {
			'id': 0
		};

		// Fetch the Active User
		return $User.Get().then(r => {
			Caller = r.caller_id|0;
			console.log("[fetchUser] caller_id:", Caller);

			// Process my User
			if ( Caller && r.node ) {
				User = Object.assign({}, r.node);
				User['private'] = {};

				// Pre-cache my Love (not returned)
				$NodeLove.GetMy();
			}
			return null;	// Do we need this?
		})
		.then(r => {
			if ( Caller && User.id ) {
				// Load user's private data
				return $Node.GetMy();
			}
			return null;	// Do we need this?
		})
		.then(r => {
			// Process private User data
			if ( r ) {
				User['private']['meta'] = r.meta;
//				User['private']['link'] = r.link;
				User['private']['refs'] = r.refs;
			}

			// Finally, user is ready
			this.setState({
				'user': User
			});

			console.log("[fetchUser] Done:", Caller);

			return null;	// Do we need this?
		})
		.catch(err => {
			this.setState({
				'error': err
			});
		});
	}


	fetchData() {
		console.log("[fetchData]");

		// If no user
		if ( !this.state.user ) {
			// First, fetch the user
			return this.fetchUser().then(() => {
				// Next, fetch the node (if not loaded)
				if ( this.state.node && !this.state.node.id ) {
					return this.fetchNode();
				}
				return null;
			});
		}
		// Fetch the node (if not loaded)
		else if ( this.state.node && !this.state.node.id ) {
			return this.fetchNode();
		}
		return null;
	}

	// *** //

	// Hash Changes are automatically differences
	onHashChange( e ) {
		console.log("hashchange: ", e.newURL);
		var slugs = this.cleanLocation(window.location).slugs;

		if ( slugs.join() === this.state.slugs.join() ) {
			this.setState({});
		}
		else {
			this.setState({
				'slugs': slugs
			});
		}

		this.handleAnchors();
	}

	handleAnchors() {
		if ( window.location.hash ) {
			var hash = Sanitize.parseHash(window.location.hash);

			if ( hash.path === "" && hash.extra.length > 0 ) {
				var heading = document.getElementById(hash.extra[0]);
				if ( heading ) {
					heading.scrollIntoView();

					var viewBar = document.getElementsByClassName("view-bar")[0];
					if ( viewBar ) {
						window.scrollBy(0, -viewBar.clientHeight);
					}
				}
			}
		}
	}

	// When we navigate by clicking forward
	onNavChange( e ) {
		console.log('navchange:', e.detail.old.href, '=>', e.detail.location.href);

		if ( e.detail.location.href !== e.detail.old.href ) {
			var slugs = this.cleanLocation(e.detail.location).slugs;

			if ( slugs.join() !== this.state.slugs.join() ) {
				history.pushState(null, null, e.detail.location.pathname + e.detail.location.search);

				this.setState({
					'slugs': slugs,
					'node': {
						'id': 0
					}
				});
				this.fetchNode();
			}
		}

		// Scroll to top
		window.scrollTo(0, 0);

		this.handleAnchors();
	}
	// When we navigate using back/forward buttons
	onPopState( e ) {
		console.log("popstate: ", e.state);
		// NOTE: This is sometimes called on a HashChange with a null state
		if ( e.state ) {
			this.setState(e.state);
		}

		this.handleAnchors();
	}

	getTitle( node ) {
		let Title = "";

		if ( node.name ) {
			Title = titleParser.parse(node.name, true);		// What is titleParser?
			if ( Title === "" ) {
				Title = window.location.host;
			}
			else {
				Title += " | " + window.location.host;
			}
		}
		else {
			Title = window.location.host;
		}
		return Title;
	}

	render( {}, {node, user, featured, path, extra, error} ) {
		var ShowContent = null;
		let props = {node, user, featured, path, extra, error};

		if ( node ) {
			document.title = this.getTitle(node);
		}

		return (
			<div id="app">
				<Layout {...this.state}>
					<Router node={node} props={props} path={extra}>
						<Route type="root" component={PageHome}>
							<Route static path="/my">
								<Route static path="/settings" component={PageMySettings} />
								<Route static path="/notifications" component={PageMyNotifications} />
							</Route>
							<Route static path="/dev">
								<Route static path="/palette" component={PageDevPalette} />
								<Route static path="/apihealth" component={PageDevApiHealth} />
								<Route static path="/apistats" component={PageDevApiStats} />
							</Route>
						</Route>

						<Route type="page" component={PagePage} />
						<Route type="post" component={PagePost} />

						<Route type="item">
							<Route subtype="game" component={PageItem} />
						</Route>

						<Route type="tag" component={PageTag} />

						<Route type="user" component={PageUser} />
						<Route type="users" component={PageUsers} />

						<Route type="event" component={PageEvent} />
						<Route type={["events", "group", "tags"]} component={PageEvents} />

						<Route type="error" component={PageError} />
					</Router>
					{this.getDialog()}
				</Layout>
			</div>
		);
	}
}

render(<Main />, document.body);
