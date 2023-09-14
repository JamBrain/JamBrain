import {Component} from 'preact';
import './common-button.less';

import ButtonBase						from 'com/button-base/base';
import ButtonLink						from 'com/button-link/link';

export default class ContentCommonNavButton extends Component {
	constructor( props ) {
		super(props);
	}

	render( props ) {
		if ( props.href ) {
			return <ButtonLink {...props} class={`button ${props.class ?? ''}`} />;
		}

		return <ButtonBase {...props} class={`button ${props.class ?? ''}`} />;
	}
}
