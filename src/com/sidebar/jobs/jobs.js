import { h, Component } from 'preact/preact';
import SVGIcon 			from 'com/svg-icon/icon';
import NavLink 			from 'com/nav-link/link';

export default class SidebarJobs extends Component {
	constructor() {
	}

	render( props, state ) {
		return (
			<div class="sidebar-base sidebar-shortlist sidebar-upcoming">
				<div class="-title _font2"><SVGIcon baseline>jobs</SVGIcon> <span class="-text">We're Hiring!</span></div>
				<div class="-summary -gap">We are looking for a <NavLink href="https://ldjam.com/events/ludum-dare/48/$233336/ludum-dare-is-hiring-a-senior-developer-in-canada">Senior Developer in Canada</NavLink>.</div>
				<div class="-summary -gap"><NavLink href="https://ldjam.com/events/ludum-dare/48/$233336/ludum-dare-is-hiring-a-senior-developer-in-canada"><img style="display: block; margin: auto;" src="https://static.jam.vg/content/b/z/42c46.jpg.w240.jpg" /></NavLink></div>
			</div>
		);
	}
}
