import { h, Component } 				from 'preact/preact';

import ButtonBase						from 'com/button-base/base';
import NavSpinner						from 'com/nav-spinner/spinner';

export default class ContentMore extends Component {
	constructor( props ) {
		super(props);
	}

	render( props ) {
		// MK: This is fine as a prop, but don't do loading states, mmkay
		if ( props.loading ) {
			return (
				<div class="content-base content-more">
					<NavSpinner />
				</div>
			);
		}
		return (
			<div class="content-base content-more">
				<ButtonBase class='-button' onclick={props.onclick}>MORE</ButtonBase>
			</div>
		);
	}
}
