import { h, Component } 				from 'preact/preact';
import DialogBase						from 'com/dialog-base/base';

export default class DialogRegister extends Component {
	constructor() {
	}
	
	componentDidUpdate() {
		document.getElementById('dialog-register-mail').focus();
	}

	render( props ) {
		var Error = {};//{ error:"There was a problem" };
		
		return (
			<DialogBase title="Create Account" ok cancel oktext="Send e-mail" {...Error}>
				<div>
					Enter your e-mail address to begin creating an account.
				</div>
				<div>
					<span class="-label">E-mail:</span><input id="dialog-register-mail" class="-text" type="text" name="email" />
				</div>
			</DialogBase>
		);
	}
}
