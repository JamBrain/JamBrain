import {h, Component}		from 'preact';
import cN					from 'classnames';

export default class DropdownBase extends Component {
	constructor( props ) {
		super(props);
	}

	render( props ) {
		return <div {...props} class={cN(props.class, 'dropdown-base')} />;
	}
}
