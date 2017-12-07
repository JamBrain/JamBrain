import {h, Component}					from 'preact/preact';

export default class UIImage extends Component {
	constructor( props ) {
		super(props);

		this.state = {
			'error': false
		};

		this.onError = this.onError.bind(this);
	}

	// TODO: if props change, clear the error state. right now any error will forever lock this in an error state
//	shouldComponentUpdate( nextProps, nextState ) {
//		return this.state.error !== nextState.error;
//	}

	onError() {
		this.setState({'error': true});
	}

	render( props, state ) {
		props = Object.assign({}, props);

		// If you have no 'src' or an error, and have a failsrc
		if ( (!props.src || state.error) && props.failsrc ) {
			props.src = props.failsrc;
		}

		// If your URL begins with a triple slash, append the static endpoint
		if ( props.src && (props.src.indexOf('///') === 0) ) {
			props.src = STATIC_ENDPOINT + props.src.substr(2);
		}
		if ( props.failsrc && (props.failsrc.indexOf('///') === 0) ) {
			props.failsrc = STATIC_ENDPOINT + props.failsrc.substr(2);
		}

		let Classes = cN(
			'ui-image',
			props.class,
			props.block ? '-block' : null
		);

		return <img {...props} class={Classes} onerror={this.onError} />;
	}
}
