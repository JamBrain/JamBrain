import { h, Component } from 'preact/preact';
import SVGIcon 			from 'com/svg-icon/icon';

export default class SidebarCountdown extends Component {
	constructor( props ) {
		super(props);
	}

	render( props ) {
		return (
			<div class="sidebar-base sidebar-countdown">
				<div class="-clock font2">CLOCK GOES HERE</div>
				<div class="-info">Starts on Friday @ <strong>9:00 PM EST</strong> (Saturday @ <strong>02:00 GMT</strong>)</div>
			</div>
		);
	}
}
