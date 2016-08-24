import { h, render, Component }			from 'preact/preact';
import NavBar 							from 'com/nav-bar/bar';
import DarkOverlay						from 'com/dark-overlay/overlay';

import ContentPost						from 'com/content-post/post';
import ContentPicture					from 'com/content-picture/picture';

import SidebarCalendar					from 'com/sidebar-calendar/calendar';
import SidebarUpcoming					from 'com/sidebar-upcoming/upcoming';
import SidebarTV						from 'com/sidebar-tv/tv';
import SidebarTrending					from 'com/sidebar-trending/trending';
import SidebarSupport					from 'com/sidebar-support/support';

class Main extends Component {
	constructor() {
		this.state = {};
		this.state.posts = [ 
			{
				title:"Work in Progress",
				slug:"work-in-progress",
				author:'pov',
				body:"Hi! Yes the theme is weird and unusual. It's not done.\n\n"+
					"I'm blocking out features, which means I'm focused on adding them and making them work. That doesn't necessarily mean I'm worried about how they look.\n\n"+
					"You're welcome to comment on them, but understand that I'm focused on function, not form."
			},
			{
				title:"**True Story:** The Internet is ~~DEAD~~ _REAL_",
				slug:"true-story-the-internet-is-real",
				author:'pov',
				body:"Even I can't believe it! I feel like a :whale:! :bird: :crocodile:\n\n"+
					"# This is a quote :tiger: \n\n> Somebody is going to say \"this\", some day\n\n"+
					"This is a quote, from twitter (also a tweet):\n\nhttps://twitter.com/mikekasprzak/status/565641812703203328\n\n"+
					"Some test URLS:\n* https://github.com/ludumdare/ludumdare\n* https://twitter.com/mikekasprzak\n* https://reddit.com/r/ludumdare\n* https://twitch.tv/ludumdare\n* https://www.youtube.com/user/ButtonMasherBros\n* https://www.youtube.com/povrazor\n* http://moo.com\n* Hey @pov, I need @help.\n\n"+
					"This is **BOLD**. This is _ITALICS_. This is ***BOTH***.\n\n"+
					"This is my <b>trying to use HTML</b>, and failing\n\n"+
					"This is a Youtube Video.\n\nhttps://www.youtube.com/watch?v=5vxYUr9e-GY\n\nNice."
			},
			{
				title:"A dangerous place in SPAAAACE",
				slug:"a-dangerous-place-in-space",
				author:'pov',
				body:"This is message for @PoV. Are you here @PoV? I need @help.\n\n```js\n  var Muffin = 10;\n  Muffin += 2;\n\n  echo \"The Wheel\";```\n\nWhoa.\n\nAlso call @murr-DEATH-weasel."
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
				<NavBar />
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
						<SidebarSupport />
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

//				<DarkOverlay />
//						<SidebarTrending />

render(<Main />, document.body);
