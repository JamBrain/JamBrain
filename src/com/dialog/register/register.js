import { Component } from 'preact';
import Sanitize							from 'internal/sanitize';

import {UISpinner} from 'com/ui';

import DialogBase						from 'com/dialog/base/base';
import DialogCommon						from 'com/dialog/common/common';
import LabelYesNo						from 'com/label-yesno/yesno';

import $User							from 'backend/js/user/user';


export default class DialogRegister extends Component {
	constructor( props ) {
		super(props);

		//console.log("DialogRegister",this.state);

		this.state = {
			'mail': "",
			'invite': "",
			'error': null,
			'loading': false
		};

		// Bind functions (avoiding the need to rebind every render)
		this.onChangeMail = this.onChangeMail.bind(this);
		this.onChangeInvite = this.onChangeInvite.bind(this);
		this.doRegister = this.doRegister.bind(this);
		this.doFinish = this.doFinish.bind(this);
	}

	onChangeMail( e ) {
		this.setState({ 'mail': e.target.value.trim() });
	}
	onChangeInvite( e ) {
		this.setState({ 'invite': e.target.value.trim() });
	}

	doRegister() {
		let mail = this.state.mail.trim();
		let invite = this.state.invite.trim();

		if ( !Sanitize.validateMail(mail) ) {
			this.setState({ 'error': "Incorrectly formatted e-mail address" });
			return;
		}

		// TODO: sanitize invite code

		this.setState({ 'loading': true, 'error': null });

		$User.Register( mail, invite )
		.then( r => {
			if ( r.status === 201 ) {
				//console.log('sent', r.sent);
				this.setState({'sent': true, 'loading': false});
			}
			else if ( r.status === 200 ) {
				//console.log('resent', r.sent);
				this.setState({'sent': true, 'resent': true, 'loading': false});
			}
			else {
				//console.log(r);
				this.setState({ 'error': r.message ? r.message : r.response, 'loading': false });
			}
			return r;
		})
		.catch( err => {
			//console.log(err);
			this.setState({ 'error': err, 'loading': false });
		});
	}

	doFinish() {
		location.href = location.pathname + location.search;
	}

	render( props, {mail, invite, sent, resent, loading, error} ) {
		var new_props = {
			'title': 'Create Account'
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
				<DialogCommon ok onok={this.doFinish} explicit {...new_props}>
					<div>Activation e-mail {resent ? 'resent' : 'sent'} to <code>{mail}</code></div>
				</DialogCommon>
			);
		}
		else {
/*
			return (
				<DialogCommon cancel explicit {...new_props}>
					<div class="-info">
						Creating accounts is currently disabled. Please check back in a few days.
					</div>
				</DialogCommon>
			);
*/
			return (
				<DialogCommon ok oktext="Send Activation E-mail" onok={this.doRegister} cancel explicit {...new_props}>
					<div class="-info">
						Enter your e-mail address to begin activating your account
					</div>
					<div>
						<div class="-input-container">
							<input autofocus id="dialog-register-mail" onChange={this.onChangeMail} class="-text focusable" type="email" name="email" placeholder="E-mail address" maxlength="254" value={mail} />
							<LabelYesNo value={mail.trim().length ? (Sanitize.validateMail(mail) ? 1 : -1) : 0} />
						</div>
					</div>
					<div>
						<div class="-input-container">
							<input id="dialog-register-invite" onChange={this.onChangeInvite} class="-text focusable" type="text" name="invite" placeholder="Invite code (required)" maxlength="64" value={invite} />
						</div>
					</div>
					<div class="-info">
						If you need an invitation code, ask a friend or check our social media.
					</div>
				</DialogCommon>
			);
//					<div class="-info">
//						<ul>
//							<li><strong>Hotmail</strong>, <strong>Outlook</strong>, <strong>Live.com</strong>: Add <code>hello@jam.vg</code> to your contacts</li>
//							<li><strong>Free.fr</strong>: Probably wont work. We've sent a whitelisting request</li>
//							<li><strong>Laposte.net</strong>: We can't find any info on how to fix them. <strong>SORRY!</strong> :(</li>
//						</ul>
//					</div>
		}
	}
}
