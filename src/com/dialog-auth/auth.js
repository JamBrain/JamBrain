import { h, Component } 				from 'preact/preact';
import DialogBase						from 'com/dialog-base/base';

export default class DialogAuth extends Component {
	constructor() {
	}
	
	componentDidUpdate() {
		document.getElementById('dialog-auth-secret').focus();
	}

	render( props ) {
		var Error = {};//{ error:"There was a problem" };
		
		return (
			<DialogBase title="Two Factor Authentication" ok cancel oktext="Authenticate" explicit {...Error}>
				<div class="-info">
					Open your Authenticator App and check the code. 
				</div>
				<div>
					<span class="-label">Code:</span><input id="dialog-auth-secret" class="-text" type="text" name="secret" autocomplete="off" />
				</div>
			</DialogBase>
		);
	}
}
