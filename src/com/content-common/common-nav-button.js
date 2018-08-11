import { h, Component } 				from 'preact/preact';

import ButtonBase						from 'com/button-base/base';
import ButtonLink						from 'com/button-link/link';

export default class ContentCommonNavButton extends Component {
	constructor( props ) {
		super(props);
	}

	render( props ) {
		var Class = ['content-common-nav-button'];
		if ( props.class )
			Class = Class.concat(props.class.split(' '));

		if ( props.href ) {
			return (
				<ButtonLink disabled={props.disabled} class={Class} href={props.href} onclick={props.onclick}>
					{props.children}
				</ButtonLink>
			);
		}
		return (
			<ButtonBase disabled={props.disabled} class={Class} onclick={props.onclick}>
				{props.children}
			</ButtonBase>
		);
	}
}
