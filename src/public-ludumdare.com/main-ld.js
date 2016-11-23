import { h, render, Component }			from 'preact/preact';
import NavBar 							from 'com/nav-bar/bar';

import ViewSidebar						from 'com/view-sidebar/sidebar';
import ViewContent						from 'com/view-content/content';

import DialogUnfinished					from 'com/dialog-unfinished/unfinished';
import DialogLogin						from 'com/dialog-login/login';
import DialogRegister					from 'com/dialog-register/register';
import DialogActivate					from 'com/dialog-activate/activate';
import DialogAuth						from 'com/dialog-auth/auth';

//import AlertBase						from 'com/alert-base/base';

import $Node							from '../shrub/js/node/node';
import $User							from '../shrub/js/user/user';

window.LUDUMDARE_ROOT = '/';
window.SITE_ROOT = 1;

class Main extends Component {
	constructor( props ) {
		super(props);
				
		var clean = this.cleanLocation(window.location);
		if ( window.location.origin+clean.path !== window.location.href ) {
			console.log("Cleaned URL: "+window.location.href+" => "+window.location.origin+clean.path);
			window.history.replaceState(window.history.state, null, clean.path);
		}
	
		console.log("History:", window.history.state);
	
		this.state = {
			// URL walking
			id: 0,
			path: '/',
			slugs: clean.slugs,
			extra: [],
			
			// Active Node
			node: {
				id: 0
			},
			
			// Active User
			user: null
		};
		
		window.addEventListener('hashchange', this.onHashChange.bind(this));
		window.addEventListener('navchange', this.onNavChange.bind(this));
		window.addEventListener('popstate', this.onPopState.bind(this));
		
		this.onLogin = this.onLogin.bind(this);
	}
	
	getDialog() {
		var HashRoot = window.location.hash.split('/',1)[0];
		switch (HashRoot) {
			case '#user-login':
				return <DialogLogin onlogin={this.onLogin} />;
			case '#user-activate':
				return <DialogActivate />;
			case '#user-register':
				return <DialogRegister />;
			case '#user-auth':
				return <DialogAuth />;
			default:
				if ( window.location.hash )
					return <DialogUnfinished />;
				else
					return <div />
				break;
		};
	}
	
	onLogin() {
		this.setState({ user: null });
		this.fetchData();
	}

	makeSlug( str ) {
		str = str.toLowerCase();
		str = str.replace(/%[a-f0-9]{2}/g,'-');
		str = str.replace(/[^a-z0-9]/g,'-');
		str = str.replace(/-+/g,'-');
		str = str.replace(/^-|-$/g,'');
		return str;
	}

