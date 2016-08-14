import { h, render, Component }			from 'preact/preact';
import NavBar 							from 'com/nav-bar/code';
import DarkOverlay						from 'com/dark-overlay/code';
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
				<div id="footer">
				</div>
			</div>
		);
	}
};

//				<DarkOverlay />

render(<Main />, document.body);
