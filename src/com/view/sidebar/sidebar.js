import {h, Component}					from 'preact/preact';

import SidebarCountdown					from 'com/sidebar/countdown/countdown';
import SidebarCalendar					from 'com/sidebar/calendar/calendar';
import SidebarUpcoming					from 'com/sidebar/upcoming/upcoming';
import SidebarTV						from 'com/sidebar/tv/tv';
import SidebarTrending					from 'com/sidebar/trending/trending';
import SidebarSponsor					from 'com/sidebar/sponsor/sponsor';
import SidebarSupport					from 'com/sidebar/support/support';

export default class ViewSidebar extends Component {
	constructor( props ) {
		super(props);
	}

	render( props ) {
		// TODO: cleanup
		let ldStartDate = new Date(Date.UTC(2017, 11, 2, 2, 0, 0));

		let compoEndDate = new Date(Date.UTC(2017, 11, 4, 2, 0, 0));
		let compoEndDate2 = new Date(Date.UTC(2017, 11, 4, 3, 0, 0));

		let jamEndDate = new Date(Date.UTC(2017, 11, 5, 2, 0, 0));
		let jamEndDate2 = new Date(Date.UTC(2017, 11, 5, 3, 0, 0));

		let gradeEndDate = new Date(Date.UTC(2017, 11, 27, 16, 0, 0));
		let resultsDate = new Date(Date.UTC(2017, 11, 29, 16, 0, 0));

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
			else if ( now < jamEndDate2 ) {
				ShowCountdown.push(<SidebarCountdown date={ jamEndDate2 } nc="jam" to="Submission Hour+" tt="Ends" />);
			}

			if ( props.featured && props.featured.meta && props.featured.meta['can-grade'] ) { //now < compoEndDate2 || now < jamEndDate2 || now < gradeEndDate ) {
				ShowCountdown.push(<SidebarCountdown date={ gradeEndDate } nc="jam" to="Play+Rate games" tt="Ends" />);
			}

//			// TODO: make this only appear a few hours before grading ends
//			if ( now < resultsDate ) {
//				ShowCountdown.push(<SidebarCountdown date={ resultsDate } nc="jam" to="Results" tt="live" />);
//			}
		}

		return (
			<div id="sidebar">
				{ShowCountdown}
				<SidebarCalendar rows={ShowCountdown.length ? 2 : 3} />
				<SidebarUpcoming />
				<SidebarTV />
				<SidebarSponsor />
				<SidebarSupport />
			</div>
		);
	}
}
