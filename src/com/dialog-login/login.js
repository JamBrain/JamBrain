import { h, Component } 				from 'preact/preact';
import DialogBase						from 'com/dialog-base/base';

export default class DialogLogin extends Component {
	constructor() {
	}
	
	componentWillUpdate() {
		console.log("DialogLogin: componentWillUpdate");
	}
	componentDidUpdate() {
		console.log("DialogLogin: componentDidUpdate");
		document.getElementById('dialog-login-name').focus();
	}

	render( props ) {
		var Error = {};// { error:"There was a problem" };
		
		return (
			<DialogBase title="Log In" ok cancel oktext="Log In" {...Error}>
				<div>
					<span class="-label">Name:</span><input id="dialog-login-name" class="-text" type="text" name="username" />
				</div>
				<div>
					<span class="-label">Password:</span><input id="dialog-login-password" class="-text" type="password" name="password" />
				</div>
				<div>
					<input id="dialog-login-remember" type="checkbox" name="remember" checked="1" /><span>Stay Logged In</span>
					<div class="_float-right" id="dialog-login-forgot">Forgot Login/Password?</div>
				</div>
				
			</DialogBase>
		);
	}
}
