import {h, Component}					from 'preact/preact';

import HeaderWarning					from 'com/header/warning/warning';
import HeaderWhatsup					from 'com/header/whatsup/whatsup';
import HeaderClock						from 'com/header/clock/clock';

export default class ViewHeader extends Component {
	constructor( props ) {
		super(props);
	}

	render( props ) {
		let ShowWarning = <HeaderWarning root={props.root} />;
		let ShowWhatsup = <HeaderWhatsup featured={props.featured} />;
		let ShowClock = <HeaderClock featured={props.featured} />;

		return (
			<div id="header">
				{ShowWarning}
				{ShowWhatsup}
				{ShowClock}
			</div>
		);
	}
}