	makeClean( str ) {
		str = str.toLowerCase();
		str = str.replace(/%[a-f0-9]{2}/g,'-');		// % codes = -
		str = str.replace(/[^a-z0-9\/#]/g,'-');		// non a-z, 0-9, #, or / with -
		str = str.replace(/-+/g,'-');				// multiple -'s to a single -
		str = str.replace(/\/+/g,'/');				// multiple /'s to a single /
//		str = str.replace(/^-|-$/g,'');				// Prefix and suffix -'s with nothing
		return str;
	}
	
	trimSlashes( str ) {
		return str.replace(/^\/|\/$/g,'');
	}

	getNodeFromLocation( location ) {
//		// Clean the URL
//		var clean = {
//			pathname: this.makeClean(location.pathname),
//			search: location.search,
//			hash: this.makeClean(location.hash),
//		}
//		if ( clean.hash == "#" )
//			clean.hash = "";
//
//		var clean_path = clean.pathname + clean.search + clean.hash;
//
//		// Parse the clean URL
//		var slugs = this.trimSlashes(clean.pathname).split('/');
//		
//		// Figure out what the active node actually is
//		//this.state.node = parseInt(CoreData.getNodeIdByParentAndSlugs(this.state.root, slugs));
//		this.setState({ loading: true });
////		$Node.FetchByParentSlug(this.state.root, slugs)
////			.then(r => {
////				this.setState({ node: r, loading: false });
////			})
////			.catch(err => {
////				this.setState({ loading: false });
////			});
//		
//		// Store the state, and cleaned URL
//		console.log('replaceState', this.state);
//		window.history.replaceState(this.state, null, clean_path);
	}
	
	cleanLocation( location ) {
		// Clean the URL
		var clean = {
			pathname: this.makeClean(location.pathname),
			search: location.search,
			hash: this.makeClean(location.hash),
		}
		if ( clean.hash == "#" )
			clean.hash = "";

		clean.path = clean.pathname + clean.search + clean.hash;

		// Parse the clean URL
		clean.slugs = this.trimSlashes(clean.pathname).split('/');
		
//		// Store the state, and cleaned URL
//		console.log('cleanLocation replaceState', clean_path);//, this.state);
//		//window.history.replaceState(window.history.state, null, clean_path);
//		window.history.replaceState(null, null, clean_path);
//	
//		return slugs;
		return clean;
	}
	
	// *** //
	
	fetchNode() {
		// Fetch the active node
		$Node.Walk(SITE_ROOT, this.state.slugs)
		.then(r => {
			// We found a path
			var new_state = { 
				id: r.node,
				path: '/'+this.state.slugs.slice(0, r.path.length).join('/'),
				extra: r.extra
			};
			
			// Now lookup the node
			$Node.Get(r.node)
			.then(rr => {
				if ( rr.node && rr.node.length ) {
					new_state.node = rr.node[0];
					this.setState(new_state);
				}
				else {
					this.setState({ error: err });
				}
			})
			.catch(err => {
				this.setState({ error: err });
			});
		})
		.catch(err => {
			this.setState({ error: err });
		});		
	}
	
	fetchUser() {
		// Fetch the Active User
		$User.Get().then(r => {
			this.setState({ user: r.node });
		})
		.catch(err => {
			this.setState({ error: err });
		});		
	}
	
	fetchData() {
		if ( this.state.node && !this.state.node.id )
			this.fetchNode();
		if ( !this.state.user )
			this.fetchUser();	
	}
	
	componentDidMount() {
		this.fetchData();
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
			this.setState({ id: 0, slugs: slugs });
		}
		
//		this.fetchNode(this.cleanLocation(window.location));
		//this.getNodeFromLocation(window.location);
		//this.setState(this.state);
		
		// Don't set scroll, since we're an overlay
	}
	// When we navigate by clicking forward
	onNavChange( e ) {
		console.log('navchange:',e.detail.old.href,'=>',e.detail.location.href);
		if ( e.detail.location.href !== e.detail.old.href ) {
//			console.log(e.detail.location);
			//console.log("navchange: ", e.detail.location.href);

			var slugs = this.cleanLocation(e.detail.location).slugs;

			if ( slugs.join() !== this.state.slugs.join() ) {
//				// Store 
//				var old_state = Object.assign({},this.state);
//				console.log('replaceState', old_state);
//				history.replaceState(old_state, null);//, null, window.location.pathname+window.location.search);

//			console.log('pushState');
//			history.pushState(null, null, this.base.pathname+this.base.search);
		
//			window.history.state = Object.assign({},this.state);
//			window.history.replaceState(window.history.state, null, e.detail.old.href);

				// Advance history by pushing a state (that will be updated by the 'navchange' event)
				console.log('pushState');
				history.pushState(null, null, e.detail.location.pathname+e.detail.location.search);

				this.setState({ id: 0, slugs: slugs, node: {id: 0} });

				this.fetchData();

				// Scroll to top
				window.scrollTo(0, 0);
			}
		}
	}
	// When we navigate using back/forward buttons
	onPopState( e ) {
		console.log("popstate: ", e.state);
		// NOTE: This is sometimes called on a HashChange with a null state
		if ( e.state ) {
			this.setState(e.state);
			
			//window.scrollTo(parseFloat(e.state.top), parseFloat(e.state.left));
		}
//		else {
//			this.setState({});
//		}
	}
	
	componentDidUpdate( prevProps, prevState ) {
//		console.log('state change');
		var state_copy = Object.assign({},this.state);
//		console.log('replaceState', state_copy);
		history.replaceState(state_copy, null);
	}

	render( {}, {node, user, path, extra, error} ) {
		if ( node.id ) {
			let DialogCode = this.getDialog();
			let AlertCode = <div />;
			
			return (
				<div id="layout">
					<NavBar user={user} />
					<div class="view-single">
						<div id="header" />
						<div id="content-sidebar">
							<ViewContent node={node} user={user} path={path} extra={extra} />
							<ViewSidebar />
						</div>
						<div id="footer"></div>
					</div>					
					{ DialogCode }
					{ AlertCode }
				</div>
			);
		}
		else {
			return (
				<div id="layout">
					{ error ? error : "Please Wait..." }
				</div>
			);
		}
	}
};

render(<Main />, document.body);
