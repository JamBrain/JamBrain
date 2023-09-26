import '../base/base.less';

import {Link, Icon} from 'com/ui';

export default function SidebarSupport() {
	return <>
		<div class="side-item sidebar-shortlist sidebar-upcoming">
			<div class="-title _font2"><Icon class="-baseline" src="help" /> <span class="-text">Support Us</span></div>
			<div class="-summary -gap">
				<strong>{window.location.host}</strong> is a game jam community run by Mike Kasprzak (<Link href="/users/pov">@pov</Link>). If you like it, please support Mike on <Link href="https://patreon.com/mikekasprzak"><Icon class="-baseline -small -gap" src="patreon" />Patreon</Link> or <Link href="https://www.paypal.me/mikekasprzak/0usd"><Icon class="-baseline -small -gap" src="paypal" />PayPal</Link>.
			</div>
			<div class="-summary -gap">Other inquiries, contact <Link href="/contact/"><Icon class="-baseline -small -gap" src="mail" />Mike</Link>.</div>
			<div class="-summary -gap">We're also open source! If you want to help with the code, it's available on <Link href="https://github.com/ludumdare/ludumdare"><Icon class="-baseline -small -gap" src="github" />GitHub</Link>.</div>
		</div>
	</>;
}
