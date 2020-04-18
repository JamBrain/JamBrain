import {h, Component}	from 'preact/preact';
import SVGIcon			from 'com/svg-icon/icon';
import NavLink			from 'com/nav-link/link';

export default class SidebarGuides extends Component {
	constructor(props) {
		super(props);
	}

	render(props, state) {
		var Links = {
			"Rules": {"href": "/events/ludum-dare/rules", "subtext": "for Ludum Dare events"},
			"Game Hosting Guide": {"icon": "star-empty", "href": "/events/ludum-dare/hosting-guide"}
		};

		return (
			<div class="sidebar-base sidebar-shortlist sidebar-guides">
				<div class="-title _font2">
					<SVGIcon baseline>article</SVGIcon> <span class="-text">Guides</span>
				</div>
				{Object.keys(Links).map(key => {
					let subtext = "";
					if (Links[key].subtext) {
						subtext = " - " + Links[key].subtext;
					}

					return (
						<NavLink class="-item" href={Links[key].href}>
							<SVGIcon baseline gap>{Links[key].icon != null ? Links[key].icon : 'star-full'}</SVGIcon>
							<span class="-title">{key}</span>{subtext}
						</NavLink>
					);
				})}
			</div>
		);
	}
}
