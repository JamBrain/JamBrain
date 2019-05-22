import {h, Component}	from 'preact/preact';
import SVGIcon			from 'com/svg-icon/icon';

export default class SidebarGuides extends Component {
	constructor() {
	}

	render(props, state) {
		var Links = {
			"Rules": {"icon": "article", "href": "/events/ludum-dare/rules"},
			"Game Hosting Guide": {"href": "/events/ludum-dare/hosting-guide"}
		};

		return (
			<div class="sidebar-base sidebar-shortlist sidebar-guides">
				<div class="-title _font2">
					<SVGIcon baseline>question</SVGIcon> <span class="-text">Guides</span>
				</div>
				{Object.keys(Links).map(key => {
					return (
						<a class="-item" href={Links[key].href}>
							{Links[key].icon != null ? <SVGIcon baseline gap>{Links[key].icon}</SVGIcon> : null}
							<strong>{key}</strong>
						</a>
					);
				})}
			</div>
		);
	}
}
