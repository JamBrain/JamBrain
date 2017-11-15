import {h, Component}					from 'preact/preact';
import DialogCommon						from 'com/dialog/common/common';
import NavLink							from 'com/nav-link/link';

import $User							from 'shrub/js/user/user';

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
					//console.log('success',r);
					location.href = location.pathname + location.search;
					this.props.onlogin();
				}
				else {
					//console.log(r);
					this.setState({ error: r.message ? r.message : r.response });
				}
				return r;
			})
			.catch( err => {
				//console.log(err);
				this.setState({ error: err });
			});
	}

	render( props, {login, password, remember, error} ) {
		var new_props = {
			'title': 'Log in'
		};
		if ( error ) {
			new_props.error = error;
		}

		return (
			<DialogCommon ok oktext="Log In" onok={this.doLogin} cancel {...new_props}>
				<div>
					<div class="-input-container">
						<input autofocus id="dialog-login-login" onchange={this.onLoginChange} class="-text -block focusable" type="text" name="username" placeholder="Name, account name, or e-mail" maxlength="254" value={login} />
					</div>
				</div>
				<div>
					<div class="-input-container">
						<input id="dialog-login-password" onchange={this.onPasswordChange} onkeydown={this.onKeyDown} class="-text -block focusable" type="password" name="password" placeholder="Password" maxlength="128" value={password} />
					</div>
				</div>
				<div style="overflow:hidden">
					<div class="_float-right -link" id="dialog-login-forgot" onclick={e => {
						location.href = "#user-reset";
						/*e.stopPropagation(); e.preventDefault();*/
					} }>
						Forgot Password?
					</div>
					<div title="LOL. This is broken. Sorry!" class="_hidden">
						<input id="dialog-login-remember" onchange={this.onRememberChange} class="focusable" type="checkbox" name="remember" checked={remember} />
						<span>Stay Logged In</span>
					</div>
				</div>
			</DialogCommon>
		);
	}
}
