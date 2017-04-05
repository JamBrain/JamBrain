import { h, Component } 				from 'preact/preact';

import ButtonBase						from 'com/button-base/base';

export default class ContentCommonNavButton extends Component {
	constructor( props ) {
		super(props);
	}

	render( props ) {
		var Class = ['content-common-nav-button'];
		if ( props.class )
			Class = Class.concat(props.class.split(' '));

		return (
			<ButtonBase class={Class} onclick={props.onclick}>
				{props.children}
			</ButtonBase>
		);
	}
}
