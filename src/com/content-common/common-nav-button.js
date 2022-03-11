import { h, Component } 				from 'preact/preact';

import ButtonBase						from 'com/button-base/base';
import ButtonLink						from 'com/button-link/link';

export default class ContentCommonNavButton extends Component {
	constructor( props ) {
		super(props);
	}

	render( props ) {
		var newClass = cN('content-common-nav-button', props.class);

		if ( props.href ) {
			return (
				<ButtonLink disabled={props.disabled} class={newClass} href={props.href} onclick={props.onclick}>
					{props.children}
				</ButtonLink>
			);
		}
		return (
			<ButtonBase disabled={props.disabled} class={newClass} onclick={props.onclick}>
				{props.children}
			</ButtonBase>
		);
	}
}
