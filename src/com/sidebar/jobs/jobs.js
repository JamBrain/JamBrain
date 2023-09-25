import '../base/base.less';

import {Link, Icon} from 'com/ui';

export default function SidebarJobs() {
	return <>
		<div class="side-item sidebar-shortlist sidebar-upcoming">
			<div class="-title _font2"><Icon class="-baseline" src="jobs" /> <span class="-text">We're Hiring!</span></div>
			<div class="-summary -gap">We are looking for a <Link href="https://ldjam.com/events/ludum-dare/48/$233336/ludum-dare-is-hiring-a-senior-developer-in-canada">Senior Developer in Canada</Link>.</div>
			<div class="-summary -gap"><Link href="https://ldjam.com/events/ludum-dare/48/$233336/ludum-dare-is-hiring-a-senior-developer-in-canada"><img style="display: block; margin: auto;" src="https://static.jam.vg/content/b/z/42c46.jpg.w240.jpg" /></Link></div>
		</div>
	</>;
}
