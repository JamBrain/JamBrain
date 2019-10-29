import {h, Component}					from 'preact/preact';
import SVGIcon							from 'com/svg-icon/icon';
import ButtonLink						from 'com/button-link/link';

export default class SidebarUpcoming extends Component {
	constructor( props ) {
		super(props);
	}

	render( props ) {
		var Items = [
//			<div class="-item"><strong>Mar 24th</strong> - Theme Suggestions Open <SVGIcon baseline small>suggestion</SVGIcon></div>,
//			<div class="-item"><strong>Apr 7th</strong> - Theme Selection Starts <SVGIcon baseline small>mallet</SVGIcon></div>,
//			<div class="-item"><strong>Apr 21st</strong> - Ludum Dare 38 <SVGIcon baseline small>trophy</SVGIcon></div>,
//			<div class="-item"><strong>May 19th</strong> - Results <SVGIcon baseline small>checker</SVGIcon></div>,
//			<div class="-item"><strong>July 28th</strong> - Ludum Dare 39 <SVGIcon baseline small>trophy</SVGIcon></div>,
//			<div class="-item"><strong>August 23rd</strong> - Results <SVGIcon baseline small>checker</SVGIcon></div>,
//			<div class="-item"><strong>April 20th</strong> - Ludum Dare 41 <SVGIcon baseline small>trophy</SVGIcon></div>,
//			<div class="-item"><strong>December 28th</strong> - Results <SVGIcon baseline small>checker</SVGIcon></div>,
//			<div class="-item"><strong>November 30</strong> - Ludum Dare 43 <SVGIcon baseline small>trophy</SVGIcon></div>,
//			<div class="-item"><strong>April 26th-29th</strong> - Ludum Dare 44 <SVGIcon baseline small>trophy</SVGIcon></div>,
//			<div class="-item"><strong>October 4th-7th 2019</strong> - Ludum Dare 45 <SVGIcon baseline small>trophy</SVGIcon></div>,
			<div class="-item"><strong>April 17-20th 2020</strong> - Ludum Dare 46 <SVGIcon baseline small>trophy</SVGIcon></div>,
			<div class="-item"><strong>October 2020</strong> - Ludum Dare 47 <SVGIcon baseline small>trophy</SVGIcon></div>,
			<div class="-item"><strong>April 2021</strong> - Ludum Dare 48 <SVGIcon baseline small>trophy</SVGIcon></div>,
		];

		return (
			<div class="sidebar-base sidebar-shortlist sidebar-upcoming">
				<div class="-title _font2"><SVGIcon baseline>calendar-wide</SVGIcon> <span class="-text">Coming Up</span></div>
				{Items}
			</div>
		);
	}
}
//				<ButtonLink class="-footer" href="/cal">Full Schedule</ButtonLink>
