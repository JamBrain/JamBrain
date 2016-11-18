import { h, Component }					from 'preact/preact';

import SidebarCalendar					from 'com/sidebar-calendar/calendar';
import SidebarUpcoming					from 'com/sidebar-upcoming/upcoming';
import SidebarTV						from 'com/sidebar-tv/tv';
import SidebarTrending					from 'com/sidebar-trending/trending';
import SidebarSupport					from 'com/sidebar-support/support';

//import CoreData							from '../../core-data/data';

export default class ViewSingle extends Component {
	constructor() {
		this.state = {};
	}
	
//	getNodes( props, state ) {
//		var nodes = [props.node];
//		
//		CoreData.preFetchNodeWithAuthorById( nodes );
//		
//		return nodes.map(function(node) {
//			var node_type = CoreData.getNodeTypeById(node);
//			
//			document.title = titleParser.parse(CoreData.getNodeNameById(node), true) + " | " + window.location.host;
//			
//			if ( node_type === 'post' || node_type === 'game' ) {
//				return <ContentPost node={node} />;
//			}
//			if ( node_type === 'user' ) {
//				return <ContentUser node={node} />;
//			}
//			else {
//				return <div>null</div>;
//			}
//		});
//	}
	
	render( props ) {
		return (
			<div id="sidebar">
				<SidebarCalendar />
				<SidebarUpcoming />
				<SidebarTV />
				<SidebarSupport />
			</div>
		);
	}
};
