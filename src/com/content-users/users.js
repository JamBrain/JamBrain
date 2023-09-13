import { Component } from 'preact';

export default class ContentUsers extends Component {
	constructor( props ) {
		super(props);
	}

	render( {extra} ) {

		if ( extra.length ) {
			return (
				<div class="content content-post">
					<h2><strong>404:</strong> User "{extra[0]}" not found.</h2>
					<div>Did you forget to create your account?</div>
					<div>.</div>
				</div>
			);
		}
		return (
			<div class="content content-post">
				{"Users page... I don't yet know what goes here."}
			</div>
		);
	}
}
