import { Component } from 'preact';
import Sanitize							from 'internal/sanitize';

import DialogCommon						from 'com/dialog/common/common';
import {Link, UISpinner} from 'com/ui';
import LabelYesNo						from 'com/label-yesno/yesno';

import $User							from 'backend/js/user/user';


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
		this.setState({'mail': e.target.value});
	}

	doReset() {
		let mail = this.state.mail.trim();

		if ( Sanitize.validateMail(mail) ) {
			this.setState({'loading': true, 'error': null});

			$User.Reset( mail )
			.then( r => {
				if ( r.status === 200 ) {
					DEBUG && console.log('sent', r.sent);
					// @endif
					this.setState({'sent': true, 'loading': false});
				}
				else {
					//console.log(r);
					this.setState({'error': r.message ? r.message : r.response, 'loading': false});
				}
				return r;
			})
			.catch( err => {
				//console.log(err);
				this.setState({'error': err, 'loading': false});
			});
		}
		else {
			this.setState({'error': "Incorrectly formatted e-mail address"});
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
					<UISpinner />
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
				<DialogCommon oktext="Send E-mail" ok={this.doReset} cancel explicit {...new_props}>
					<div>
						<div class="-input-container">
							<input autofocus id="dialog-register-mail" autocomplete="email" onChange={this.onChange} class="-text focusable" type="email" name="email" placeholder="E-mail address" maxLength={254} />
							<LabelYesNo value={Sanitize.validateMail(mail) ? 1 : -1} />
						</div>
						<p>See <Link href="https://ludumdare.com/resources/questions/how-do-i-reset-password/">this article</Link> for help</p>
					</div>
				</DialogCommon>
			);
		}
	}
}
