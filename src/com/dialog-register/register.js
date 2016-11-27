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
		this.setState({ mail: e.target.value });
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
			// NOTE: There's a Preact bug that the extra <span /> is working around
			return (
				<DialogBase title={title} ok cancel oktext="Send Activation E-mail" explicit onclick={this.doRegister} {...ErrorMessage}>
					<div>
						<span /><input ref={(input) => this.registerMail = input} id="dialog-register-mail" onchange={this.onChange} class="-text focusable" type="text" name="email" placeholder="E-mail address" maxlength="254" /><LabelYesNo value={Sanitize.validateMail(mail) ? 1 : -1} />
					</div>
					<div class="-info">
						Expect an e-mail from <code>hello@jammer.vg</code>
					</div>
					<div class="-info">
						If you use Hotmail or Outlook, go to <a href="https://outlook.live.com/owa/?path=/people" target="_blank" onclick={ e => { return e.stopPropagation() }}>people</a> and add a <em>contact</em>.
					</div>
				</DialogBase>
			);
		}
	}
}
