import { Component } from 'preact';

import SidebarCountdown					from 'com/sidebar/countdown/countdown';
import SidebarCalendar					from 'com/sidebar/calendar/calendar';
import SidebarUpcoming					from 'com/sidebar/upcoming/upcoming';
import SidebarTV						from 'com/sidebar/tv/tv';
import SidebarJobs						from 'com/sidebar/jobs/jobs';
import SidebarTrending					from 'com/sidebar/trending/trending';
import SidebarSponsor					from 'com/sidebar/sponsor/sponsor';
import SidebarSupport					from 'com/sidebar/support/support';
import SidebarGuides					from 'com/sidebar/guides/guides';

export default class ViewSidebar extends Component {
	constructor( props ) {
		super(props);
	}

	render( props ) {
		// TODO: cleanup

		const oneSecond = 1000;
		const oneMinute = 60*oneSecond;
		const oneHour = 60*oneMinute;
		const oneDay = 24*oneHour;
		const oneWeek = 7*oneDay;

		/*
		// January Event //
		let ldName = "Ludum Dare 52";
		let ldStartDate = new Date(Date.UTC(2023, 0, 6, 20, 0, 0));

		let compoEndDate = new Date(Date.UTC(2023, 0, 8, 20, 0, 0));
		let compoEndDate2 = new Date(Date.UTC(2023, 0, 8, 21, 0, 0));

		let jamEndDate = new Date(Date.UTC(2023, 0, 9, 20, 0, 0));
		let jamEndDate2 = new Date(Date.UTC(2023, 0, 9, 21, 0, 0));

		let gradeEndDate = new Date(Date.UTC(2023, 0, 27, 20, 0, 0));
		let resultsDate = new Date(Date.UTC(2023, 0, 28, 23, 5, 0));

		let liveShowDate = new Date(Date.UTC(2023, 0, 28, 20, 30, 0, 0));

		let nextEventName = "Ludum Dare 53";
		let nextEventStartDate = new Date(Date.UTC(2023, 3, 29, 1, 0, 0));

		/*/

		// April Event //
		let ldName = "Ludum Dare 53";
		let ldStartDay = new Date(Date.UTC(2023, 3, 28, 0, 0, 0));					// NOTE: The day, not the date
		let ldStartDate = new Date(ldStartDay.getTime() + ((24+1) * oneHour));		// 9 PM EST

		let compoEndDate = new Date(ldStartDate.getTime() + (2 * oneDay));
		let compoEndDate2 = new Date(compoEndDate.getTime() + oneHour);

		let jamEndDate = new Date(ldStartDate.getTime() + (3 * oneDay));
		let jamEndDate2 = new Date(jamEndDate.getTime() + oneHour);

		let gradeEndDate = new Date(ldStartDate.getTime() + (3 * oneWeek));

		let resultsDay = new Date(ldStartDay.getTime() + (3*oneWeek) + oneDay);		// NOTE: again "day", not date
		let liveShowDate = new Date(resultsDay.getTime() + (17 * oneHour) + (30 * oneMinute));
		let resultsDate = new Date(resultsDay.getTime() + (20 * oneHour) + (5 * oneMinute));

		let nextEventName = "Ludum Dare 54";
		let nextEventStartDate = new Date(Date.UTC(2023, 8, 29, 22, 0, 0));

		/*/
		// October Event//
		let ldName = "Ludum Dare 54";
		let ldStartDate = new Date(Date.UTC(2023, 7, 29, 1, 0, 0));

		let compoEndDate = new Date(Date.UTC(2022, 8, 32, 22, 0, 0));
		let compoEndDate2 = new Date(Date.UTC(2022, 8, 32, 23, 0, 0));

		let jamEndDate = new Date(Date.UTC(2022, 8, 33, 22, 0, 0));
		let jamEndDate2 = new Date(Date.UTC(2022, 8, 33, 23, 0, 0));

		let gradeEndDate = new Date(Date.UTC(2022, 9, 21, 22, 0, 0));
		let resultsDate = new Date(Date.UTC(2022, 9, 22, 19, 5, 0));

		let liveShowDate = new Date(Date.UTC(2022, 9, 22, 16, 30, 0));

		let nextEventName = "Ludum Dare 54";
		let nextEventStartDate = new Date(Date.UTC(2023, 0, 6, 20, 0, 0));
		/*/

		let ItemsToShow = 2;

		let now = new Date();

		let ShowCountdown = [];
		if ( !props.featured ) {
			// Featured event hasn't loaded yet
		}
		// If before the start
		else if ( now < ldStartDate ) {
			ShowCountdown.push(<SidebarCountdown date={ ldStartDate } nc="ld" to={ldName} tt="Starts" />);
		}
		// If after the start
		else {
			if ( (now < compoEndDate) && (ShowCountdown.length < ItemsToShow) ) {
				ShowCountdown.push(<SidebarCountdown date={ compoEndDate } nc="compo" to="Compo" tt="Ends" />);
			}
			else if ( (now < compoEndDate2) && (ShowCountdown.length < ItemsToShow) ) {
				ShowCountdown.push(<SidebarCountdown date={ compoEndDate2 } nc="compo" to="Submission Hour" tt="Ends" />);
			}

			if ( (now < jamEndDate) && (ShowCountdown.length < ItemsToShow) ) {
				ShowCountdown.push(<SidebarCountdown date={ jamEndDate } nc="jam" to="Jam" tt="Ends" />);
			}
			else if ( (now < jamEndDate2) && (ShowCountdown.length < ItemsToShow) ) {
				//ShowCountdown.push(<SidebarCountdown date={ jamEndDate2 } nc="jam" to="Submission Hour+" tt="Ends" />);
				ShowCountdown.push(<SidebarCountdown date={ jamEndDate2 } nc="jam" to="Submission Hour" tt="Ends" />);
			}

			if ( (now < gradeEndDate) && props.featured && props.featured.meta && props.featured.meta['can-grade'] && (ShowCountdown.length < ItemsToShow) ) { //now < compoEndDate2 || now < jamEndDate2 || now < gradeEndDate ) {
				ShowCountdown.push(<SidebarCountdown date={ gradeEndDate } nc="jam" to="Rating games" tt="Ends" />);
			}

			// Figure out the date a few days before grading ends
			let finaleStart = new Date(gradeEndDate);
			finaleStart.setUTCHours(finaleStart.getUTCHours()-(24*3));

			// Only show a few days before grading ends
			if ( (now > finaleStart) && (now < resultsDate) ) {
				// If we have a live show, include a countdown for that
				if ( liveShowDate ) {
					if ( (now < liveShowDate) && (ShowCountdown.length < ItemsToShow) ) {
						ShowCountdown.push(<SidebarCountdown date={ liveShowDate } nc="jam" to="Top 15 Results:" tt="LIVE" />);
					}
					if ( (now < resultsDate) && (ShowCountdown.length < ItemsToShow) ) {
						ShowCountdown.push(<SidebarCountdown date={ resultsDate } nc="jam" to="All Results" tt="" />);
					}
				}
				else {
					if ( (now < resultsDate) && (ShowCountdown.length < ItemsToShow) ) {
						ShowCountdown.push(<SidebarCountdown date={ resultsDate } nc="jam" to="Results" tt="" />);
					}
				}
			}

			// If no items left, add a countdown to the next event
			if ( nextEventName && nextEventStartDate && (now < nextEventStartDate) && (ShowCountdown.length == 0) ) {
				ShowCountdown.push(<SidebarCountdown date={ nextEventStartDate } nc="ld" to={nextEventName} tt="Starts" />);
			}
		}

		return (
			<aside id="sidebar">
				{ShowCountdown}
				<SidebarTV />
				<SidebarUpcoming />
				<SidebarSponsor />
			</aside>
		);

		/*<SidebarJobs />*/

		/*<SidebarGuides />*/
		/*<SidebarSupport />*/

		/*<SidebarCalendar rows={ShowCountdown.length ? 2 : 3} />*/
	}
}
