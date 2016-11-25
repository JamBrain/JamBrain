import { h, Component } 				from 'preact/preact';
import DialogBase						from 'com/dialog-base/base';

import $User							from '../shrub/js/user/user';

export default class DialogLogin extends Component {
	constructor( props ) {
		super(props);
		
		this.state = {
			login: "",
			password: "",
			remember: "1"
		};

		// Bind functions (avoiding the need to rebind every render)
		this.onLoginChange = this.onLoginChange.bind(this);
		this.onPasswordChange = this.onPasswordChange.bind(this);
		this.onRememberChange = this.onRememberChange.bind(this);
		this.doLogin = this.doLogin.bind(this);
	}
	
	componentDidMount() {
		this.loginName.focus();
	}

	onLoginChange( e ) {
		this.setState({ login: e.target.value });
	}
	onPasswordChange( e ) {
		this.setState({ password: e.target.value });
	}
	onRememberChange( e ) {
		this.setState({ remember: e.target.checked });
	}
	
	doLogin() {
		$User.Login( this.state.login.trim(), this.state.password.trim(), "" )
			.then( r => {
				if ( r.status === 200 ) {
					console.log('success',r);
					location.href = "#";//user-loggedin";
					this.props.onlogin();
				}
				else {
					console.log(r);
					this.setState({ error: r.message ? r.message : r.response });
				}
				return r;
			})
			.catch( err => {
				console.log(err);
				this.setState({ error: err });
			});
	}

	render( props, {login, password, remember, error} ) {
		var ErrorMessage = error ? {'error': error} : {};
		
		// NOTE: There's a Preact bug that the extra <span /> is working around
		return (
			<DialogBase title="Log in" ok cancel oktext="Log In" onclick={this.doLogin} {...ErrorMessage}>
				<div>
					<span /><input ref={(input) => this.loginName = input} id="dialog-login-login" onchange={this.onLoginChange} class="-text focusable" type="text" name="username" placeholder="Name, account name, or e-mail" maxlength="254" value={login} />
				</div>
				<div>
					<input id="dialog-login-password" onchange={this.onPasswordChange} class="-text focusable" type="password" name="password" placeholder="Password" maxlength="128" value={password} />
				</div>
				<div>
					<input id="dialog-login-remember" onchange={this.onRememberChange} class="focusable" type="checkbox" name="remember" checked={remember} /><span>Stay Logged In</span>
					
					<div class="_float-right" id="dialog-login-forgot">Forgot Password?</div>
				</div>
			</DialogBase>
		);
	}
}
