import { h, Component } 				from 'preact/preact';

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
		this.onChange = DialogRegister.prototype.onChange.bind(this);
		this.doRegister = DialogRegister.prototype.doRegister.bind(this);
	}
	
	componentDidMount() {
		this.registerMail.focus();
	}
	
	validateMail( mail ) {
		// http://stackoverflow.com/a/9204568/5678759
		return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail);
	}

	onChange( e ) {
		this.setState({ mail: e.target.value });
	}
	
	doRegister() {
		if ( this.validateMail(this.state.mail) ) {
			this.setState({ loading: true, error: null });
			
			$User.Register( this.state.mail )
			.then( r => {
				if ( r.status === 201 ) {
					console.log('sent', r.sent);
					this.setState({sent: true, loading: false});
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

	render( props, {mail, sent, loading, error} ) {
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
				<DialogBase title={title} ok explicit {...ErrorMessage}>
					<div>
						Activation e-mail sent to <code>{mail}</code>
					</div>
				</DialogBase>
			);
		}
		else {
			// NOTE: There's a Preact bug that the extra <span /> is working around
			return (
				<DialogBase title={title} ok cancel oktext="Send Activation E-mail" explicit onclick={this.doRegister} {...ErrorMessage}>
					<div>
						<span /><input ref={(input) => this.registerMail = input} id="dialog-register-mail" onchange={this.onChange} class="-text focusable" type="text" name="email" placeholder="E-mail address" /><LabelYesNo value={this.validateMail(mail) ? 1 : -1} />
					</div>
					<div class="-info">
						Expect an e-mail from <code>hello@jammer.vg</code>
					</div>
					<div class="-info">
						If you use Hotmail or Outlook, go to <a href="https://outlook.live.com/owa/?path=/people" target="_blank" onclick={ e => { return e.stopPropagation() }}>People</a> add a <em>Contact</em>.
					</div>
				</DialogBase>
			);
		}
	}
}
