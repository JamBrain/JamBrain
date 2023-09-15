import '../base/base.less';

import {Icon} from 'com/ui';
import NavLink 			from 'com/nav-link/link';

export default function SidebarSupport() {
	return (
		<div class="sidebar-base sidebar-shortlist sidebar-upcoming">
			<div class="-title _font2"><Icon baseline>help</Icon> <span class="-text">Support Us</span></div>
			<div class="-summary -gap"><strong>{window.location.host}</strong> is a game jam community run by Mike Kasprzak (<NavLink href="/users/pov">@pov</NavLink>). If you like it, please support Mike on <NavLink href="https://patreon.com/mikekasprzak"><Icon baseline small gap>patreon</Icon>Patreon</NavLink> or <NavLink href="https://www.paypal.me/mikekasprzak/0usd"><Icon baseline small gap>paypal</Icon>PayPal</NavLink>.</div>
			<div class="-summary -gap">Other inquiries, contact <NavLink href="/contact/"><Icon baseline small gap>mail</Icon>Mike</NavLink>.</div>
			<div class="-summary -gap">We're also open source! If you want to help with the code, it's available on <NavLink href="https://github.com/ludumdare/ludumdare"><Icon baseline small gap>github</Icon>GitHub</NavLink>.</div>
		</div>
	);
}
