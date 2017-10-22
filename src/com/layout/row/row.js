import {h, Component} 				from 'preact/preact';

export default class Row extends Component {
	constructor( props ) {
		super(props);
	}

	render( props ) {
		return (
			<div {...props} class="-row">
        {props.children}
      </div>
		);
	}
}
