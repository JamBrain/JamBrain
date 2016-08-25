import { h, Component }					from 'preact/preact';

import ContentPost						from 'com/content-post/post';

import SidebarCalendar					from 'com/sidebar-calendar/calendar';
import SidebarUpcoming					from 'com/sidebar-upcoming/upcoming';
import SidebarTV						from 'com/sidebar-tv/tv';
import SidebarTrending					from 'com/sidebar-trending/trending';
import SidebarSupport					from 'com/sidebar-support/support';


export default class ViewTimeline extends Component {
	constructor() {
		this.state = {};
		this.state.feed = [1,2,3];
	}
	
	render( props, state ) {
		//let hasHash = window.location.hash ? <div>{window.location.hash}</div> : <div />;
		
		// content-sidebar should be #body
		return (
			<div class="view-timeline">
				<div id="header" />
				<div id="content-sidebar">
					<div id="content">{
						props.posts.map(function(item) {
							return <ContentPost {...item} user={props.users[item.author]} />;
						})
//						state.feed.map(function(item) {
//							// Lookup Item Type, create appropriate Content Type //
//							return <ContentPost item={item} />;
//						})
					}</div>
					<div id="sidebar">
						<SidebarCalendar />
						<SidebarUpcoming />
						<SidebarTV />
						<SidebarSupport />
					</div>
				</div>
				<div id="footer" />
			</div>
		);
	}
};
