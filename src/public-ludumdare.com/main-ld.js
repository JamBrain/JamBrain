import { h, render, Component }			from 'preact/preact';
import NavBar 							from 'com/nav-bar/bar';

import ViewTimeline						from 'com/view-timeline/timeline';
import ViewSingle						from 'com/view-single/single';

import DialogOverlay					from 'com/dialog-overlay/overlay';
import DialogUnfinished					from 'com/dialog-unfinished/unfinished';
import DialogLogin						from 'com/dialog-login-orig/login';

//import AlertBase						from 'com/alert-base/base';

import CoreData							from '../core-data/data';


window.LUDUMDARE_ROOT = '/';

class Main extends Component {
	constructor() {
		this.state = Object.assign({}, window.history.state ? window.history.state : {});
		this.state.root = 1;
		
		this.dialogs = {
			'#user-login': (<DialogLogin />),
			'#user-verify': (<DialogLogin />),
			'#user-register': (<DialogLogin />)
		};
		
		this.getNodeFromLocation(window.location);

		// Bind Events to handle future changes //
		var that = this;
		window.addEventListener('hashchange', that.onHashChange.bind(that));
		window.addEventListener('navchange', that.onNavChange.bind(that));
		window.addEventListener('popstate', that.onPopState.bind(that));
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
		// Clean the URL
		var clean = {
			pathname: this.makeClean(location.pathname),
			search: location.search,
			hash: this.makeClean(location.hash),
		}
		if ( clean.hash == "#" )
			clean.hash = "";

		var clean_path = clean.pathname + clean.search + clean.hash;

		// Parse the clean URL
		var slugs = this.trimSlashes(clean.pathname).split('/');
		
		// Figure out what the active node actually is
		this.state.node = parseInt(CoreData.getNodeIdByParentAndSlugs(this.state.root, slugs));
		
		// Store the state, and cleaned URL
		console.log('replaceState', this.state);
		window.history.replaceState(this.state, null, clean_path);
	}
	
	// *** //
	
	componentDidMount() {
		// Startup //
	}
	
	// *** //
	
	// Hash Changes are automatically differences
	onHashChange( e ) {
		console.log("hashchange: ", e);
		
		this.getNodeFromLocation(window.location);
		this.setState(this.state);
		
		// Don't set scroll, since we're an overlay
	}
	// When we navigate by clicking forward
	onNavChange( e ) {
		if ( e.detail.location.href !== e.detail.old.href ) {
			console.log("navchange: ", e.detail);

			this.getNodeFromLocation(e.detail.location);
			this.setState(this.state);
			
			// Scroll to top
			window.scrollTo(0, 0);
		}
	}
	// When we navigate using back/forward buttons
	onPopState( e ) {
		// NOTE: This is sometimes called on a HashChange with a null state
		if ( e.state ) {
			console.log("popstate: ", e);
	
			this.setState(e.state);
			
			window.scrollTo(parseFloat(e.state.top), parseFloat(e.state.left));
		}
	}
	
	getView( props ) {
		if ( this.state.node ) {
			var node = CoreData.getNodeById( this.state.node );
	
			if ( node.type === 'roots' ) {
				return <ViewTimeline node={this.state.node} />;
			}
			else if ( node.type === 'post' || node.type === 'game' || node.type === 'user' ) {
				return <ViewSingle node={this.state.node} />;
			}
			else {
				return <div>unsupported</div>;
			}
		}
		else {
			return <div>404</div>;
		}
	}
	
	render( props ) {
		var HashRoot = window.location.hash.split('/',1)[0];
		if ( this.dialogs[HashRoot] ) {
			var Dialog = this.dialogs[HashRoot];
		}
		else {
			var Dialog = <DialogUnfinished />;
		}
		
		let DialogCode = window.location.hash ? <DialogOverlay>{Dialog}</DialogOverlay> : <div />;
		let AlertCode = <div />;
		
		return (
			<div id="layout">
				<NavBar />
				{ this.getView(props) }
				{ DialogCode }
				{ AlertCode }
			</div>
		);
	}
};

render(<Main />, document.body);
