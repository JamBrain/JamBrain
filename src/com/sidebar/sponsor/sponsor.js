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
				<div class="sidebar-base sidebar-shortlist sidebar-sponsor">
					<div class="-title _font2"><SVGIcon baseline>trophy</SVGIcon> <span class="-text">Sponsored by</span></div>
					<div><a href="/events/ludum-dare/49/$258334/ann-intel-sponsors-ludum-dare-49"><IMG2 src="///content/b/z/42d0f.png.w200.png" /></a></div>
					<div><a href="/events/ludum-dare/49/$258334/ann-gamemaker-studio-2-sponsors-ludum-dare-49"><IMG2 src="///content/b/z/42d3f.png.w200.png" /></a></div>
				</div>
			);
		}

/*
					<div><IMG2 src="///other/event/sample/sponsor/product.png" /></div>
					<div><IMG2 src="///other/event/sample/sponsor/company.png" /></div>
					<div class="-silver">
						<div><IMG2 src="///other/event/sample/sponsor/tagline.png" /></div>
						<div><IMG2 src="///other/event/sample/sponsor/example.png" /></div>
					</div>
*/
		return null;
	}
};

