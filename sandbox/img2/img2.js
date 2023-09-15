import { Component } from 'preact';

export default class IMG2 extends Component {
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
		let newProps = {...props};
		newProps.onError = this.onError;

		// If you have no src, but have a failsrc
		if ( !newProps.src && newProps.failsrc ) {
			newProps.src = newProps.failsrc;
		}

		// prepend the static endpoint if a URL begins with a triple slash
		if ( newProps.src && newProps.src.indexOf('///') === 0 ) {
			newProps.src = STATIC_ENDPOINT + newProps.src.substr(2);
		}
		if ( newProps.failsrc && newProps.failsrc.indexOf('///') === 0 ) {
			newProps.failsrc = STATIC_ENDPOINT + newProps.failsrc.substr(2);
		}

		// If an error, use failsrc
		if ( error && newProps.failsrc ) {
			newProps.src = newProps.failsrc;
		}

		return (
			<img {...newProps} />
		);
	}
}
