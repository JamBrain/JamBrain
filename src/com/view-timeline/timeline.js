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
		this.state.feed = [10,11,12,13];
	}
	
	getItems( props, state ) {
		CoreData.preFetchItemWithAuthorById( state.feed );
		
		return state.feed.map(function(item) {
			var item_type = CoreData.getItemTypeById(item);
			
			if ( item_type === 'post' ) {
				return <ContentPost item={item} />;
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
					<div id="content">{ this.getItems(props,state) }</div>
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
