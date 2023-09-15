import '../base/base.less';

import {UIIcon} from 'com/ui';
import NavLink 			from 'com/nav-link/link';

export default function SidebarSupport() {
	return (
		<div class="sidebar-base sidebar-shortlist sidebar-upcoming">
			<div class="-title _font2"><UIIcon baseline>help</UIIcon> <span class="-text">Support Us</span></div>
			<div class="-summary -gap"><strong>{window.location.host}</strong> is a game jam community run by Mike Kasprzak (<NavLink href="/users/pov">@pov</NavLink>). If you like it, please support Mike on <NavLink href="https://patreon.com/mikekasprzak"><UIIcon baseline small gap>patreon</UIIcon>Patreon</NavLink> or <NavLink href="https://www.paypal.me/mikekasprzak/0usd"><UIIcon baseline small gap>paypal</UIIcon>PayPal</NavLink>.</div>
			<div class="-summary -gap">Other inquiries, contact <NavLink href="/contact/"><UIIcon baseline small gap>mail</UIIcon>Mike</NavLink>.</div>
			<div class="-summary -gap">We're also open source! If you want to help with the code, it's available on <NavLink href="https://github.com/ludumdare/ludumdare"><UIIcon baseline small gap>github</UIIcon>GitHub</NavLink>.</div>
		</div>
	);
}
