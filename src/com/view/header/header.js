import {h, Component}					from 'preact/preact';

import HeaderWhatsup					from 'com/header/whatsup/whatsup';
import HeaderClock						from 'com/header/clock/clock';

import HeaderNoob						from 'com/header/noob/noob';

export default class ViewHeader extends Component {
	constructor( props ) {
		super(props);
	}

	render( props ) {
		let ShowNoob = null;
		if ( props.user && (props.user.id == 0) )
			ShowNoob = <HeaderNoob featured={props.featured} />;

		let ShowWhatsup = <HeaderWhatsup featured={props.featured} />;
		let ShowClock = <HeaderClock featured={props.featured} />;

		return (
			<div id="header">
				{ShowNoob}
				{ShowWhatsup}
				{ShowClock}
			</div>
		);
	}
}
