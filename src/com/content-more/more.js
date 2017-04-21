import { h, Component } 				from 'preact/preact';

import ButtonBase						from 'com/button-base/base';

export default class ContentMore extends Component {
	constructor( props ) {
		super(props);
	}

	render( props ) {
		return (
			<div class="content-base content-more">
				<ButtonBase class='-button' onclick={props.onclick}>MORE</ButtonBase>
			</div>
		);
	}
}
