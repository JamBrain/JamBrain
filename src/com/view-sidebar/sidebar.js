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

		let jamEndDate = new Date(Date.UTC(2016, 11, 13, 2, 0, 0));
		let compoEndDate = new Date(Date.UTC(2016, 11, 12, 2, 0, 0));
		let ldStartDate = new Date(Date.UTC(2016, 11, 10, 2, 0, 0));

		let n = new Date();

		if(n > ldStartDate) {
			return (
				<div id="sidebar">
					<SidebarCountdown date={ ldStartDate } nc="ld" to="LudumDare" tt="Starts" />
					<SidebarCalendar />
					<SidebarUpcoming />
					<SidebarTV />
					<SidebarSupport />
				</div>
			);
		} else {
			return (
				<div id="sidebar">
					<SidebarCountdown date={ compoEndDate } nc="compo" to="Compo" tt="Ends" />
					<SidebarCountdown date={ jamEndDate } nc="jam" to="Jam" tt="Ends" />
					<SidebarCalendar />
					<SidebarUpcoming />
					<SidebarTV />
					<SidebarSupport />
				</div>
			);
		}
	}
};
