import { h, Component } 				from 'preact/preact';

import ButtonBase						from 'com/button-base/base';

export default class ContentCommonNavButton extends Component {
	constructor( props ) {
		super(props);
	}

	render( props ) {
		return (
			<ButtonBase class="content-common-nav-button" onclick={props.onclick}>
				{props.children}
			</ButtonBase>
		);
	}
}
