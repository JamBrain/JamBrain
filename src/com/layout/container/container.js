import {h, Component} 				from 'preact/preact';

export default class Container extends Component {
	constructor( props ) {
		super(props);
	}

	render( props ) {
		return (
			<div class={["container", props.class]}>
        {props.children}
      </div>
		);
	}
}
