import {h, Component} 					from 'preact/preact';
import Sanitize							from 'internal/sanitize/sanitize';

import DialogCommon						from 'com/dialog/common/common';
import NavSpinner						from 'com/nav-spinner/spinner';
import LabelYesNo						from 'com/label-yesno/yesno';

import $User							from 'shrub/js/user/user';


export default class DialogReset extends Component {
	constructor( props ) {
		super(props);

		this.state = {
			'mail': "",
			'error': null,
			'loading': false
		};

		// Bind functions (avoiding the need to rebind every render)
		this.onChange = this.onChange.bind(this);
		this.doReset = this.doReset.bind(this);
	}

	componentDidMount() {
	}

	onChange( e ) {
		this.setState({ 'mail': e.target.value });
	}

	doReset() {
		mail = this.state.mail.trim();

		if ( Sanitize.validateMail(mail) ) {
			this.setState({ 'loading': true, 'error': null });

			$User.Reset( mail )
			.then( r => {
				if ( r.status === 200 ) {
					console.log('sent', r.sent);
					this.setState({'sent': true, 'loading': false});
				}
				else {
					console.log(r);
					this.setState({ 'error': r.message ? r.message : r.response, 'loading': false });
				}
				return r;
			})
			.catch( err => {
				console.log(err);
				this.setState({ 'error': err, 'loading': false });
			});
		}
		else {
			this.setState({ 'error': "Incorrectly formatted e-mail address" });
		}
	}

	render( props, {mail, sent, loading, error} ) {
		var new_props = {
			'title': 'Reset Password'
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
		else if ( sent ) {
			return (
				<DialogCommon ok explicit {...new_props}>
					<div>Password reset message sent to <code>{mail}</code></div>
				</DialogCommon>
			);
		}
		else {
			return (
				<DialogCommon ok oktext="Send E-mail" onok={this.doReset} cancel explicit {...new_props}>
					<div>
						<div class="-input-container">
							<input autofocus id="dialog-register-mail" onchange={this.onChange} class="-text focusable" type="text" name="email" placeholder="E-mail address" maxlength="254" />
							<LabelYesNo value={Sanitize.validateMail(mail) ? 1 : -1} />
						</div>
					</div>
				</DialogCommon>
			);
		}
	}
}
