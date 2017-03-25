import { h, Component } 				from 'preact/preact';

export default class DropdownBase extends Component {
	constructor( props ) {
		super(props);
	}

	render( props ) {
		var new_props = {
			'class': 'dropdown-base' + (props.class ? ' '+props.class : '')
		};
		
		return (
			<div {...new_props}>
				{props.children}
			</div>
		);
	}
}
