import { h, Component }					from 'preact/preact';

import SidebarCalendar					from 'com/sidebar-calendar/calendar';
import SidebarUpcoming					from 'com/sidebar-upcoming/upcoming';
import SidebarTV						from 'com/sidebar-tv/tv';
import SidebarTrending					from 'com/sidebar-trending/trending';
import SidebarSupport					from 'com/sidebar-support/support';
import SidebarCountdown					from 'com/sidebar-countdown/countdown';

export default class ViewSidebar extends Component {
	constructor( props ) {
		super(props);
	}

	render( props, state ) {
		// TODO: cleanup
		let jamEndDate = new Date(Date.UTC(2016, 11, 13, 2, 0, 0));
		let compoEndDate = new Date(Date.UTC(2016, 11, 12, 2, 0, 0));
		let ldStartDate = new Date(Date.UTC(2016, 11, 10, 2, 0, 0));

		let now = new Date();
		
		let ShowCountdown = [];
		if ( now < ldStartDate ) {
			ShowCountdown.push(<SidebarCountdown date={ ldStartDate } nc="ld" to="Ludum Dare" tt="Starts" />);
		}
		else {
			if ( now < compoEndDate ) {
				ShowCountdown.push(<SidebarCountdown date={ compoEndDate } nc="compo" to="Compo" tt="Ends" />);
			};
			if ( now < compoEndDate ) {
				ShowCountdown.push(<SidebarCountdown date={ jamEndDate } nc="jam" to="Jam" tt="Ends" />);
			}
		}

		return (
			<div id="sidebar">
				{ShowCountdown}
				<SidebarCalendar rows={ShowCountdown.length ? 2 : 3} />
				<SidebarUpcoming />
				<SidebarTV />
				<SidebarSupport />
			</div>
		);
	}
};
