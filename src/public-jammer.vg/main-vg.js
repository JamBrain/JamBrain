import { h, render, Component }			from 'preact/preact';
import NavBar 							from 'com/nav-bar/bar';
import DarkOverlay						from 'com/dark-overlay/overlay';
import ContentPost						from 'com/content-post/post';

import SidebarCalendar					from 'com/sidebar-calendar/calendar';
import SidebarUpcoming					from 'com/sidebar-upcoming/upcoming';
import SidebarTV						from 'com/sidebar-tv/tv';
import SidebarTrending					from 'com/sidebar-trending/trending';

class Main extends Component {
	constructor() {
		this.state = {};
		this.state.posts = [ 
			"noof",
			"foof"
		];
	}
	
	componentDidMount() {
		// Startup //
	}
	
	render( props, state ) {
		return (
			<div id="layout">
				<NavBar />
				<div id="header" />
				<div id="content-sidebar">
					<div id="content">{
						state.posts.map(function(e) {
							return <ContentPost title={e} />;
						})
					}</div>
					<div id="sidebar">
						<SidebarCalendar />
						<SidebarUpcoming />
						<SidebarTV />
						<SidebarTrending />
					</div>
				</div>
				<div id="footer">
					<span>Test: </span><span class="_on-parent-hover-hide">Hello</span><span class="_on-parent-hover-show">World</span>
				</div>
			</div>
		);
	}
};

//				<DarkOverlay />

render(<Main />, document.body);
