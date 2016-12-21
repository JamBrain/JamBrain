import { h, Component } 				from 'preact/preact';

import DropdownBase						from 'com/dropdown-base/base';

export default class DropdownCommon extends Component {
	constructor( props ) {
		super(props);
	}

	render( props ) {
		var new_props = {
			'class': 'dropdown-common' + (props.class ? ' '+props.class : '')
		};

		return (
			<DropdownBase {...new_props}>
				{props.children}
			</DropdownBase>
		);
	}
}
