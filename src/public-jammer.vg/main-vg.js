import { h, render, Component }			from 'preact/preact';
import NavBar 							from 'com/nav-bar/bar';
import DarkOverlay						from 'com/dark-overlay/overlay';

import ContentPost						from 'com/content-post/post';
import ContentPicture					from 'com/content-picture/picture';

import SidebarCalendar					from 'com/sidebar-calendar/calendar';
import SidebarUpcoming					from 'com/sidebar-upcoming/upcoming';
import SidebarTV						from 'com/sidebar-tv/tv';
import SidebarTrending					from 'com/sidebar-trending/trending';

class Main extends Component {
	constructor() {
		this.state = {};
		this.state.posts = [ 
			{
				title:"A dangerous place in SPAAAACE",
				slug:"a-dangerous-place-in-space",
				author:'pov',
				body:"whelp! they're here!\n\nI didn't think it would happen, but :dolphin: it is.\n\n```\n  var Muffin = 10;\n```\n\nWhoa."
			}
		];
		this.state.users = {
			'pov': {
				name:'PoV',
				slug:'pov',
				avatar:'/other/logo/mike/Chicken64.png',
				twitter:'mikekasprzak',
			}
		};
			
		
		var that = this;
		window.addEventListener('hashchange',that.onHashChange.bind(that));
		
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
	}
	
	componentDidMount() {
		// Startup //
	}
	
	onHashChange() {
		console.log(window.location.hash);
		this.setState({});
	}
	
	render( props, state ) {
		let hasHash = window.location.hash ? <div>{window.location.hash}</div> : <div />;
		
		return (
			<div id="layout">
				<div id="header" />
				<div id="content-sidebar">
					<div id="content">{
						state.posts.map(function(item) {
							return <ContentPost {...item} user={state.users[item.author]} />;
						})
					}</div>
					<div id="sidebar">
						<SidebarCalendar />
						<SidebarUpcoming />
						<SidebarTV />
					</div>
				</div>
				<div id="footer">
					<span>Test: </span><span class="_on-parent-hover-hide">Hello</span><span class="_on-parent-hover-show">World</span>
					{hasHash}
				</div>
			</div>
		);
	}
};
//				<NavBar />

//				<DarkOverlay />
//						<SidebarTrending />

render(<Main />, document.body);
