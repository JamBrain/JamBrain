import { h, Component } 				from 'preact/preact';

import DropdownCommon					from 'com/dropdown-common/common';

export default class DropdownUser extends Component {
	constructor( props ) {
		super(props);
	}

	render( props ) {
		return (
			<DropdownCommon class="dropdown-user">
				<div>Hello</div>
				<div>Dawg</div>
				<div>Man</div>
			</DropdownCommon>
		);
	}
}
