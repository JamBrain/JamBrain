import './guides.less';
import '../base/base.less';

import {Link, Icon} from 'com/ui';

export default function SidebarGuides() {
	const links = {
		"Rules": {"href": "/events/ludum-dare/rules", "subtext": "for Ludum Dare events"},
		"Game Hosting Guide": {"icon": "star-empty", "href": "/events/ludum-dare/hosting-guide"},
		"E-mail Newsletter": {"icon": "news", "href": "https://newsletter.ldjam.com"},
		"YouTube": {"icon": "youtube", "href": "https://youtube.com/ludumdare"},
		"Twitch": {"icon": "twitch", "href": "https://twitch.tv/ludumdare"},
		"Twitter": {"icon": "twitter", "href": "https://twitter.com/ludumdare", "subtext": "breaking news"}
	};

	return <>
		<div class="sidebar-base sidebar-shortlist sidebar-guides">
			<div class="-title _font2">
				<Icon baseline src="article" />
				<span class="-text">Community & Guides</span>
			</div>
			{Object.keys(links).map(key => {
				const subtext = ` - ${links[key].subtext ?? ''}`;

				return <>
					<Link class="-item" href={links[key].href}>
						<Icon baseline gap>{links[key].icon != null ? links[key].icon : 'star-full'}</Icon>
						<span class="-title">{key}</span>{subtext}
					</Link>
				</>;
			})}
		</div>
	</>;
}
