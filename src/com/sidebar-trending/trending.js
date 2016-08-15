import { h, Component } from 'preact/preact';
import CoreButton		from 'com/core-button/button';
import SVGIcon 			from 'com/svg-icon/icon';

export default class SidebarTrending extends Component {
	constructor() {
	}
	
	render( props, state ) {
		return (
			<div class="sidebar-trending sidebar-shortlist">
				<div class="-title"><SVGIcon name="fire" /> Live and Trending</div>
				<div class="-item"><strong>#LDJAM</strong> <SVGIcon name="trophy" /></div>
				<div class="-item"><strong>#BaconJAM</strong></div>
				<div class="-footer">More Jams</div>
			</div>
		);
	}
}
