import { h, Component } 				from 'preact/preact';
import DialogBase						from 'com/dialog-base/base';

export default class DialogLogin extends Component {
	constructor() {
	}
	
	componentDidMount() {
		this.loginName.focus();
	}

	render( props ) {
		var Error = {};// { error:"There was a problem" };
		
		// NOTE: There's a Preact bug that the extra <span /> is working around
		return (
			<DialogBase title="Log In" ok cancel oktext="Log In" {...Error}>
				<div class="-info -botline">
					Use either your <strong>Name</strong>, your <strong>Account Name</strong>, or <strong>E-mail Address</strong>.
				</div>
				<div>
					<span /><span class="-label">Log In:</span><input ref={(input) => this.loginName = input} class="-text" type="text" name="username" />
				</div>
				<div>
					<span class="-label">Password:</span><input ref={(input) => this.loginPassword = input} class="-text" type="password" name="password" />
				</div>
				<div>
					<input ref={(input) => this.loginRemember = input} type="checkbox" name="remember" checked="1" /><span>Stay Logged In</span>
					<div class="_float-right" ref={(input) => this.loginForgot = input} id="dialog-login-forgot">Forgot your Password?</div>
				</div>
			</DialogBase>
		);
	}
}
