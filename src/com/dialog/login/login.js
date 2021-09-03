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
		this.onKeyDownPwd = this.onKeyDown.bind(this, this.onPasswordChange);
		this.onKeyDownUser = this.onKeyDown.bind(this, this.onLoginChange);
		this.doLogin = this.doLogin.bind(this);
		this.clearError = () => this.state.error && this.setState({'error': null});
	}

	onLoginChange( e ) {
		this.setState({ 'login': e.target.value.trim(), 'error': null });
	}

	onPasswordChange( e ) {
		const login = this.nameInput != null ? this.nameInput.value : this.state.login;
		this.setState({ 'password': e.target.value, 'login': login, 'error': null });
	}
	onRememberChange( e ) {
		this.setState({ remember: e.target.checked });
	}

	onKeyDown( callback, e ) {
		if (!e) {
			var e = window.event;
		}
		if (e.keyCode === 13) {
			callback(e);
			/*e.preventDefault();*/
			this.doLogin();
		}
	}

	doLogin() {
		this.clearError();
		$User.Login( this.state.login.trim(), this.state.password.trim(), "" )
			.then( r => {
				if ( r.status === 200 ) {
					this.submitForm && this.submitForm.submit();
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

	componentDidMount() {
		if (this.nameInput) {
			this.nameInput.focus();
		}
	}

	render( props, {login, password, remember, error} ) {
		const new_props = {
			'title': 'Log in',
			'error': error,
		};

		return (
			<form onsubmit={(e) => {e.preventDefault();}} ref={(form) => {this.submitForm = form;}} autocomplete="on">
				<DialogCommon ok oktext="Log In" onok={this.doLogin} cancel {...new_props}>
					<div>
						<div class="-input-container">
							<input name="user" autofocus id="dialog-login-login" onchange={this.onLoginChange} onkeydown={this.onKeyDownUser} class="-text -block focusable" type="text" name="username" placeholder="Name, account name, or e-mail" maxlength="254" value={login} ref={(input)=>{this.nameInput = input;}}/>
						</div>
					</div>
					<div>
						<div class="-input-container">
							<input name="password" id="dialog-login-password" onchange={this.onPasswordChange} onkeydown={this.onKeyDownPwd} class="-text -block focusable" type="password" name="password" placeholder="Password" maxlength="128" value={password} />
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
			</form>
		);
	}
}
