import { h, Component } 				from 'preact';

import ButtonBase						from 'com/button-base/base';
import ButtonLink						from 'com/button-link/link';

export default class ContentCommonNavButton extends Component {
	constructor( props ) {
		super(props);
	}

	render( props ) {
		if ( props.href ) {
			return <ButtonLink {...props} class={cN('button', props.class)} />;
		}

		return <ButtonBase {...props} class={cN('button', props.class)} />;
	}
}
