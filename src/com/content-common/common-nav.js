import { h, Component } 				from 'preact/preact';

import ContentLoading					from 'com/content-loading/loading';

export default class ContentCommonNav extends Component {
	constructor( props ) {
		super(props);
	}

	render( props ) {
		return (
			<div class="content-common-body content-common-nav">
				{props.children}
			</div>
		);
	}
}
