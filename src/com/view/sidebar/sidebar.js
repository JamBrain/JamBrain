import {h, Component}					from 'preact/preact';

import SidebarCountdown					from 'com/sidebar/countdown/countdown';
import SidebarCalendar					from 'com/sidebar/calendar/calendar';
import SidebarUpcoming					from 'com/sidebar/upcoming/upcoming';
import SidebarTV						from 'com/sidebar/tv/tv';
import SidebarTrending					from 'com/sidebar/trending/trending';
import SidebarSponsor					from 'com/sidebar/sponsor/sponsor';
import SidebarSupport					from 'com/sidebar/support/support';

import $Calendar from 'shrub/js/calendar/calendar';

export default class ViewSidebar extends Component {
	constructor( props ) {
		super(props);
		this.state = {};
	}

	componentDidMount() {
		$Calendar.GetEvent()
			.then(r => {
				if (r.status === 200) {
					this.setState({'calendar': r.calendar});
				}
			});
	}

	render( props, state ) {
		let ldStartDate;
		let compoEndDate;
		let compoEndDate2;
		let jamEndDate;
		let jamEndDate2;
		let gradeEndDate;
		let resultsDate;
		let ldName;
		const {calendar} = state;
		if (calendar) {
			ldStartDate = calendar['event-start'];
			compoEndDate = calendar['event-compo-end'];
			compoEndDate2 = calendar['event-compo-end-submission'];
			jamEndDate = calendar['event-jam-end'];
			jamEndDate2 = calendar['event-jam-end-submission'];
			gradeEndDate = calendar['event-grade-end'];
			resultsDate = calendar['event-results-publish'];
			ldName = calendar.name;
		}
		let now = new Date();

		let ShowCountdown = [];
		if (ldStartDate && now < ldStartDate ) {
			ShowCountdown.push(<SidebarCountdown date={ ldStartDate } nc="ld" to={ldName} tt="Starts" />);
		}
		else {
			if ( compoEndDate && (now < compoEndDate) && (ShowCountdown.length < 2) ) {
				ShowCountdown.push(<SidebarCountdown date={ compoEndDate } nc="compo" to="Compo" tt="Ends" />);
			}
			else if ( compoEndDate2 && (now < compoEndDate2) && (ShowCountdown.length < 2) ) {
				ShowCountdown.push(<SidebarCountdown date={ compoEndDate2 } nc="compo" to="Submission Hour" tt="Ends" />);
			}

			if ( jamEndDate && (now < jamEndDate) && (ShowCountdown.length < 2) ) {
				ShowCountdown.push(<SidebarCountdown date={ jamEndDate } nc="jam" to="Jam" tt="Ends" />);
			}
			else if ( jamEndDate2 && (now < jamEndDate2) && (ShowCountdown.length < 2) ) {
				//ShowCountdown.push(<SidebarCountdown date={ jamEndDate2 } nc="jam" to="Submission Hour+" tt="Ends" />);
				ShowCountdown.push(<SidebarCountdown date={ jamEndDate2 } nc="jam" to="Submission Day*" tt="Ends" />);
			}

			if ( gradeEndDate && (now < gradeEndDate) && props.featured && props.featured.meta && props.featured.meta['can-grade'] && (ShowCountdown.length < 2) ) { //now < compoEndDate2 || now < jamEndDate2 || now < gradeEndDate ) {
				ShowCountdown.push(<SidebarCountdown date={ gradeEndDate } nc="jam" to="Play+Rate games" tt="Ends" />);
			}

			// TODO: make this only appear a few hours before grading ends
			if ( resultsDate && (now < resultsDate) && (ShowCountdown.length < 2) ) {
				ShowCountdown.push(<SidebarCountdown date={ resultsDate } nc="jam" to="Results" tt="" />);
			}
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
