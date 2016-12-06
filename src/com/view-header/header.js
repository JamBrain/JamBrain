import { h, Component }					from 'preact/preact';

import HeaderWhatsup					from 'com/header-whatsup/whatsup';

export default class ViewHeader extends Component {
	constructor( props ) {
		super(props);
	}

	render( props, state ) {
		var ShowWhatsup = null;
		ShowWhatsup = <HeaderWhatsup />
		
		return (
			<div id="header">
				{ShowWhatsup}
			</div>
		);
	}
};
