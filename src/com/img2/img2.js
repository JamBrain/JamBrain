import { h, Component } from 'preact/preact';

export default class IMG extends Component {
	constructor( props ) {
		super(props);

		this.state = {
			'error': false
		};

		this.onError = this.onError.bind(this);
	}

//	shouldComponentUpdate( nextProps, nextState ) {
//		return this.state.error !== nextState.error;
//	}

	onError() {
		this.setState({'error': true});
	}

	render( props, {error} ) {
		// If you have no src, but have a failsrc
		if ( !props.src && props.failsrc ) {
			props.src = props.failsrc;
		}

		// if your URL begins with a triple slash, append the static endpoint
		if ( props.src && props.src.indexOf('///') === 0 ) {
			props.src = STATIC_ENDPOINT + props.src.substr(2);
		}
		if ( props.failsrc && props.failsrc.indexOf('///') === 0 ) {
			props.failsrc = STATIC_ENDPOINT + props.failsrc.substr(2);
		}

		if ( error ) {
			props.src = props.failsrc;
			return (
				<img {...props} />
			);
		}
		else {
			return (
				<img {...props} onerror={this.onError} />
			);
		}
	}
}
