import { h, Component }					from 'preact/preact';

import HeaderWhatsup					from 'com/header-whatsup/whatsup';
import HeaderClock						from 'com/header-clock/clock';

export default class ViewHeader extends Component {
	constructor( props ) {
		super(props);
	}

	render( props, state ) {
		var ShowWhatsup = null;
		ShowWhatsup = <HeaderWhatsup />;

		var ShowClock = null;
		ShowClock = <HeaderClock />;
		
		return (
			<div id="header">
				{ShowWhatsup}
				{ShowClock}
			</div>
		);
	}
};
