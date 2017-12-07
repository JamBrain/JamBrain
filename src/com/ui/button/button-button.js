import {h, Component}					from 'preact/preact';

export default class UIButtonButton extends Component {
	constructor( props ) {
		super(props);
	}

	render( props ) {
		return <button {...props} props={cN("ui-button", props.class)} />;
	}
}
