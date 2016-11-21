import { h, Component } 				from 'preact/preact';
import DialogBase						from 'com/dialog-base/base';

import LabelYesNo						from 'com/label-yesno/yesno';

import SHUser							from '../shrub/js/user/user';


export default class DialogRegister extends Component {
	constructor( props ) {
		super(props);
		
		this.state = {
			mail: ""
		};

		// Bind functions (avoiding the need to rebind every render)
		this.onChange = this.onChange.bind(this);
		this.doRegister = this.doRegister.bind(this);
	}
	
	componentDidMount() {
		this.registerMail.focus();
	}
	
	validateMail( mail ) {
		// http://stackoverflow.com/a/9204568/5678759
		//return /\S+@\S+\.\S+/.test(mail);
		//return /[^\s@]+@[^\s@]+\.[^\s@]+/.test(mail);
		return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail);
	}

	onChange( e ) {
		this.setState({ mail: e.target.value });
	}
	
	doRegister() {
		SHUser.Register( this.state.mail )
			.then( r => {
				if ( r.status === 201 ) {
					console.log('sent', r.sent);
					location.href = "#user-sent";
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

	render( props, {mail, error} ) {
		var ErrorMessage = error ? {'error': error} : {};
		
		// NOTE: There's a Preact bug that the extra <span /> is working around
		return (
			<DialogBase title="Create Account" ok cancel oktext="Send Activation E-mail" onclick={this.doRegister} {...ErrorMessage}>
				<div>
					<span /><input ref={(input) => this.registerMail = input} id="dialog-register-mail" onchange={this.onChange} class="-text focusable" type="text" name="email" placeholder="E-mail address" /><LabelYesNo value={this.validateMail(mail) ? 1 : -1} />
				</div>
				<div class="-info">
					Expect an e-mail from <code>hello@jammer.vg</code>
				</div>
			</DialogBase>
		);
	}
}
