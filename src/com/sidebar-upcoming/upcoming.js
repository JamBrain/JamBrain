import { h, Component } from 'preact/preact';
import SVGIcon 			from 'com/svg-icon/icon';
import ButtonLink		from 'com/button-link/link';

export default class SidebarUpcoming extends Component {
	constructor() {
	}
	
	render( props, state ) {
		return (
			<div class="sidebar-base sidebar-shortlist sidebar-upcoming">
				<div class="-title _font2"><SVGIcon baseline>calendar-wide</SVGIcon> <span class="-text">Coming Up</span></div>
				<div class="-item"><strong>Dec. 9th</strong> - Ludum Dare 37 <SVGIcon baseline small>trophy</SVGIcon></div>
				<div class="-item"><strong>Dec. 16th</strong> - Judging (Tentative) Start</div>
				<ButtonLink class="-footer" href="/cal">Full Schedule</ButtonLink>
			</div>
		);
	}
}

//				<div class="-item"><strong>Dec. 30th</strong> - Results</div>
