import {h, Component} from 'preact';

export default class UIButtonButton extends Component {
	constructor( props ) {
		super(props);
	}

	render( props ) {
		return <button type="button" {...props} class={cN("ui-button", props.disabled ? "-disabled" : null, props.class)} />;
	}
}
