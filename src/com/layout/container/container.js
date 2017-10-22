import {h, Component} 				from 'preact/preact';

export default class Container extends Component {
	constructor( props ) {
		super(props);
	}

	render( props ) {
		return (
			<div {...props} class={["container", props.class]}>
        {props.children}
      </div>
		);
	}
}
