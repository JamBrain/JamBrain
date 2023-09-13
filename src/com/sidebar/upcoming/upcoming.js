import UIIcon			from 'com/ui/icon';
import ButtonLink		from 'com/button-link/link';

export default function SidebarUpcoming() {
	let Items = [
//		<div class="-item"><strong>Mar 24th</strong> - Theme Suggestions Open <UIIcon baseline small>suggestion</UIIconn></div>,
//		<div class="-item"><strong>Apr 7th</strong> - Theme Selection Starts <UIIcon baseline small>mallet</UIIcon></div>,
//		<div class="-item"><strong>Apr 21st</strong> - Ludum Dare 38 <UIIcon baseline small>trophy</UIIcon></div>,
//		<div class="-item"><strong>May 19th</strong> - Results <UIIcon baseline small>checker</UIIcon></div>,
//		<div class="-item"><strong>July 28th</strong> - Ludum Dare 39 <UIIcon baseline small>trophy</UIIcon></div>,
//		<div class="-item"><strong>August 23rd</strong> - Results <UIIcon baseline small>checker</UIIcon></div>,
//		<div class="-item"><strong>April 20th</strong> - Ludum Dare 41 <UIIcon baseline small>trophy</UIIcon></div>,
//		<div class="-item"><strong>December 28th</strong> - Results <UIIcon baseline small>checker</UIIcon></div>,
//		<div class="-item"><strong>November 30</strong> - Ludum Dare 43 <UIIcon baseline small>trophy</UIIcon></div>,
//		<div class="-item"><strong>April 26th-29th</strong> - Ludum Dare 44 <UIIcon baseline small>trophy</UIIcon></div>,
//		<div class="-item"><strong>October 4th-7th 2019</strong> - Ludum Dare 45 <UIIcon baseline small>trophy</UIIcon></div>,
//		<div class="-item"><strong>April 17-20th 2020</strong> - Ludum Dare 46 <UIIcon baseline small>trophy</UIIcon></div>,
//		<div class="-item"><strong>October 2nd-5th 2020</strong> - Ludum Dare 47 <UIIcon baseline small>trophy</UIIcon></div>,
//		<div class="-item"><strong>April 23rd-26th</strong> - Ludum Dare 48 <UIIcon baseline small>trophy</UIIcon></div>,
//		<div class="-item"><strong>October 1st-4th, 2021</strong> - Ludum Dare 49 <UIIcon baseline small>trophy</UIIcon></div>,
//		<div class="-item"><strong>April 1st-4th, 2022</strong> - Ludum Dare 50 <UIIcon baseline small>trophy</UIIcon></div>,
//		<div class="-item">The 20th anniversary of Ludum Dare!</div>,
//		<div class="-item">&nbsp;</div>,
//		<div class="-item"><strong>September 30th 2022</strong> - Ludum Dare 51 <SVGIcon baseline small>trophy</SVGIcon></div>,
//		<div class="-item"><strong>January 6th, 2023</strong> - Ludum Dare 52 <UIIcon baseline small>trophy</UIIcon></div>,
//		<div class="-item"><strong>April 28th, 2023</strong> - Ludum Dare 53 <UIIcon baseline small>trophy</UIIcon></div>,
		<div class="-item"><strong>September 29th, 2023</strong> - Ludum Dare 54 <UIIcon baseline small>trophy</UIIcon></div>,
	];

	return (
		<div class="sidebar-base sidebar-shortlist sidebar-upcoming">
			<div class="-title _font2"><UIIcon baseline>calendar-wide</UIIcon> <span class="-text">Coming Up</span></div>
			{Items}
		</div>
	);
}
//			<ButtonLink class="-footer" href="/cal">Full Schedule</ButtonLink>
