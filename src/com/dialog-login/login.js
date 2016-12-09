import { h, Component } 				from 'preact/preact';
import DialogBase						from 'com/dialog-base/base';
import NavLink							from 'com/nav-link/link';

import $User							from '../shrub/js/user/user';

export default class DialogLogin extends Component {
	constructor( props ) {
		super(props);
		
		this.state = {
			login: "",
			password: "",
			remember: false
		};

		// Bind functions (avoiding the need to rebind every render)
		this.onLoginChange = this.onLoginChange.bind(this);
		this.onPasswordChange = this.onPasswordChange.bind(this);
		this.onRememberChange = this.onRememberChange.bind(this);
		this.onKeyDown = this.onKeyDown.bind(this);
		this.doLogin = this.doLogin.bind(this);
	}
	
	componentDidMount() {
		this.loginName.focus();
	}

	onLoginChange( e ) {
		this.setState({ login: e.target.value.trim() });
	}
	onPasswordChange( e ) {
		this.setState({ password: e.target.value });
	}
	onRememberChange( e ) {
		this.setState({ remember: e.target.checked });
	}

	onKeyDown( e ) {
		if (!e) { 
			var e = window.event; 
		}
		if (e.keyCode === 13) { 
			this.onPasswordChange(e);
			/*e.preventDefault();*/ 
			this.doLogin(); 
		}
	}	
	doLogin() {
		$User.Login( this.state.login.trim(), this.state.password.trim(), "" )
			.then( r => {
				if ( r.status === 200 ) {
					console.log('success',r);
					//location.href = "#";//user-loggedin";
					location.href = location.pathname+location.search;
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
					<input id="dialog-login-password" onchange={this.onPasswordChange} onkeydown={this.onKeyDown} class="-text focusable" type="password" name="password" placeholder="Password" maxlength="128" value={password} />
				</div>
				<div>
					<div class="_float-right -link" id="dialog-login-forgot" onclick={e => { location.href = "#user-reset"; /*e.stopPropagation(); e.preventDefault();*/ } }>Forgot Password?</div>

					<div title="LOL. This is broken. Sorry!"><input id="dialog-login-remember" onchange={this.onRememberChange} class="focusable" type="checkbox" name="remember" checked={remember} /><span>Stay Logged In</span></div>
				</div>
			</DialogBase>
		);
	}
}
