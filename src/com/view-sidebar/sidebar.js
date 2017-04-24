import { h, Component }					from 'preact/preact';

import SidebarCountdown					from 'com/sidebar-countdown/countdown';
import SidebarCalendar					from 'com/sidebar-calendar/calendar';
import SidebarUpcoming					from 'com/sidebar-upcoming/upcoming';
import SidebarTV						from 'com/sidebar-tv/tv';
import SidebarDummyTV					from 'com/sidebar-dummytv/dummytv';
import SidebarTrending					from 'com/sidebar-trending/trending';
import SidebarSponsor					from 'com/sidebar-sponsor/sponsor';
import SidebarSupport					from 'com/sidebar-support/support';

export default class ViewSidebar extends Component {
	constructor( props ) {
		super(props);
	}

	render( props, state ) {
		// TODO: cleanup
		let ldStartDate = new Date(Date.UTC(2017, 3, 22, 1, 0, 0));
		let jamEndDate = new Date(Date.UTC(2017, 3, 25, 1, 0, 0));
		let compoEndDate = new Date(Date.UTC(2017, 3, 24, 1, 0, 0));
		let compoEndDate2 = new Date(Date.UTC(2017, 3, 24, 2, 0, 0));

		let now = new Date();
		
		let ShowCountdown = [];
		if ( now < ldStartDate ) {
			ShowCountdown.push(<SidebarCountdown date={ ldStartDate } nc="ld" tt="Starts" />); /*to="Ludum Dare"*/
		}
		else {
			if ( now < compoEndDate ) {
				ShowCountdown.push(<SidebarCountdown date={ compoEndDate } nc="compo" to="Compo" tt="Ends" />);
			}
			else if ( now < compoEndDate2 ) {
				ShowCountdown.push(<SidebarCountdown date={ compoEndDate2 } nc="compo" to="Submission Hour" tt="Ends" />);
			}
			
			if ( now < jamEndDate ) {
				ShowCountdown.push(<SidebarCountdown date={ jamEndDate } nc="jam" to="Jam" tt="Ends" />);
			}
		}

		return (
			<div id="sidebar">
				{ShowCountdown}
				<SidebarCalendar rows={ShowCountdown.length ? 2 : 3} />
				<SidebarUpcoming />
				<SidebarTV />
				<SidebarDummyTV />
				<SidebarSponsor />
				<SidebarSupport />
			</div>
		);
	}
};
