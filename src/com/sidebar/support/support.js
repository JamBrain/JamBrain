import { h, Component } from 'preact/preact';
import SVGIcon 			from 'com/svg-icon/icon';
import NavLink 			from 'com/nav-link/link';

export default class SidebarSupport extends Component {
	constructor() {
	}

	render( props, state ) {
		return (
			<div class="sidebar-base sidebar-shortlist sidebar-upcoming">
				<div class="-title _font2"><SVGIcon baseline>help</SVGIcon> <span class="-text">Support Us</span></div>
				<div class="-summary -gap"><strong>{window.location.host}</strong> is a game jam community run by Mike Kasprzak (<NavLink href="/users/pov">@pov</NavLink>). If you like it, please support Mike on <NavLink href="https://patreon.com/mikekasprzak"><SVGIcon baseline small gap>patreon</SVGIcon>Patreon</NavLink> or <NavLink href="https://www.paypal.me/mikekasprzak/0usd"><SVGIcon baseline small gap>paypal</SVGIcon>PayPal</NavLink>.</div>
				<div class="-summary -gap">Other inquiries, contact <NavLink href="/contact/"><SVGIcon baseline small gap>mail</SVGIcon>Mike</NavLink>.</div>
				<div class="-summary -gap">We're also open source! If you want to help with the code, it's available on <NavLink href="https://github.com/ludumdare/ludumdare"><SVGIcon baseline small gap>github</SVGIcon>GitHub</NavLink>.</div>
			</div>
		);
//				<div class="-summary -gap">If you want to help out, follow the @help group and answer questions. Mike may run the site, but it's powered by you!</div>
	}
}
