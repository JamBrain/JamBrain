import { h, Component }					from 'preact/preact';

import SidebarCalendar					from 'com/sidebar-calendar/calendar';
import SidebarUpcoming					from 'com/sidebar-upcoming/upcoming';
import SidebarTV						from 'com/sidebar-tv/tv';
import SidebarTrending					from 'com/sidebar-trending/trending';
import SidebarSupport					from 'com/sidebar-support/support';
import SidebarCountdown					from 'com/sidebar-countdown/countdown';

export default class ViewSingle extends Component {
	constructor( props ) {
		super(props);
	}
	
	render( props, state ) {
		return (
			<div id="sidebar">
				<SidebarCountdown />
				<SidebarCalendar />
				<SidebarUpcoming />
				<SidebarTV />
				<SidebarSupport />
			</div>
		);
	}
};
