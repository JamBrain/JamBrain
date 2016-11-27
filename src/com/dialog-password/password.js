import { h, Component } 				from 'preact/preact';
import Sanitize							from '../../internal/sanitize/sanitize';
import DialogBase						from 'com/dialog-base/base';

import LabelYesNo						from 'com/label-yesno/yesno';

import $User							from '../shrub/js/user/user';

export default class DialogPassword extends Component {
	constructor( props ) {
		super(props);
		
		this.state = {
			password: "",
			password2: ""
		};

		// Bind functions (avoiding the need to rebind every render)
		this.onPasswordChange = this.onPasswordChange.bind(this);
		this.onPassword2Change = this.onPassword2Change.bind(this);
		this.doResetPassword = this.doResetPassword.bind(this);
		this.doFinishReset = this.doFinishReset.bind(this);
	}
	
	componentDidMount() {
//		this.loginName.focus();
	}

	onPasswordChange( e ) {
		this.setState({ password: e.target.value, error: null });
	}
	onPassword2Change( e ) {
		this.setState({ password2: e.target.value, error: null });
	}

	isValidPassword() {
		var pw = this.state.password.trim();
		if ( pw.length === 0 )
			return 0;
		if ( pw.length < 8 )
			return -1;
		
		return 1;
	}
	isValidPassword2() {
		var pw1 = this.state.password.trim();
		var pw2 = this.state.password2.trim();
		// Clever: This doesn't start failing until password (not password2) is not empty
		if ( pw1.length === 0 )
			return 0;
		if ( pw2.length < 8 )
			return -1;

		if ( pw1 !== pw2 )
			return -1;
			
		// Keep this check, so the display doesn't look weird			
		if ( this.state.password !== this.state.password2 )
			return -1;
		
		return 1;
	}

	
	doResetPassword() {
		if ( this.isValidPassword() > 0 && this.isValidPassword2() > 0 ) {
			$User.Password( this.state.password.trim() )
			.then( r => {
				if ( r.status === 200 ) {
					console.log('success',r);
					//location.href = "#";//user-loggedin";
					this.setState({ success: true, error: null });
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
		else {
			this.setState({ error: "Form incomplete or invalid" });
		}
	}
	
	doFinishReset() {
		// HACK
		location.href = "?";
	}

	render( props, {password, password2, success, error} ) {
		var ErrorMessage = error ? {'error': error} : {};
		
		var title = "Reset Password: Step 2";
		
		if ( false ) {
			
		}
		else if ( success ) {
			return (
				<DialogBase title={title} ok cancel oktext="Save" explicit onclick={this.doFinishReset} {...ErrorMessage}>
					Password Reset. You can now <strong>Log In</strong>.
				</DialogBase>
			);			
		}
		else {
			return (
				<DialogBase title={title} ok cancel oktext="Save" explicit onclick={this.doResetPassword} {...ErrorMessage}>
					<div>
						<input id="dialog-password-password2" onchange={this.onPasswordChange} class="-text focusable" type="password" name="password" maxlength="128" placeholder="Password" value={password} /><LabelYesNo value={this.isValidPassword()} />
					</div>
					<div>
						<input id="dialog-password-password2" onchange={this.onPassword2Change} class="-text focusable" type="password" name="password2" maxlength="128" placeholder="Password again" value={password2} /><LabelYesNo value={this.isValidPassword2()} />
					</div>
				</DialogBase>
			);
		}
	}
}
