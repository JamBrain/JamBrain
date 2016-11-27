import { h, Component } from 'preact/preact';
import SVGIcon 			from 'com/svg-icon/icon';

export default class SidebarUpcoming extends Component {
	constructor() {
	}
	
	render( props, state ) {
		return (
			<div class="sidebar-base sidebar-shortlist sidebar-upcoming">
				<div class="-title _font2"><SVGIcon baseline>calendar-wide</SVGIcon> Coming Up</div>
				<div class="-item"><strong>Nov. 29th</strong> - Theme Slaughter</div>
				<div class="-item"><strong>Dec. 9th</strong> - Ludum Dare 37 <SVGIcon baseline small>trophy</SVGIcon></div>
				<div class="-footer" onclick={e => { console.log('full-schedlue'); window.location.hash = "#cal"; }}>Full Schedule</div>
			</div>
		);
	}
}

//				<div class="-item"><strong>Dec. 30th</strong> - Results</div>
