import {h, Component} 					from 'preact/preact';
import DialogCommon						from 'com/dialog/common/common';

export default class DialogAuth extends Component {
	constructor( props ) {
		super(props);

		this.state = {
			secret: ""
		};
	}

	onChange( e ) {
		this.setState({ 'secret': e.target.value });
	}

	render( props ) {
		var new_props = {
			'title': 'Two Factor Authentication'
		};

		return (
			<DialogCommon ok oktext="Authenticate" cancel explicit {...new_props}>
				<div class="-info -botbar">
					Open the Authenticator App, and write the code here.
				</div>
				<div>
					<span class="-label">Code:</span>
					<div class="-input-container">
						<input autofocus id="dialog-auth-secret" class="-text focusable" onchange={this.onChange.bind(this)} type="text" name="secret" autocomplete="off" value={this.state.secret} />
					</div>
				</div>
			</DialogCommon>
		);
	}
}
