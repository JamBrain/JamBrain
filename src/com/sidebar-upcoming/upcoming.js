import { h, Component } from 'preact/preact';
import SVGIcon 			from 'com/svg-icon/icon';
import ButtonLink		from 'com/button-link/link';

export default class SidebarUpcoming extends Component {
	constructor( props ) {
		super(props);
	}

	render( {}, {} ) {
		var Items = [
//			<div class="-item"><strong>Mar 24th</strong> - Theme Suggestions Open <SVGIcon baseline small>suggestion</SVGIcon></div>,
//			<div class="-item"><strong>Apr 7th</strong> - Theme Selection Starts <SVGIcon baseline small>mallet</SVGIcon></div>,
//			<div class="-item"><strong>Apr 21st</strong> - Ludum Dare 38 <SVGIcon baseline small>trophy</SVGIcon></div>,
//			<div class="-item"><strong>May 19th</strong> - Results <SVGIcon baseline small>checker</SVGIcon></div>,
//			<div class="-item"><strong>July 28th</strong> - Ludum Dare 39 <SVGIcon baseline small>trophy</SVGIcon></div>,
//			<div class="-item"><strong>August 23rd</strong> - Results <SVGIcon baseline small>checker</SVGIcon></div>,
			<div class="-item"><strong>December 1st</strong> - Ludum Dare 40 <SVGIcon baseline small>trophy</SVGIcon></div>,
			<div class="-item"><strong>December 29th</strong> - Results <SVGIcon baseline small>checker</SVGIcon></div>,
//			<div class="-item"><strong>December 1st</strong> - Ludum Dare 40 <SVGIcon baseline small>trophy</SVGIcon></div>,	// Spoilers
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
