import { h, render, Component }			from 'preact/preact';
import NavBar 							from 'com/nav-bar/bar';

import ViewTimeline						from 'com/view-timeline/timeline';
import JammerCore						from '../jammer-core/core';


window.LUDUMDARE_ROOT = '/events/ludum-dare';

class Main extends Component {
	constructor() {
		this.state = {
			root: 1,
			active: 1,
		};
		
		// Clean the URL //
		var clean = {
			pathname: this.makeClean(window.location.pathname),
			search: window.location.search,
			hash: this.makeClean(window.location.hash),
		}
		var clean_path = clean.pathname+clean.search+clean.hash;
		
		// If current URL is unclean, replace it //
		if ( window.location.pathname !== clean.pathname || window.location.hash !== clean.hash ) {
			window.history.replaceState( null, null, clean_path);
		}
		
		// Parse the clean URL //
		var slugs = this.trimSlashes(clean.pathname).split('/');
		
		// Figure out what our active page_id actually is //
		this.state.active = JammerCore.getItemIdByParentAndSlugs( this.state.root, slugs );
		
		// Bind Events to handle future changes //
		var that = this;
		window.addEventListener('hashchange',that.onHashChange.bind(that));
		window.addEventListener('navchange',that.onNavChange.bind(that));

/*		
		function make_slug( str ) {
			str = str.toLowerCase();
			str = str.replace(/%[a-f0-9]{2}/g,'-');
			str = str.replace(/[^a-z0-9]/g,'-');
			str = str.replace(/-+/g,'-');
			str = str.replace(/^-|-$/g,'');
			return str;
		}
		
		var url = window.location.pathname.replace(/^\/|\/$/g,'');
		
		var url_parts = url.split('/');
		url_parts = url_parts.map( part => make_slug(part) );
		
		console.log(url_parts);
		
		var clean_url = url_parts.join('/');
		console.log(url);
		console.log(clean_url);
		if ( url !== clean_url ) {
			console.log("bad url, cleaning...");
			
			let new_url = '/'+clean_url;
			if ( new_url !== '/' )
				new_url += '/';
			if ( window.location.hash )
				new_url += window.location.hash;
				
			window.history.replaceState(null,null,new_url);
		}
*/
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
	
	cleanPath( path ) {
		return path.split('/').map( part => { return this.makeSlug(part) }).join('/');
	}
	cleanHash( path ) {
		var parts = path.split('#');
		
		if ( parts.length > 1 ) {
			return '#'+parts[1].split('/').map( part => { return this.makeSlug(part) }).join('/');
		}
		return "";
	}
	
	componentDidMount() {
		// Startup //
	}
	
	onHashChange() {
		let state = this.state;
		
		//console.log(window.location.hash);
		this.setState(state);
	}
	onNavChange( e ) {
		let state = this.state;
		//state.active = JammerCore.lookupByParentAndSlugs(this.state.root,e.detail.pathname)
		
		console.log( this, e );
		this.setState(state);
	}
	
	getView( props, state ) {
		if ( state.active ) {
			var item = JammerCore.getItemById( state.active );
	
			if ( item.type === 'root' ) {
				return <ViewTimeline item={state.active} />;
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
		console.log("paint:",state);
		
		return (
			<div id="layout">
				<NavBar />
				{ this.getView(props,state) }
			</div>
		);
	}
};

render(<Main />, document.body);
