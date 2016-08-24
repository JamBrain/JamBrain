import { h, Component } from 'preact/preact';
import SVGIcon 			from 'com/svg-icon/icon';

export default class SidebarUpcoming extends Component {
	constructor() {
	}
	
	render( props, state ) {
		return (
			<div class="sidebar-base sidebar-shortlist sidebar-upcoming">
				<div class="-title _font2"><SVGIcon baseline>calendar-wide</SVGIcon> Coming Up</div>
				<div class="-item"><strong>August 26th</strong> - Event Name <SVGIcon baseline small>trophy</SVGIcon></div>
				<div class="-item"><strong>September 4th</strong> - Event Name</div>
				<div class="-item"><strong>October 11th</strong> - Event Name</div>
				<div class="-footer">Full Schedule</div>
			</div>
		);
	}
}
