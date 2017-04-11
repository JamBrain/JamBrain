import { h, Component }					from 'preact/preact';
import IMG2								from 'com/img2/img2';

import SVGIcon 			from 'com/svg-icon/icon';
import NavLink 			from 'com/nav-link/link';

export default class ViewSidebar extends Component {
	constructor( props ) {
		super(props);
	}

	render( {}, {} ) {
		/* If event is active, and it's sponsored */
		if ( true ) {
			return (
				<div class="sidebar-base sidebar-shortlist sidebar-sponsor _hidden">
					<div class="-title _font2"><SVGIcon baseline>trophy</SVGIcon> <span class="-text">Sponsored by</span></div>
					<div><IMG2 src="///other/event/sample/sponsor/Product.png" /></div>
					<div><IMG2 src="///other/event/sample/sponsor/Company.png" /></div>
					<div class="-silver">
						<div><IMG2 src="///other/event/sample/sponsor/Tagline.png" /></div>
						<div><IMG2 src="///other/event/sample/sponsor/Example.png" /></div>
					</div>
				</div>
			);
		}
		return null;
	}
};

