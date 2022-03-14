import {h, Component} from 'preact';
import cN from 'classnames';

export default class LayoutRow extends Component {
	constructor( props ) {
		super(props);
	}

	render( props ) {
		return (
			<div {...props} class={cN(props.class, "-row")}>
				{props.children}
			</div>
		);
	}
}
