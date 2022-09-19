import {h, Component}	from 'preact';
import UIIcon			from 'com/ui/icon';
import NavLink			from 'com/nav-link/link';

export default class SidebarGuides extends Component {
	constructor(props) {
		super(props);
	}

	render(props, state) {
		var Links = {
			"Rules": {"href": "/events/ludum-dare/rules", "subtext": "for Ludum Dare events"},
			"Game Hosting Guide": {"icon": "star-empty", "href": "/events/ludum-dare/hosting-guide"},
			"E-mail Newsletter": {"icon": "news", "href": "https://newsletter.ldjam.com"},
			"YouTube": {"icon": "youtube", "href": "https://youtube.com/ludumdare"},
			"Twitch": {"icon": "twitch", "href": "https://twitch.tv/ludumdare"},
			"Twitter": {"icon": "twitter", "href": "https://twitter.com/ludumdare", "subtext": "breaking news"}
		};

		return (
			<div class="sidebar-base sidebar-shortlist sidebar-guides">
				<div class="-title _font2">
					<UIIcon baseline>article</UIIcon> <span class="-text">Community & Guides</span>
				</div>
				{Object.keys(Links).map(key => {
					let subtext = "";
					if (Links[key].subtext) {
						subtext = " - " + Links[key].subtext;
					}

					return (
						<NavLink class="-item" href={Links[key].href}>
							<UIIcon baseline gap>{Links[key].icon != null ? Links[key].icon : 'star-full'}</UIIcon>
							<span class="-title">{key}</span>{subtext}
						</NavLink>
					);
				})}
			</div>
		);
	}
}
