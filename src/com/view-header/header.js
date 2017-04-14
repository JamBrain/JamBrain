import { h, Component }					from 'preact/preact';

import HeaderWhatsup					from 'com/header-whatsup/whatsup';
import HeaderClock						from 'com/header-clock/clock';

import HeaderNoob						from 'com/header-noob/noob';

export default class ViewHeader extends Component {
	constructor( props ) {
		super(props);
	}

	render( props ) {
		var ShowNoob = null;
		var ShowWhatsup = null;
		var ShowClock = null;
		
		if ( props.user && props.user.id === 0 )
			ShowNoob = <HeaderNoob />;

		ShowWhatsup = <HeaderWhatsup />;
		ShowClock = <HeaderClock />;
		
		return (
			<div id="header">
				{ShowNoob}
				{ShowWhatsup}
				{ShowClock}
			</div>
		);
	}
};
