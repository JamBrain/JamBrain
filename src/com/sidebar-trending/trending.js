import { h, Component } from 'preact/preact';
import SVGIcon 			from 'com/svg-icon/icon';

export default class SidebarTrending extends Component {
	constructor() {
	}
	
	render( props, state ) {
		return (
			<div class="sidebar-base sidebar-shortlist sidebar-trending">
				<div class="-title"><SVGIcon baseline>fire</SVGIcon> Live and Trending</div>
				<div class="-item"><strong>#LDJAM</strong> <SVGIcon>trophy</SVGIcon></div>
				<div class="-item"><strong>#BaconJAM</strong></div>
				<div class="-footer">More Jams</div>
			</div>
		);
	}
}
