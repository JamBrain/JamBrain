import { h, Component } from 'preact/preact';
import ButtonLink		from 'com/button-link/link';

export default class SidebarDummyTV extends Component {
	constructor( props ) {
		super(props);
	}

	render( {}, {} ) {

		return (
			<div class="sidebar-base sidebar-shortlist sidebar-dummytv">
				<ButtonLink class="-footer" href="//www.twitch.tv/communities/ludumdare">More Live Streams</ButtonLink>
			</div>
		);
	}
}
