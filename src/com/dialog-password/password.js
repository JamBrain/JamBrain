import { h, Component } 				from 'preact/preact';
import Sanitize							from '../../internal/sanitize/sanitize';

import DialogCommon						from 'com/dialog-common/common';
import NavSpinner						from 'com/nav-spinner/spinner';
import LabelYesNo						from 'com/label-yesno/yesno';

import $User							from '../shrub/js/user/user';

export default class DialogPassword extends Component {
	constructor( props ) {
		super(props);

		this.state = {
			'loading': true
		};

		var Vars = Sanitize.getHTTPVars();
		//console.log("v",Vars);

		// Get activation ID
		this.ActID = Vars.id;
		this.ActHash = Vars.key;

		// Bind functions (avoiding the need to rebind every render)
		this.onPasswordChange = this.onPasswordChange.bind(this);
		this.onPassword2Change = this.onPassword2Change.bind(this);
		this.doResetPassword = this.doResetPassword.bind(this);
		this.doFinishReset = this.doFinishReset.bind(this);
	}

	componentDidMount() {
		// Lookup ID, and confirm this is a valid activation
		$User.Password(this.ActID, this.ActHash.trim(), "")
		.then( r => {
			if ( r.status === 200 ) {
				this.setState({
					'node': r.node,
					'password': "",
					'password2': "",
					'loading': false
				});
			}
			else {
				console.log(r);
				this.setState({ 'error': r.response, 'loading': false });
			}
		})
		.catch( err => {
			console.log(err);
			this.setState({ 'error': err, 'loading': false });
		});
	}

	onPasswordChange( e ) {
		this.setState({ 'password': e.target.value, 'error': null });
	}
	onPassword2Change( e ) {
		this.setState({ 'password2': e.target.value, 'error': null });
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
			$User.Password( this.ActID, this.ActHash.trim(), this.state.password.trim() )
			.then( r => {
				if ( r.status === 200 ) {
					console.log('success',r);
					//location.href = "#";//user-loggedin";
					this.setState({ 'success': true, 'error': null });
				}
				else {
					//console.log(r);
					this.setState({ 'error': r.message ? r.message : r.response });
				}
				return r;
			})
			.catch( err => {
				//console.log(err);
				this.setState({ 'error': err });
			});
		}
		else {
			this.setState({ 'error': "Form incomplete or invalid" });
		}
	}

	doFinishReset() {
		// HACK
		location.href = "?";
	}

	render( props, {password, password2, node, success, loading, error} ) {
		var new_props = {
			'title': 'Reset Password: Step 2'
		};
		if ( error ) {
			new_props.error = error;
		}

		if ( loading ) {
			return (
				<DialogCommon empty explicit {...new_props}>
					<NavSpinner />
				</DialogCommon>
			);
		}
		else if ( !node ) {
			return (
				<DialogCommon ok explicit {...new_props}>
					{"Password can not be reset."}
				</DialogCommon>
			);
		}
		else if ( success ) {
			return (
				<DialogCommon ok onok={this.doFinishReset} explicit {...new_props}>
					Password Reset. You can now <strong>Log In</strong>.
				</DialogCommon>
			);
		}
		else {
			return (
				<DialogCommon ok oktext="Save" onok={this.doResetPassword} cancel explicit {...new_props}>
					<div>
						<div class="-input-container">
							<input autofocus id="dialog-password-password2" oninput={this.onPasswordChange} class="-text focusable" type="password" name="password" maxlength="128" placeholder="Password" value={password} />
							<LabelYesNo value={this.isValidPassword()} />
						</div>
					</div>
					<div>
						<div class="-input-container">
							<input id="dialog-password-password2" oninput={this.onPassword2Change} class="-text focusable" type="password" name="password2" maxlength="128" placeholder="Password again" value={password2} />
							<LabelYesNo value={this.isValidPassword2()} />
						</div>
					</div>
				</DialogCommon>
			);
		}
	}
}
