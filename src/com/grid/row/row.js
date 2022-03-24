import {h, Component} from 'preact';
import cN from 'classnames';

/** @deprecated */
export default class GridRow extends Component {
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
