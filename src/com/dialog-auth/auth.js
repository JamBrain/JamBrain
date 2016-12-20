import { h, Component } 				from 'preact/preact';
import DialogCommon						from 'com/dialog-common/common';

export default class DialogAuth extends Component {
	constructor( props ) {
		super(props);
		
		this.state = {
			secret: ""
		};
	}
	
	componentDidUpdate() {
		document.getElementById('dialog-auth-secret').focus();
	}
	
	onChange( e ) {
		this.state.secret = e.target.value;
		this.setState(this.state);
	}

	render( props ) {
		var Error = {};//{ error:"There was a problem" };
		
		return (
			<DialogCommon title="Two Factor Authentication" ok cancel oktext="Authenticate" explicit {...Error}>
				<div class="-info -botbar">
					Open the Authenticator App, and write the code here.
				</div>
				<div>
					<span class="-label">Code:</span><input id="dialog-auth-secret" class="-text focusable" onchange={this.onChange.bind(this)} type="text" name="secret" autocomplete="off" value={this.state.secret} />
				</div>
			</DialogCommon>
		);
	}
}
