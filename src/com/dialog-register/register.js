import { h, Component } 				from 'preact/preact';
import Sanitize							from '../../internal/sanitize/sanitize';

import DialogBase						from 'com/dialog-base/base';
import LabelYesNo						from 'com/label-yesno/yesno';

import $User							from '../shrub/js/user/user';


export default class DialogRegister extends Component {
	constructor( props ) {
		super(props);
		
		console.log("DialogRegister",this.state);
		
		this.state = {
			mail: "",
			error: null,
			loading: false
		};

		// Bind functions (avoiding the need to rebind every render)
		this.onChange = this.onChange.bind(this);
		this.doRegister = this.doRegister.bind(this);
		this.doFinish = this.doFinish.bind(this);
	}
	
	componentDidMount() {
		this.registerMail.focus();
	}

	onChange( e ) {
		this.setState({ mail: e.target.value.trim() });
	}
	
	doRegister() {
		mail = this.state.mail.trim();
		
		if ( Sanitize.validateMail(mail) ) {
			this.setState({ loading: true, error: null });
			
			$User.Register( mail )
			.then( r => {
				if ( r.status === 201 ) {
					console.log('sent', r.sent);
					this.setState({sent: true, loading: false});
				}
				else if ( r.status === 200 ) {
					console.log('resent', r.sent);
					this.setState({sent: true, resent: true, loading: false});
				}
				else {
					console.log(r);
					this.setState({ error: r.message ? r.message : r.response, loading: false });
				}
				return r;
			})
			.catch( err => {
				console.log(err);
				this.setState({ error: err, loading: false });
			});
		}
		else {
			this.setState({ error: "Incorrectly formatted e-mail address" });
		}
	}
	
	doFinish() {
		location.href = location.pathname+location.search;
	}

	render( props, {mail, sent, resent, loading, error} ) {
		var ErrorMessage = error ? {'error': error} : {};
		var title = "Create Account";
		
		if ( loading ) {
			return (
				<DialogBase title={title} explicit {...ErrorMessage}>
					<div>
						Please wait...
					</div>
				</DialogBase>
			);
		}
		else if ( sent ) {
			return (
				<DialogBase title={title} ok explicit onclick={this.doFinish} {...ErrorMessage}>
					<div>
						Activation e-mail {resent ? 'resent' : 'sent'} to <code>{mail}</code>
					</div>
				</DialogBase>
			);
		}
		else {
			return (
				<DialogBase title={title} ok cancel oktext="Send Activation E-mail" explicit onclick={this.doRegister} {...ErrorMessage}>
					<div class="-info">
						Enter your e-mail address to begin activating your account.
					</div>
					<div>
						<input ref={(input) => this.registerMail = input} id="dialog-register-mail" onchange={this.onChange} class="-text focusable" type="text" name="email" placeholder="E-mail address" maxlength="254" value={mail} /><LabelYesNo value={mail.trim().length ? (Sanitize.validateMail(mail) ? 1 : -1) : 0} />
					</div>
					<div class="-info">
						<strong>Hotmail</strong>, <strong>Outlook</strong>, <strong>Live.com</strong>: Add <code>hello@jammer.vg</code> to your contacts.<br />
						<strong>Free.fr</strong>: Probably wont work. We've sent a whitelisting request.<br />
						<strong>Laposte.net</strong>: <strong>Sorry!</strong> We can't figure out how to fix them. :(
					</div>
				</DialogBase>
			);

//						<strong>TIP:</strong> For Hotmail, Outlook, live.com go to <a href="https://outlook.live.com/owa/?path=/people" target="_blank" onclick={ e => { return e.stopPropagation() }}>people</a> and add a <em>contact</em>.
		}
	}
}
