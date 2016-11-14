import { h, Component }					from 'preact/preact';

import ContentPost						from 'com/content-post/post';

import SidebarCalendar					from 'com/sidebar-calendar/calendar';
import SidebarUpcoming					from 'com/sidebar-upcoming/upcoming';
import SidebarTV						from 'com/sidebar-tv/tv';
import SidebarTrending					from 'com/sidebar-trending/trending';
import SidebarSupport					from 'com/sidebar-support/support';

import CoreData							from '../../core-data/data';

export default class ViewTimeline extends Component {
	constructor() {
		this.state = {};
		this.state.node = 1;
		this.state.feed = [10,11,12,13];
	}
	
	getNodes( props, state ) {
		CoreData.preFetchNodeWithAuthorById( state.feed );
		
		// TODO: create titles depending on type (mainly the root node should be just the domain) //
		document.title = titleParser.parse(CoreData.getNodeNameById(state.node), true) + " | " + window.location.host;
		
		return state.feed.map(function(node) {
			var node_type = CoreData.getNodeTypeById(node);
			
			if ( node_type === 'post' ) {
				return <ContentPost node={node} />;
			}
			else {
				return <div>null</div>;
			}
		});
	}
	
	render( props, state ) {
		// content-sidebar should be #body
		return (
			<div class="view-timeline">
				<div id="header" />
				<div id="content-sidebar">
					<div id="content">{ this.getNodes(props,state) }</div>
					<div id="sidebar">
						<SidebarCalendar />
						<SidebarUpcoming />
						<SidebarTV />
						<SidebarSupport />
					</div>
				</div>
				<div id="footer">Timeline</div>
			</div>
		);
	}
};
