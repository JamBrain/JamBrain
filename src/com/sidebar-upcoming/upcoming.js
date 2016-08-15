import { h, Component } from 'preact/preact';
import CoreButton		from 'com/core-button/button';
import SVGIcon 			from 'com/svg-icon/icon';

export default class SidebarUpcoming extends Component {
	constructor() {
	}
	
	render( props, state ) {
		return (
			<div class="sidebar-upcoming sidebar-shortlist">
				<div class="-title _font2"><SVGIcon name="calendar" /> Coming Up</div>
				<div class="-item"><strong>August 26th</strong> - Event Name <SVGIcon name="trophy" /></div>
				<div class="-item"><strong>September 4th</strong> - Event Name</div>
				<div class="-item"><strong>October 11th</strong> - Event Name</div>
				<div class="-footer">Full Schedule</div>
			</div>
		);
	}
}
