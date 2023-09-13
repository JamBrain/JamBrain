import { Component } from 'preact';
import UISpinner from 'com/ui/spinner';

export default class ContentLoading extends Component {
	constructor( props ) {
		super(props);
	}

	render( {error} ) {
		return (
			<div class="content">
				{ error ? error : <UISpinner /> }
			</div>
		);
	}
}
