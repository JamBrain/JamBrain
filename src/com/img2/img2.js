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
