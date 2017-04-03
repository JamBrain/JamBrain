import { h, Component } 				from 'preact/preact';
import NavSpinner						from 'com/nav-spinner/spinner';

export default class ContentLoading extends Component {
	constructor( props ) {
		super(props);
	}

	render( {error} ) {
		return (
			<div class="content-base">
				{ error ? error : <NavSpinner /> }
			</div>
		);
	}
}
