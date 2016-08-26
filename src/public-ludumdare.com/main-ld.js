import { h, render, Component }			from 'preact/preact';
import NavBar 							from 'com/nav-bar/bar';

import ViewTimeline						from 'com/view-timeline/timeline';
import ViewSingle						from 'com/view-single/single';

import JammerCore						from '../jammer-core/core';


window.LUDUMDARE_ROOT = '/';

class Main extends Component {
	constructor() {
		this.state = {
			root: 1,
			active: 1,
		};
		
		this.setActive(window.location);

		// Bind Events to handle future changes //
		var that = this;
		window.addEventListener('hashchange',that.onHashChange.bind(that));
		window.addEventListener('navchange',that.onNavChange.bind(that));
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
		
	setActive( whom ) {
		// Clean the URL //
		var clean = {
			pathname: this.makeClean(whom.pathname),
			search: whom.search,
			hash: this.makeClean(whom.hash),
		}
		var clean_path = clean.pathname+clean.search+clean.hash;
		
		// If current URL is unclean, replace it //
		if ( whom.pathname !== clean.pathname || whom.hash !== clean.hash ) {
			window.history.replaceState( null, null, clean_path );
		}
		
		// Parse the clean URL //
		var slugs = this.trimSlashes(clean.pathname).split('/');
		
		// Figure out what our active page_id actually is //
		this.state.active = JammerCore.getItemIdByParentAndSlugs( this.state.root, slugs );
	}

	
	componentDidMount() {
		// Startup //
	}
	
	onHashChange() {
		let state = this.state;
		
		this.setState(state);
	}
	onNavChange( e ) {
		//console.log( e.detail.href, e.detail.old.href );
		if ( e.detail.href !== e.detail.old.href ) {
			this.setActive(e.detail);
			this.setState(this.state);
		}
	}
	
	getView( props, state ) {
		if ( state.active ) {
			var item = JammerCore.getItemById( state.active );
	
			if ( item.type === 'root' ) {
				return <ViewTimeline item={state.active} />;
			}
			else if ( item.type === 'post' || item.type === 'game' || item.type === 'user' ) {
				return <ViewSingle item={state.active} />;
			}
			else {
				return <div>unsupported</div>;
			}
		}
		else {
			return <div>404</div>;
		}
	}
	
	render( props, state ) {
		//let hasHash = window.location.hash ? <div>{window.location.hash}</div> : <div />;
		//console.log("paint:",state);
		
		return (
			<div id="layout">
				<NavBar />
				{ this.getView(props,state) }
			</div>
		);
	}
};

render(<Main />, document.body);
