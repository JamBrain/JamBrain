import { h, Component } 				from 'preact/preact';
import DialogBase						from 'com/dialog-base/base';

export default class DialogLogin extends Component {
	constructor( props ) {
		super(props);
		
		this.state = {
			login: "",
			password: "",
			remember: "1"
		};
	}
	
	componentDidMount() {
		this.loginName.focus();
	}

	onLoginChange( e ) {
		this.state.login = e.target.value;
		this.setState(this.state);
	}
	onPasswordChange( e ) {
		this.state.password = e.target.value;
		this.setState(this.state);
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
					<span /><span class="-label">Log In:</span><input ref={(input) => this.loginName = input} id="dialog-login-login" onchange={this.onLoginChange.bind(this)} class="-text focusable" type="text" name="username" maxlength="32" value={this.state.login} />
				</div>
				<div>
					<span class="-label">Password:</span><input ref={(input) => this.loginPassword = input} id="dialog-login-password" onchange={this.onPasswordChange.bind(this)} class="-text focusable" type="password" name="password" maxlength="64" value={this.state.password} />
				</div>
				<div>
					<input ref={(input) => this.loginRemember = input} id="dialog-login-remember" class="focusable" type="checkbox" name="remember" checked={this.state.remember} /><span>Stay Logged In</span>
					
					<div class="_float-right" ref={(input) => this.loginForgot = input} id="dialog-login-forgot">Forgot your Password?</div>
				</div>
			</DialogBase>
		);
	}
}
