import { h, Component }					from 'preact/preact';

import ContentPost						from 'com/content-post/post';
import ContentUser						from 'com/content-user/user';

import SidebarCalendar					from 'com/sidebar-calendar/calendar';
import SidebarUpcoming					from 'com/sidebar-upcoming/upcoming';
import SidebarTV						from 'com/sidebar-tv/tv';
import SidebarTrending					from 'com/sidebar-trending/trending';
import SidebarSupport					from 'com/sidebar-support/support';

import CoreData							from '../../core-data/data';

export default class ViewSingle extends Component {
	constructor() {
		this.state = {};
		this.state.feed = [];
	}
	
	getItems( props, state ) {
		var items = [props.item];
		
		CoreData.preFetchItemWithAuthorById( items );
		
		return items.map(function(item) {
			var item_type = CoreData.getItemTypeById(item);
			
			if ( item_type === 'post' || item_type === 'game' ) {
				return <ContentPost item={item} />;
			}
			if ( item_type === 'user' ) {
				return <ContentUser item={item} />;
			}
			else {
				return <div>null</div>;
			}
		});
	}
	
	render( props, state ) {
		
		// content-sidebar should be #body
		return (
			<div class="view-single">
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
				<div id="footer">Single</div>
			</div>
		);
	}
};
