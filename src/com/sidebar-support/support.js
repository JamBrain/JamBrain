import { h, Component } from 'preact/preact';
import SVGIcon 			from 'com/svg-icon/icon';
import NavLink 			from 'com/nav-link/link';

export default class SidebarSupport extends Component {
	constructor() {
	}
	
	render( props, state ) {
		return (
			<div class="sidebar-base sidebar-shortlist sidebar-upcoming">
				<div class="-title _font2"><SVGIcon baseline>help</SVGIcon> Support Us!</div>
				<div class="-summary -gap"><strong>{window.location.host}</strong> is a free, open source service run by Mike Kasprzak (@pov). If you like it, please support Mike on <NavLink href="https://patreon.com/mikekasprzak"><SVGIcon baseline small gap>patreon</SVGIcon>Patreon</NavLink> or <NavLink href="https://www.paypal.me/mikekasprzak/0usd"><SVGIcon baseline small gap>paypal</SVGIcon>PayPal</NavLink>. For other inquiries <NavLink href="/contact/"><SVGIcon baseline small gap>mail</SVGIcon>Contact Mike</NavLink>.</div>
				<div class="-summary -gap">If you want to help with the code, the Source Code is available on <NavLink href="https://github.com/ludumdare/ludumdare"><SVGIcon baseline small gap>github</SVGIcon>GitHub</NavLink>.</div>
				<div class="-summary -gap">If you want help out, follow the @help group and answer questions. Mike may run the site, but it's powered by you!</div>
				<div class="-summary">If you <strong>need help</strong>, see the <NavLink href="/faq/"><SVGIcon baseline small gap>question</SVGIcon>Frequently Asked Questions</NavLink>. If that doesn't help, <NavLink href="#post/question"><SVGIcon baseline small gap>edit</SVGIcon>Post a Question</NavLink>, or mention @help in a comment.</div>
			</div>
		);
	}
}
